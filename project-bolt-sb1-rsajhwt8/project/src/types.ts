export type CategoryId =
  | 'relationship'
  | 'friendship'
  | 'family'
  | 'workplace'
  | 'money'
  | 'campus'
  | 'landlord'
  | 'neighborhood'
  | 'naija'
  | 'celebrity';

export interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
  accent: string;
  needsModeration?: boolean;
}

export type CaseStatus = 'new' | 'in_session' | 'verdict_pending' | 'closed';

export interface CourtCase {
  id: string;
  caseNumber: string;
  category: CategoryId;
  title: string;
  hook: string;
  story: string;
  question: string;
  questionType: 'right_wrong' | 'yes_no' | 'who_wrong' | 'fair_unfair';
  forLabel: string;
  againstLabel: string;
  status: CaseStatus;
  createdAt: string;
  closesAt: string;
  votesFor: number;
  votesAgainst: number;
  argumentsCount: number;
  views: number;
  controversialScore: number;
  funny: boolean;
  evidence: EvidenceItem[];
  timeline: TimelineEvent[];
  twist?: {
    label: string;
    content: string;
  };
  featured?: boolean;
  caseOfDay?: boolean;
  authorName: string;
  authorAnon: boolean;
}

export interface EvidenceItem {
  id: string;
  label: string;
  type: 'story' | 'timeline' | 'screenshot' | 'additional';
  content: string;
}

export interface TimelineEvent {
  id: string;
  label: string;
  done?: boolean;
  current?: boolean;
}

export interface Comment {
  id: string;
  caseId: string;
  author: string;
  avatar: string;
  text: string;
  side: 'prosecution' | 'defence' | 'neutral';
  likes: number;
  replies: number;
  agrees: number;
  disagrees: number;
  createdAt: string;
  top?: boolean;
  argumentOfDay?: boolean;
}

export interface Notification {
  id: string;
  icon: 'gavel' | 'fire' | 'chart' | 'message' | 'verdict';
  text: string;
  time: string;
  read: boolean;
}

export interface UserProfile {
  username: string;
  casesBrought: number;
  verdictsDelivered: number;
  arguments: number;
  majorityAlignment: number;
  badges: Badge[];
  mostControversialVerdict?: string;
  strongestUnpopularOpinion?: string;
}

export interface Badge {
  id: string;
  label: string;
  emoji: string;
  description: string;
  earned: boolean;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export interface HallOfFameEntry {
  id: string;
  category: string;
  label: string;
  emoji: string;
  caseId: string;
  caseNumber: string;
  title: string;
  metric: string;
}

export type DividedLabel = 'deadlock' | 'divided' | 'controversial' | 'chaos';
