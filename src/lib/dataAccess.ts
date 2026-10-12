import { supabase } from '@/lib/supabase';
import type { CourtCase, Comment, Category, CategoryId, Notification, HallOfFameEntry, EvidenceItem, TimelineEvent } from '@/types';

function mapRowToCase(row: any): CourtCase {
  return {
    id: row.id,
    caseNumber: row.case_number,
    category: row.category as CategoryId,
    title: row.title,
    hook: row.hook,
    story: row.story,
    question: row.question,
    questionType: row.question_type,
    forLabel: row.for_label,
    againstLabel: row.against_label,
    status: row.status,
    createdAt: row.created_at,
    closesAt: row.closes_at,
    votesFor: row.votes_for,
    votesAgainst: row.votes_against,
    argumentsCount: row.arguments_count,
    views: row.views,
    controversialScore: row.controversial_score,
    funny: row.funny,
    evidence: (row.evidence || []) as EvidenceItem[],
    timeline: (row.timeline || []) as TimelineEvent[],
    twist: row.twist || undefined,
    featured: row.featured || false,
    caseOfDay: row.case_of_day || false,
    authorName: row.author_name,
    authorAnon: row.author_anon,
  };
}

function mapRowToComment(row: any): Comment {
  return {
    id: row.id,
    caseId: row.case_id,
    author: row.author,
    avatar: row.avatar,
    text: row.text,
    side: row.side,
    likes: row.likes,
    replies: row.replies,
    agrees: row.agrees,
    disagrees: row.disagrees,
    createdAt: row.created_at,
    top: row.top || false,
    argumentOfDay: row.argument_of_day || false,
  };
}

function mapRowToCategory(row: any): Category {
  return {
    id: row.id as CategoryId,
    label: row.label,
    emoji: row.emoji,
    accent: row.accent,
    needsModeration: row.needs_moderation || false,
  };
}

function mapRowToNotification(row: any): Notification {
  return {
    id: row.id,
    icon: row.icon,
    text: row.text,
    time: row.time_label,
    read: row.read,
  };
}

function mapRowToHOF(row: any): HallOfFameEntry {
  return {
    id: row.id,
    category: row.category,
    label: row.label,
    emoji: row.emoji,
    caseId: row.case_id,
    caseNumber: row.case_number,
    title: row.title,
    metric: row.metric,
  };
}

export async function fetchCategories(): Promise<Category[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order');
    if (error) throw error;
    return (data || []).map(mapRowToCategory);
  } catch (err) {
    console.warn('Failed to fetch categories from Supabase:', err);
    return [];
  }
}

export async function fetchCases(): Promise<CourtCase[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapRowToCase);
  } catch (err) {
    console.warn('Failed to fetch cases from Supabase:', err);
    return [];
  }
}

export async function fetchComments(): Promise<Comment[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapRowToComment);
  } catch (err) {
    console.warn('Failed to fetch comments from Supabase:', err);
    return [];
  }
}

export async function fetchNotifications(): Promise<Notification[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapRowToNotification);
  } catch (err) {
    console.warn('Failed to fetch notifications from Supabase:', err);
    return [];
  }
}

export async function fetchHallOfFame(): Promise<HallOfFameEntry[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('hall_of_fame')
      .select('*')
      .order('sort_order');
    if (error) throw error;
    return (data || []).map(mapRowToHOF);
  } catch (err) {
    console.warn('Failed to fetch hall of fame from Supabase:', err);
    return [];
  }
}

export async function castVoteInDB(caseId: string, side: 'for' | 'against'): Promise<void> {
  if (!supabase) return;
  try {
    const updates: Record<string, number> = {};
    if (side === 'for') updates.votes_for = 1;
    else updates.votes_against = 1;

    const { error: voteError } = await supabase.from('votes').insert({
      case_id: caseId,
      side,
    });
    if (voteError) throw voteError;

    const { error: caseError } = await supabase.rpc('increment_vote', {
      p_case_id: caseId,
      p_column: side === 'for' ? 'votes_for' : 'votes_against',
    });
    if (caseError) throw caseError;
  } catch (err) {
    console.warn('Failed to record vote in Supabase:', err);
  }
}

export async function addCommentToDB(
  caseId: string,
  text: string,
  side: 'prosecution' | 'defence' | 'neutral'
): Promise<Comment> {
  const newId = `cm-${Date.now()}`;
  const fallbackComment: Comment = {
    id: newId,
    caseId,
    author: 'You',
    avatar: '🧑🏾‍⚖️',
    text,
    side,
    likes: 0,
    replies: 0,
    agrees: 0,
    disagrees: 0,
    createdAt: new Date().toISOString(),
  };

  if (!supabase) return fallbackComment;

  try {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        id: newId,
        case_id: caseId,
        author: 'You',
        avatar: '🧑🏾‍⚖️',
        text,
        side,
        likes: 0,
        replies: 0,
        agrees: 0,
        disagrees: 0,
      })
      .select('*')
      .single();
    if (error) throw error;

    const { error: caseError } = await supabase.rpc('increment_argument_count', {
      p_case_id: caseId,
    });
    if (caseError) throw caseError;

    return mapRowToComment(data);
  } catch (err) {
    console.warn('Failed to record comment in Supabase:', err);
    return fallbackComment;
  }
}

export async function likeCommentInDB(commentId: string, isLiked: boolean): Promise<void> {
  if (!supabase) return;
  try {
    const { error } = await supabase.rpc('adjust_comment_likes', {
      p_comment_id: commentId,
      p_delta: isLiked ? -1 : 1,
    });
    if (error) throw error;
  } catch (err) {
    console.warn('Failed to adjust comment likes in Supabase:', err);
  }
}

export async function agreeCommentInDB(commentId: string, isAgreed: boolean): Promise<void> {
  if (!supabase) return;
  try {
    const { error } = await supabase.rpc('adjust_comment_agrees', {
      p_comment_id: commentId,
      p_delta: isAgreed ? -1 : 1,
    });
    if (error) throw error;
  } catch (err) {
    console.warn('Failed to adjust comment agrees in Supabase:', err);
  }
}

export async function submitCaseToDB(params: {
  category: string;
  title: string;
  story: string;
  question: string;
  anonymous: boolean;
}): Promise<string> {
  const caseNum = `#${String(900 + Math.floor(Math.random() * 999)).padStart(5, '0')}`;
  const caseId = `c-${Date.now()}`;

  if (!supabase) return caseNum;

  try {
    const { error } = await supabase.from('cases').insert({
      id: caseId,
      case_number: caseNum,
      category: params.category,
      title: params.title,
      hook: params.title.toUpperCase(),
      story: params.story,
      question: params.question || params.title,
      question_type: 'who_wrong',
      for_label: 'FOR',
      against_label: 'AGAINST',
      status: 'new',
      author_name: params.anonymous ? 'Anonymous' : 'You',
      author_anon: params.anonymous,
      evidence: [],
      timeline: [
        { id: 't1', label: 'Case submitted', done: true },
        { id: 't2', label: 'Case opened' },
        { id: 't3', label: 'People deliberating' },
        { id: 't4', label: 'Verdict pending' },
      ],
    });
    if (error) throw error;
  } catch (err) {
    console.warn('Failed to submit case to Supabase:', err);
  }

  return caseNum;
}
