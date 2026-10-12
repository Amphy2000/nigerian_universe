import type { Comment, Notification, UserProfile } from '@/types';

export const COMMENTS: Comment[] = [
  // Case #00821 — PS5 matter
  {
    id: 'cm-1', caseId: 'c-00821', author: 'Adaora K.', avatar: '👩🏾',
    text: 'Buying a PS5 doesn\'t mean he owes her a date, but saying he has no money while buying luxury items is definitely suspicious. The issue isn\'t the PS5 — it\'s the lie.',
    side: 'prosecution', likes: 1842, replies: 24, agrees: 1620, disagrees: 89,
    createdAt: '4h ago', top: true, argumentOfDay: true,
  },
  {
    id: 'cm-2', caseId: 'c-00821', author: 'Emeka J.', avatar: '👨🏾',
    text: 'Abeg, buying PS5 doesn\'t mean he owes you dates 😂 His money, his choice.',
    side: 'defence', likes: 342, replies: 12, agrees: 298, disagrees: 45,
    createdAt: '4h ago', top: true,
  },
  {
    id: 'cm-3', caseId: 'c-00821', author: 'Bisi M.', avatar: '👩🏿',
    text: 'Both of them are wrong. This relationship needs communication, not a public court. But since we\'re here — he\'s wronger.',
    side: 'neutral', likes: 201, replies: 5, agrees: 180, disagrees: 21,
    createdAt: '3h ago',
  },
  {
    id: 'cm-4', caseId: 'c-00821', author: 'Kunle O.', avatar: '🧑🏾',
    text: 'She said she\'s not asking for expensive places. Just a proper date. What exactly is the problem here?',
    side: 'prosecution', likes: 178, replies: 3, agrees: 160, disagrees: 18,
    createdAt: '2h ago',
  },
  {
    id: 'cm-5', caseId: 'c-00821', author: 'Zainab A.', avatar: '👩🏾‍🦱',
    text: 'My brother, if your babe no vex you, who go vex? She has every right to feel some type of way.',
    side: 'prosecution', likes: 145, replies: 2, agrees: 130, disagrees: 15,
    createdAt: '2h ago',
  },
  {
    id: 'cm-6', caseId: 'c-00821', author: 'Daniel T.', avatar: '🧔🏾',
    text: 'PS5 is an investment in mental health. Dates are temporary. Think about it.',
    side: 'defence', likes: 98, replies: 15, agrees: 80, disagrees: 40,
    createdAt: '1h ago',
  },
  {
    id: 'cm-7', caseId: 'c-00821', author: 'Funke R.', avatar: '👩🏿‍🦰',
    text: '₦450k in this economy and he bought PS5? Omo, that man is not serious.',
    side: 'prosecution', likes: 87, replies: 1, agrees: 79, disagrees: 8,
    createdAt: '45m ago',
  },

  // Case #00817 — ₦5k loan
  {
    id: 'cm-8', caseId: 'c-00817', author: 'Chidi N.', avatar: '👨🏾',
    text: '₦5,000 since 2023 and she bought iPhone 15? Collect your money with interest sef.',
    side: 'prosecution', likes: 412, replies: 20, agrees: 380, disagrees: 32,
    createdAt: '6h ago', top: true,
  },
  {
    id: 'cm-9', caseId: 'c-00817', author: 'Grace O.', avatar: '👩🏾',
    text: 'It\'s been 2 years. At some point you just let it go. The friendship is worth more than ₦5k.',
    side: 'defence', likes: 234, replies: 11, agrees: 200, disagrees: 34,
    createdAt: '5h ago', top: true,
  },
  {
    id: 'cm-10', caseId: 'c-00817', author: 'Yusuf I.', avatar: '🧑🏿',
    text: 'The audacity to post iPhone 15 when you owe somebody money. Naija people sha.',
    side: 'prosecution', likes: 189, replies: 4, agrees: 175, disagrees: 14,
    createdAt: '4h ago',
  },

  // Case #00809 — Generator wars
  {
    id: 'cm-11', caseId: 'c-00809', author: 'Bayo E.', avatar: '🧑🏾',
    text: 'This is peak Naija behaviour. Complain about generator noise then start your own 10 minutes later 😂😂😂',
    side: 'prosecution', likes: 523, replies: 18, agrees: 490, disagrees: 33,
    createdAt: '10h ago', top: true,
  },
  {
    id: 'cm-12', caseId: 'c-00809', author: 'Ngozi D.', avatar: '👩🏾‍💼',
    text: 'Both generators are probably I-pass-my-neighbour. The whole street is noisy. Nobody is right here.',
    side: 'neutral', likes: 198, replies: 7, agrees: 170, disagrees: 28,
    createdAt: '8h ago',
  },

  // Case #00803 — Exam cheating
  {
    id: 'cm-13', caseId: 'c-00803', author: 'Professor X.', avatar: '🧑🏾‍🏫',
    text: 'If you found the questions online and studied them knowing they would be on the exam, that\'s academic dishonesty. Full stop.',
    side: 'prosecution', likes: 680, replies: 30, agrees: 610, disagrees: 70,
    createdAt: '15h ago', top: true, argumentOfDay: true,
  },
  {
    id: 'cm-14', caseId: 'c-00803', author: 'Sade A.', avatar: '👩🏾‍🎓',
    text: 'The lecturer should take responsibility too. How did the exact questions end up online? That\'s a bigger problem.',
    side: 'defence', likes: 340, replies: 12, agrees: 290, disagrees: 50,
    createdAt: '12h ago',
  },
];

export function getCommentsByCase(caseId: string): Comment[] {
  return COMMENTS.filter((c) => c.caseId === caseId);
}

export function getArgumentOfDay(caseId: string): Comment | undefined {
  return COMMENTS.find((c) => c.caseId === caseId && c.argumentOfDay);
}

export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', icon: 'gavel', text: 'Your matter #00942 has been accepted into Court.', time: '2h ago', read: false },
  { id: 'n2', icon: 'fire', text: 'The Court is currently deliberating on your matter.', time: '5h ago', read: false },
  { id: 'n3', icon: 'chart', text: 'Your case has received 4,281 verdicts.', time: '1d ago', read: true },
  { id: 'n4', icon: 'verdict', text: 'The verdict is in on Case #00791. The people have spoken.', time: '2d ago', read: true },
  { id: 'n5', icon: 'message', text: 'Someone replied to your courtroom argument on Case #00821.', time: '2d ago', read: true },
  { id: 'n6', icon: 'gavel', text: 'The Chief Judge says: "This matter has entered serious territory."', time: '3d ago', read: true },
  { id: 'n7', icon: 'fire', text: 'Case #00803 has reached DEADLOCK. The Court is divided.', time: '3d ago', read: true },
];

export const USER_PROFILE: UserProfile = {
  username: 'CourtCitizen',
  casesBrought: 12,
  verdictsDelivered: 184,
  arguments: 37,
  majorityAlignment: 74,
  mostControversialVerdict: '#00821',
  strongestUnpopularOpinion: '#00712',
  badges: [
    { id: 'b1', label: 'First Appearance', emoji: '🏛️', description: 'Brought your first matter', earned: true },
    { id: 'b2', label: 'Regular Juror', emoji: '⚖️', description: 'Delivered 50+ verdicts', earned: true },
    { id: 'b3', label: 'Hot Take', emoji: '🔥', description: 'Posted an argument with 100+ agrees', earned: true },
    { id: 'b4', label: 'Court Veteran', emoji: '👑', description: 'Active for 30+ days', earned: true },
    { id: 'b5', label: 'Senior Juror', emoji: '🎖️', description: 'Delivered 200+ verdicts', earned: false },
    { id: 'b6', label: 'Chief Juror', emoji: '🏆', description: 'Delivered 500+ verdicts', earned: false },
  ],
};

export const REPORT_REASONS = [
  'Harassment',
  'Personal information',
  'Defamation',
  'Hate speech',
  'Spam',
  'Other',
];
