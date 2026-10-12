export const CHIEF_JUDGE_QUOTES = {
  onVote: [
    "ORDER! ORDER!! 😭",
    "The Court has seen enough.",
    "Na wa o. Nigerians have spoken.",
    "This matter has entered serious territory.",
    "Hmm. The Court needs more evidence.",
  ],
  onVerdict: [
    "The people have spoken.",
    "Na majority carry am.",
    "Case closed.",
    "Both parties should sit down and talk.",
    "This Court is officially divided.",
  ],
  onDivided: [
    "This Court is officially divided.",
    "Abeg, we need more jurors on this one.",
    "Only a few votes separate right from wrong here.",
  ],
  onEmpty: [
    "Abeg, bring your matter. The Court is waiting.",
    "No cases here yet. Make the Court hear this one.",
    "Hmm... the courtroom is empty. Who has a matter?",
  ],
  onSubmit: [
    "Your matter has entered the court queue.",
    "Abeg, explain yourself. The Court is listening.",
    "This matter get layers. We will hear it.",
  ],
  onCaseOpen: [
    "Let's hear your side.",
    "This matter get layers.",
    "Make the Court hear this one.",
  ],
  onClosed: [
    "CASE CLOSED.",
    "The verdict don enter.",
    "Na majority carry am. Case closed.",
  ],
};

export function getRandomQuote(category: keyof typeof CHIEF_JUDGE_QUOTES): string {
  const quotes = CHIEF_JUDGE_QUOTES[category];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export function getQuoteForContext(
  context: 'vote' | 'verdict' | 'divided' | 'empty' | 'submit' | 'caseOpen' | 'closed',
  seed?: number
): string {
  const map: Record<typeof context, keyof typeof CHIEF_JUDGE_QUOTES> = {
    vote: 'onVote',
    verdict: 'onVerdict',
    divided: 'onDivided',
    empty: 'onEmpty',
    submit: 'onSubmit',
    caseOpen: 'onCaseOpen',
    closed: 'onClosed',
  };
  const quotes = CHIEF_JUDGE_QUOTES[map[context]];
  const idx = seed !== undefined ? seed % quotes.length : Math.floor(Math.random() * quotes.length);
  return quotes[idx];
}

export const COURT_PHRASES = {
  enter: 'Abeg, enter court.',
  bring: 'Bring your matter.',
  hearSide: "Let's hear your side.",
  whoWrong: 'Na who dey wrong?',
  hearThis: 'Make the Court hear this one.',
  hmm: 'Hmm...',
  layers: 'This matter get layers.',
  moreToStory: "There's more to this story.",
  order: 'Order!',
  verdictIn: 'Verdict don enter.',
  majority: 'Na majority carry am.',
  caseClosed: 'Case closed.',
};

import type { HallOfFameEntry } from '@/types';

export const HALL_OF_FAME: HallOfFameEntry[] = [
  { id: 'h1', category: 'Most Voted', label: 'Most Voted Case', emoji: '🏆', caseId: 'c-00785', caseNumber: '#00785', title: 'Is he cheating?', metric: '9,610 votes' },
  { id: 'h2', category: 'Most Divided', label: 'Most Divided', emoji: '⚔️', caseId: 'c-00803', caseNumber: '#00803', title: 'Is this cheating?', metric: '47% / 53%' },
  { id: 'h3', category: 'Most Controversial', label: 'Most Controversial', emoji: '🔥', caseId: 'c-00806', caseNumber: '#00806', title: 'Should I pay back?', metric: '82% controversial' },
  { id: 'h4', category: 'Funniest', label: 'Funniest Matter', emoji: '😂', caseId: 'c-00809', caseNumber: '#00809', title: 'The Generator Wars', metric: '4,280 laughs' },
  { id: 'h5', category: 'Most Chaotic', label: 'Most Chaotic', emoji: '💀', caseId: 'c-00791', caseNumber: '#00791', title: 'Danfo vs Car', metric: '9,000 votes' },
  { id: 'h6', category: 'Case of the Year', label: 'Case of the Year', emoji: '👑', caseId: 'c-00821', caseNumber: '#00821', title: 'The PS5 Matter', metric: '8,421 verdicts' },
];
