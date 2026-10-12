import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Toast, Comment, CourtCase } from '@/types';
import { CASES, getCase, getRandomCase } from '@/data/cases';
import { COMMENTS } from '@/data/mockData';
import {
  fetchCases,
  fetchComments,
  castVoteInDB,
  addCommentToDB,
  likeCommentInDB,
  agreeCommentInDB,
} from '@/lib/dataAccess';

export type PlatformPage = 'home' | 'explore' | 'football' | 'games' | 'court' | 'trending' | 'submit' | 'activity' | 'profile' | 'archive';
export type Page = PlatformPage;

interface SubmittedCase {
  caseNumber: string;
  category: string;
  title: string;
  story: string;
  question: string;
  anonymous: boolean;
}

interface VoteRecord {
  side: 'for' | 'against';
  caseId: string;
}

interface AppState {
  page: Page;
  navigate: (page: Page) => void;
  openCase: (caseId: string) => void;
  closeCase: () => void;
  currentCaseId: string | null;
  currentCase: CourtCase | null;
  hasVoted: (caseId: string) => boolean;
  getVote: (caseId: string) => 'for' | 'against' | null;
  castVote: (caseId: string, side: 'for' | 'against') => void;
  voteHistory: VoteRecord[];
  cases: CourtCase[];
  comments: Comment[];
  addComment: (caseId: string, text: string, side: 'prosecution' | 'defence' | 'neutral') => void;
  likeComment: (commentId: string) => void;
  agreeComment: (commentId: string) => void;
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  submittedCase: SubmittedCase | null;
  setSubmittedCase: (c: SubmittedCase | null) => void;
  peopleInCourt: number;
  liveViewers: Record<string, number>;
  openRandomCase: () => void;
  hasSeenOnboarding: boolean;
  completeOnboarding: () => void;
  dataLoaded: boolean;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<Page>('explore');
  const [currentCaseId, setCurrentCaseId] = useState<string | null>(null);
  const [cases, setCases] = useState<CourtCase[]>(CASES);
  const [comments, setComments] = useState<Comment[]>(COMMENTS);
  const [votes, setVotes] = useState<Record<string, 'for' | 'against'>>({});
  const [voteHistory, setVoteHistory] = useState<VoteRecord[]>([]);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [agreedComments, setAgreedComments] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [submittedCase, setSubmittedCase] = useState<SubmittedCase | null>(null);
  const [peopleInCourt, setPeopleInCourt] = useState(1284);
  const [liveViewers, setLiveViewers] = useState<Record<string, number>>({});
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load data from Supabase on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [dbCases, dbComments] = await Promise.all([
          fetchCases(),
          fetchComments(),
        ]);
        if (cancelled) return;
        if (dbCases.length > 0) setCases(dbCases);
        if (dbComments.length > 0) setComments(dbComments);
        setDataLoaded(true);

        const initial: Record<string, number> = {};
        (dbCases.length > 0 ? dbCases : CASES).forEach((c) => {
          if (c.status !== 'closed') {
            const base = Math.floor(50 + Math.random() * 200);
            initial[c.id] = c.featured ? base + 80 : base;
          }
        });
        setLiveViewers(initial);
      } catch (err) {
        console.error('Failed to load from Supabase, using static data', err);
        setDataLoaded(true);
        const initial: Record<string, number> = {};
        CASES.forEach((c) => {
          if (c.status !== 'closed') {
            const base = Math.floor(50 + Math.random() * 200);
            initial[c.id] = c.featured ? base + 80 : base;
          }
        });
        setLiveViewers(initial);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Simulated live activity
  useEffect(() => {
    const interval = setInterval(() => {
      setCases((prev) =>
        prev.map((c) => {
          if (c.status === 'closed') return c;
          const isFeatured = c.featured || c.caseOfDay;
          const isActive = c.status === 'in_session';
          const baseBump = isFeatured ? 5 : isActive ? 3 : 1;
          const voteBump = Math.floor(Math.random() * baseBump);
          const argBump = Math.random() > (isFeatured ? 0.5 : 0.75) ? 1 : 0;
          return {
            ...c,
            votesFor: c.votesFor + (Math.random() > 0.4 ? voteBump : 0),
            votesAgainst: c.votesAgainst + (Math.random() > 0.6 ? voteBump : 0),
            argumentsCount: c.argumentsCount + argBump,
            views: c.views + Math.floor(Math.random() * (isFeatured ? 15 : 5)),
          };
        })
      );
      setPeopleInCourt((p) => {
        const delta = Math.floor(Math.random() * 9) - 4;
        return Math.max(800, p + delta);
      });
      setLiveViewers((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((id) => {
          const delta = Math.floor(Math.random() * 7) - 3;
          next[id] = Math.max(20, next[id] + delta);
        });
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const navigate = useCallback((p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const openCase = useCallback((caseId: string) => {
    setCurrentCaseId(caseId);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const closeCase = useCallback(() => {
    setCurrentCaseId(null);
  }, []);

  const openRandomCase = useCallback(() => {
    const pool = cases.length > 0 ? cases : CASES;
    const random = pool[Math.floor(Math.random() * pool.length)];
    setCurrentCaseId(random.id);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [cases]);

  const hasVoted = useCallback((caseId: string) => caseId in votes, [votes]);
  const getVote = useCallback((caseId: string) => votes[caseId] ?? null, [votes]);

  const castVote = useCallback(
    (caseId: string, side: 'for' | 'against') => {
      if (caseId in votes) return;
      setVotes((prev) => ({ ...prev, [caseId]: side }));
      setVoteHistory((prev) => [...prev, { caseId, side }]);
      setCases((prev) =>
        prev.map((c) =>
          c.id === caseId
            ? {
                ...c,
                votesFor: c.votesFor + (side === 'for' ? 1 : 0),
                votesAgainst: c.votesAgainst + (side === 'against' ? 1 : 0),
              }
            : c
        )
      );
      castVoteInDB(caseId, side).catch((err) => {
        console.error('Failed to persist vote', err);
      });
    },
    [votes]
  );

  const addComment = useCallback(
    (caseId: string, text: string, side: 'prosecution' | 'defence' | 'neutral') => {
      const optimistic: Comment = {
        id: `cm-${Date.now()}`,
        caseId,
        author: 'You',
        avatar: '🧑🏾‍⚖️',
        text,
        side,
        likes: 0,
        replies: 0,
        agrees: 0,
        disagrees: 0,
        createdAt: 'just now',
      };
      setComments((prev) => [optimistic, ...prev]);
      setCases((prev) =>
        prev.map((c) => (c.id === caseId ? { ...c, argumentsCount: c.argumentsCount + 1 } : c))
      );
      addCommentToDB(caseId, text, side).then((saved) => {
        setComments((prev) => prev.map((c) => (c.id === optimistic.id ? saved : c)));
      }).catch((err) => {
        console.error('Failed to persist comment', err);
        showToast('Could not save your argument. Please try again.', 'error');
      });
    },
    [showToast]
  );

  const likeComment = useCallback((commentId: string) => {
    const isLiked = likedComments.has(commentId);
    setLikedComments((prev) => {
      const next = new Set(prev);
      if (isLiked) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, likes: c.likes + (isLiked ? -1 : 1) } : c
      )
    );
    likeCommentInDB(commentId, isLiked).catch((err) => {
      console.error('Failed to persist like', err);
    });
  }, [likedComments]);

  const agreeComment = useCallback((commentId: string) => {
    const isAgreed = agreedComments.has(commentId);
    setAgreedComments((prev) => {
      const next = new Set(prev);
      if (isAgreed) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, agrees: c.agrees + (isAgreed ? -1 : 1) } : c
      )
    );
    agreeCommentInDB(commentId, isAgreed).catch((err) => {
      console.error('Failed to persist agree', err);
    });
  }, [agreedComments]);

  const completeOnboarding = useCallback(() => {
    setHasSeenOnboarding(true);
  }, []);

  const currentCase = currentCaseId
    ? cases.find((c) => c.id === currentCaseId) ?? getCase(currentCaseId) ?? null
    : null;

  return (
    <AppContext.Provider
      value={{
        page,
        navigate,
        openCase,
        closeCase,
        currentCaseId,
        currentCase,
        hasVoted,
        getVote,
        castVote,
        voteHistory,
        cases,
        comments,
        addComment,
        likeComment,
        agreeComment,
        toasts,
        showToast,
        submittedCase,
        setSubmittedCase,
        peopleInCourt,
        liveViewers,
        openRandomCase,
        hasSeenOnboarding,
        completeOnboarding,
        dataLoaded,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
