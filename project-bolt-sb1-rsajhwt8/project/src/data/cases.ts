import type { CourtCase } from '@/types';

const now = Date.now();
const hoursFromNow = (h: number) => new Date(now + h * 3600_000).toISOString();
const hoursAgo = (h: number) => new Date(now - h * 3600_000).toISOString();

export const CASES: CourtCase[] = [
  {
    id: 'c-00821',
    caseNumber: '#00821',
    category: 'relationship',
    title: 'My boyfriend bought a PS5 but says he can\'t afford to take me out.',
    hook: 'MY BOYFRIEND BOUGHT A PS5 BUT SAYS HE CAN\'T AFFORD TO TAKE ME OUT.',
    story:
      'My boyfriend earns ₦450k monthly. Last month he bought a PS5 for ₦350k. I asked if we could go out for my birthday and he said money is tight. I got angry. He says I\'m entitled. He says the PS5 is a one-time purchase but dates are recurring expenses. I\'m not asking for expensive places — just a proper date once in a while.',
    question: 'Who is wrong?',
    questionType: 'who_wrong',
    forLabel: 'HIM',
    againstLabel: 'HER',
    status: 'in_session',
    createdAt: hoursAgo(5),
    closesAt: hoursFromNow(2.7),
    votesFor: 1853,
    votesAgainst: 6568,
    argumentsCount: 1203,
    views: 18900,
    controversialScore: 72,
    funny: false,
    featured: true,
    caseOfDay: true,
    authorName: 'Anonymous',
    authorAnon: true,
    twist: {
      label: 'THERE\'S MORE TO THE STORY',
      content: 'She later found out he also bought a PS5 game (₦55k) the same week. And her birthday dinner would have cost about ₦15k. He has not wished her happy birthday yet.',
    },
    evidence: [
      { id: 'e1', label: 'Original Story', type: 'story', content: 'Full account of the relationship and financial dynamics over the past 8 months.' },
      { id: 'e2', label: 'Timeline', type: 'timeline', content: 'Jan: started dating. Jun: he got raise. Aug: bought PS5 (₦350k). Sep: bought PS5 game (₦55k). Oct: her birthday — he said money is tight.' },
      { id: 'e3', label: 'Receipt', type: 'screenshot', content: 'Screenshot of PS5 order confirmation — ₦350,000 + ₦55,000 game.' },
    ],
    timeline: [
      { id: 't1', label: 'Case submitted', done: true },
      { id: 't2', label: 'Case opened', done: true },
      { id: 't3', label: 'People deliberating', done: true, current: true },
      { id: 't4', label: 'Verdict pending' },
      { id: 't5', label: 'Verdict reached' },
      { id: 't6', label: 'Case closed' },
    ],
  },
  {
    id: 'c-00827',
    caseNumber: '#00827',
    category: 'friendship',
    title: 'My friend said "I\'m on my way" but hadn\'t even entered the bathroom.',
    hook: 'SHE SAID "I\'M ON MY WAY" — SHE HADN\'T EVEN BATHED.',
    story:
      'My friend said she was on her way to meet me. I waited 2 hours. When she finally arrived, she casually mentioned she hadn\'t even bathed when she said "I\'m on my way." She sees nothing wrong with this. I had been standing outside the restaurant in the sun. Who is wrong?',
    question: 'Who is wrong?',
    questionType: 'who_wrong',
    forLabel: 'THE FRIEND',
    againstLabel: 'THE WAITER',
    status: 'in_session',
    createdAt: hoursAgo(3),
    closesAt: hoursFromNow(5),
    votesFor: 2100,
    votesAgainst: 180,
    argumentsCount: 287,
    views: 6700,
    controversialScore: 25,
    funny: true,
    authorName: 'Waiting Forever',
    authorAnon: false,
    evidence: [
      { id: 'e1', label: 'Original Story', type: 'story', content: 'Full account of the 2-hour wait and the casual confession.' },
    ],
    timeline: [
      { id: 't1', label: 'Case submitted', done: true },
      { id: 't2', label: 'Case opened', done: true },
      { id: 't3', label: 'People deliberating', done: true, current: true },
      { id: 't4', label: 'Verdict pending' },
    ],
  },
  {
    id: 'c-00825',
    caseNumber: '#00825',
    category: 'family',
    title: 'My mother told me not to tell anyone — then told the entire family herself.',
    hook: 'MUM SAID "DON\'T TELL ANYONE" — THEN TOLD EVERYONE HERSELF.',
    story:
      'My mum told me a family secret and said "don\'t tell anyone." I kept it to myself for weeks. Then at a family gathering, she casually mentioned it to everyone. When I confronted her, she said "I\'m the mother, I can tell who I want." Is she wrong?',
    question: 'Is mum wrong?',
    questionType: 'right_wrong',
    forLabel: 'Mum is wrong',
    againstLabel: 'Mum is right',
    status: 'in_session',
    createdAt: hoursAgo(4),
    closesAt: hoursFromNow(7),
    votesFor: 3200,
    votesAgainst: 450,
    argumentsCount: 198,
    views: 5200,
    controversialScore: 30,
    funny: true,
    authorName: 'Anonymous',
    authorAnon: true,
    evidence: [
      { id: 'e1', label: 'Original Story', type: 'story', content: 'Full account of the secret and the family gathering revelation.' },
    ],
    timeline: [
      { id: 't1', label: 'Case submitted', done: true },
      { id: 't2', label: 'Case opened', done: true },
      { id: 't3', label: 'People deliberating', done: true, current: true },
      { id: 't4', label: 'Verdict pending' },
    ],
  },
  {
    id: 'c-00817',
    caseNumber: '#00817',
    category: 'friendship',
    title: 'My friend borrowed ₦5k in 2023, never paid back, then posted her new iPhone 15.',
    hook: 'BORROWED ₦5K IN 2023. POSTED IPHONE 15 YESTERDAY.',
    story:
      'My friend borrowed ₦5,000 from me in 2023 and has never paid back. She hasn\'t mentioned the money since. Yesterday she posted her new iPhone 15 on her status. I commented "nice phone" and she replied "thanks babe!" Should I ask for my money back or let it go? We\'re still friends.',
    question: 'Should I ask for my money back?',
    questionType: 'yes_no',
    forLabel: 'Yes, ask',
    againstLabel: 'No, let it go',
    status: 'in_session',
    createdAt: hoursAgo(8),
    closesAt: hoursFromNow(4.2),
    votesFor: 3012,
    votesAgainst: 1269,
    argumentsCount: 632,
    views: 9400,
    controversialScore: 58,
    funny: false,
    authorName: 'Tunde A.',
    authorAnon: false,
    twist: {
      label: 'THERE\'S MORE TO THE STORY',
      content: 'The same friend once lent the submitter ₦10k during university and never asked for it back. The submitter never paid that one either.',
    },
    evidence: [
      { id: 'e1', label: 'Original Story', type: 'story', content: 'Detailed account of the loan and the friendship context.' },
    ],
    timeline: [
      { id: 't1', label: 'Case submitted', done: true },
      { id: 't2', label: 'Case opened', done: true },
      { id: 't3', label: 'People deliberating', done: true, current: true },
      { id: 't4', label: 'Verdict pending' },
    ],
  },
  {
    id: 'c-00814',
    caseNumber: '#00814',
    category: 'family',
    title: 'Mum gave my younger brother ₦50k but gave me ₦20k because I can "manage."',
    hook: '₦50K FOR MY BROTHER. ₦20K FOR ME. "YOU CAN MANAGE."',
    story:
      'My mum gave my younger brother ₦50k for school expenses but gave me ₦20k because she says I\'m older and can manage. We\'re both students at the same university. I\'m actually struggling more — I have rent to pay and he stays in the school hostel. She says the older child should always "understand." Is this fair?',
    question: 'Is mum being fair?',
    questionType: 'fair_unfair',
    forLabel: 'It\'s fair',
    againstLabel: 'It\'s unfair',
    status: 'in_session',
    createdAt: hoursAgo(10),
    closesAt: hoursFromNow(6),
    votesFor: 1480,
    votesAgainst: 2801,
    argumentsCount: 445,
    views: 7100,
    controversialScore: 65,
    funny: false,
    authorName: 'Anonymous',
    authorAnon: true,
    evidence: [
      { id: 'e1', label: 'Original Story', type: 'story', content: 'Family background and financial situation explained.' },
    ],
    timeline: [
      { id: 't1', label: 'Case submitted', done: true },
      { id: 't2', label: 'Case opened', done: true },
      { id: 't3', label: 'People deliberating', done: true, current: true },
      { id: 't4', label: 'Verdict pending' },
    ],
  },
  {
    id: 'c-00811',
    caseNumber: '#00811',
    category: 'workplace',
    title: 'My boss demands everyone arrive by 8AM but strolls in at 10AM himself.',
    hook: 'BOSS SAYS 8AM FOR EVERYONE. 10AM FOR HIMSELF.',
    story:
      'My boss expects everyone to arrive before 8AM and sends passive-aggressive messages if you\'re even 5 minutes late. He regularly arrives around 10AM himself. When someone asked about it, he said "I\'m the boss, I make the rules." Last week he wrote up a colleague for arriving at 8:07. Can I start coming late too?',
    question: 'Can I start coming late?',
    questionType: 'right_wrong',
    forLabel: 'You\'re right',
    againstLabel: 'You\'re wrong',
    status: 'in_session',
    createdAt: hoursAgo(12),
    closesAt: hoursFromNow(8),
    votesFor: 5200,
    votesAgainst: 980,
    argumentsCount: 387,
    views: 11200,
    controversialScore: 40,
    funny: true,
    authorName: 'Office Guy',
    authorAnon: false,
    evidence: [
      { id: 'e1', label: 'Original Story', type: 'story', content: 'Full workplace context described.' },
      { id: 'e2', label: 'Additional Evidence', type: 'additional', content: 'Screenshots of the boss\'s late arrival times logged by colleagues.' },
    ],
    timeline: [
      { id: 't1', label: 'Case submitted', done: true },
      { id: 't2', label: 'Case opened', done: true },
      { id: 't3', label: 'People deliberating', done: true, current: true },
      { id: 't4', label: 'Verdict pending' },
    ],
  },
  {
    id: 'c-00809',
    caseNumber: '#00809',
    category: 'naija',
    title: 'My neighbour complained about my generator — then started his own 10 minutes later.',
    hook: 'COMPLAINED ABOUT MY GENERATOR. STARTED HIS OWN 10 MINUTES LATER.',
    story:
      'My neighbour knocked on my door at 8PM complaining that my generator is too loud. I felt bad and considered turning it off. Then 10 minutes later, he started his own generator — and his is even louder. His is an old "I better pass my neighbour" that shakes the whole compound. Who is wrong?',
    question: 'Who is wrong?',
    questionType: 'who_wrong',
    forLabel: 'THE NEIGHBOUR',
    againstLabel: 'THE SUBMITTER',
    status: 'in_session',
    createdAt: hoursAgo(14),
    closesAt: hoursFromNow(3.5),
    votesFor: 4100,
    votesAgainst: 180,
    argumentsCount: 512,
    views: 15600,
    controversialScore: 15,
    funny: true,
    authorName: 'Gen Set King',
    authorAnon: false,
    evidence: [
      { id: 'e1', label: 'Original Story', type: 'story', content: 'Detailed account of the neighbourhood generator wars.' },
    ],
    timeline: [
      { id: 't1', label: 'Case submitted', done: true },
      { id: 't2', label: 'Case opened', done: true },
      { id: 't3', label: 'People deliberating', done: true, current: true },
      { id: 't4', label: 'Verdict pending' },
    ],
  },
  {
    id: 'c-00806',
    caseNumber: '#00806',
    category: 'money',
    title: 'My ex borrowed ₦120k while we dated. Now she says it was a "gift."',
    hook: '₦120K LOAN. SHE SAYS IT WAS A GIFT NOW THAT WE\'RE DONE.',
    story:
      'My ex borrowed ₦120k from me while we were dating. We broke up 3 months ago. I asked about the money and she said since we\'re no longer together, the money is a gift. It was clearly a loan — she even said "I\'ll pay you back next month" when she borrowed it. She has blocked me on WhatsApp. Should I demand it back?',
    question: 'Should he demand the money back?',
    questionType: 'right_wrong',
    forLabel: 'He\'s right',
    againstLabel: 'He\'s wrong',
    status: 'in_session',
    createdAt: hoursAgo(18),
    closesAt: hoursFromNow(10),
    votesFor: 3900,
    votesAgainst: 2100,
    argumentsCount: 728,
    views: 13400,
    controversialScore: 82,
    funny: false,
    authorName: 'Anonymous',
    authorAnon: true,
    evidence: [
      { id: 'e1', label: 'Original Story', type: 'story', content: 'Full story of the loan, relationship, and breakup.' },
      { id: 'e2', label: 'Screenshot', type: 'screenshot', content: 'WhatsApp messages showing the loan request and "I\'ll pay you back next month."' },
    ],
    timeline: [
      { id: 't1', label: 'Case submitted', done: true },
      { id: 't2', label: 'Case opened', done: true },
      { id: 't3', label: 'People deliberating', done: true, current: true },
      { id: 't4', label: 'Verdict pending' },
    ],
  },
  {
    id: 'c-00803',
    caseNumber: '#00803',
    category: 'campus',
    title: 'My coursemate found exam questions online before the exam. Is it cheating?',
    hook: 'SHE FOUND EXAM QUESTIONS ONLINE. SCORED HIGHEST. IS IT CHEATING?',
    story:
      'My coursemate found the exact exam questions on an online forum the night before the exam. She studied them and scored the highest in class (94%). She didn\'t share with anyone. She says she didn\'t cheat — she just "studied well." The lecturer doesn\'t know. Half the class is failing. Is this cheating or just being smart?',
    question: 'Is this cheating?',
    questionType: 'right_wrong',
    forLabel: 'It\'s cheating',
    againstLabel: 'It\'s smart',
    status: 'in_session',
    createdAt: hoursAgo(20),
    closesAt: hoursFromNow(12),
    votesFor: 2800,
    votesAgainst: 3100,
    argumentsCount: 891,
    views: 16800,
    controversialScore: 91,
    funny: false,
    authorName: 'Campus Watcher',
    authorAnon: false,
    twist: {
      label: 'THERE\'S MORE TO THE STORY',
      content: 'The submitter also knew about the questions but chose not to use them. She scored 51%. The coursemate has been offered a scholarship based on her GPA.',
    },
    evidence: [
      { id: 'e1', label: 'Original Story', type: 'story', content: 'Full context of the exam and how questions were found.' },
    ],
    timeline: [
      { id: 't1', label: 'Case submitted', done: true },
      { id: 't2', label: 'Case opened', done: true },
      { id: 't3', label: 'People deliberating', done: true, current: true },
      { id: 't4', label: 'Verdict pending' },
    ],
  },
  {
    id: 'c-00798',
    caseNumber: '#00798',
    category: 'landlord',
    title: 'My landlord wants 40% rent increase. The tap still leaks after 3 years.',
    hook: '40% RENT INCREASE. THE TAP STILL LEAKS.',
    story:
      'My landlord wants to increase rent by 40% because "everywhere has gone up." No improvements have been made to the flat in 3 years. The tap still leaks. The ceiling has cracks. The gate is broken. Last year he said he\'d fix everything "soon." Is he justified?',
    question: 'Is the landlord justified?',
    questionType: 'right_wrong',
    forLabel: 'Landlord is wrong',
    againstLabel: 'Landlord is right',
    status: 'verdict_pending',
    createdAt: hoursAgo(30),
    closesAt: hoursFromNow(1.5),
    votesFor: 6100,
    votesAgainst: 900,
    argumentsCount: 423,
    views: 9800,
    controversialScore: 35,
    funny: false,
    authorName: 'Frustrated Tenant',
    authorAnon: false,
    evidence: [
      { id: 'e1', label: 'Original Story', type: 'story', content: 'Three years of tenancy issues documented.' },
      { id: 'e2', label: 'Additional Evidence', type: 'additional', content: 'Photos of the leaking tap and peeling paint.' },
    ],
    timeline: [
      { id: 't1', label: 'Case submitted', done: true },
      { id: 't2', label: 'Case opened', done: true },
      { id: 't3', label: 'People deliberating', done: true },
      { id: 't4', label: 'Verdict pending', done: true, current: true },
      { id: 't5', label: 'Verdict reached' },
    ],
  },
  {
    id: 'c-00791',
    caseNumber: '#00791',
    category: 'naija',
    title: 'Danfo driver scratched my car in traffic. I blocked his bus. Passengers blamed ME.',
    hook: 'HE SCRATCHED MY CAR. I BLOCKED HIS BUS. PASSENGERS BLAMED ME.',
    story:
      'I was in Lagos traffic for 2 hours. A danfo driver scratched my car and drove off. I chased him down and blocked his bus with my car. The passengers started shouting at ME — saying I should let him go because they\'re late for work. One woman said "you have a nice car, you can afford to repair it." Who is wrong?',
    question: 'Who is wrong?',
    questionType: 'who_wrong',
    forLabel: 'THE DANFO DRIVER',
    againstLabel: 'THE CAR OWNER',
    status: 'closed',
    createdAt: hoursAgo(48),
    closesAt: hoursAgo(20),
    votesFor: 7800,
    votesAgainst: 1200,
    argumentsCount: 956,
    views: 24200,
    controversialScore: 55,
    funny: true,
    authorName: 'Lagos Driver',
    authorAnon: false,
    evidence: [
      { id: 'e1', label: 'Original Story', type: 'story', content: 'Full Lagos traffic encounter detailed.' },
      { id: 'e2', label: 'Screenshot', type: 'screenshot', content: 'Dashcam footage timestamp.' },
    ],
    timeline: [
      { id: 't1', label: 'Case submitted', done: true },
      { id: 't2', label: 'Case opened', done: true },
      { id: 't3', label: 'People deliberating', done: true },
      { id: 't4', label: 'Verdict pending', done: true },
      { id: 't5', label: 'Verdict reached', done: true },
      { id: 't6', label: 'Case closed', done: true, current: true },
    ],
  },
  {
    id: 'c-00785',
    caseNumber: '#00785',
    category: 'relationship',
    title: 'His "cousin in the village" texts him "goodnight babe 🥰" at 2AM.',
    hook: 'HIS "COUSIN IN THE VILLAGE" TEXTS "GOODNIGHT BABE 🥰" AT 2AM.',
    story:
      'My boyfriend\'s phone keeps buzzing at 2AM. He says it\'s his "cousin in the village." I\'ve never met this cousin. Last night I saw a text saying "goodnight babe 🥰." He says it\'s how cousins greet in their village. I asked to call this cousin. He said the cousin doesn\'t like phone calls. Is he cheating?',
    question: 'Is he cheating?',
    questionType: 'yes_no',
    forLabel: 'Yes, he\'s cheating',
    againstLabel: 'No, it\'s the cousin',
    status: 'closed',
    createdAt: hoursAgo(72),
    closesAt: hoursAgo(40),
    votesFor: 9200,
    votesAgainst: 410,
    argumentsCount: 1420,
    views: 31000,
    controversialScore: 20,
    funny: true,
    authorName: 'Anonymous',
    authorAnon: true,
    evidence: [
      { id: 'e1', label: 'Original Story', type: 'story', content: 'Full account of the 2AM phone episodes.' },
      { id: 'e2', label: 'Screenshot', type: 'screenshot', content: 'Screenshot of the "goodnight babe 🥰" message.' },
    ],
    timeline: [
      { id: 't1', label: 'Case submitted', done: true },
      { id: 't2', label: 'Case opened', done: true },
      { id: 't3', label: 'People deliberating', done: true },
      { id: 't4', label: 'Verdict pending', done: true },
      { id: 't5', label: 'Verdict reached', done: true },
      { id: 't6', label: 'Case closed', done: true, current: true },
    ],
  },
];

export function getCase(id: string): CourtCase | undefined {
  return CASES.find((c) => c.id === id);
}

export function getCaseOfDay(): CourtCase {
  return CASES.find((c) => c.caseOfDay) || CASES.find((c) => c.featured) || CASES[0];
}

export function getFeaturedCase(): CourtCase {
  return CASES.find((c) => c.featured) || CASES[0];
}

export function getLiveCases(): CourtCase[] {
  return CASES.filter((c) => c.status === 'in_session' || c.status === 'verdict_pending')
    .sort((a, b) => b.votesFor + b.votesAgainst - (a.votesFor + a.votesAgainst));
}

export function getNowHearing(): CourtCase {
  return CASES.find((c) => c.status === 'in_session') || CASES[0];
}

export function getUpNext(): CourtCase | undefined {
  return CASES.find((c) => c.status === 'new');
}

export function getComingToCourt(): CourtCase | undefined {
  const hearing = getNowHearing();
  return CASES.find((c) => c.status === 'in_session' && c.id !== hearing?.id);
}

export function getDailyDocket(): CourtCase[] {
  return CASES.filter((c) => c.status !== 'closed').slice(0, 5);
}

export function getCasesByCategory(catId: string): CourtCase[] {
  return CASES.filter((c) => c.category === catId);
}

export function getMostDividedCase(): CourtCase {
  const active = CASES.filter((c) => c.votesFor + c.votesAgainst > 500);
  const pool = active.length > 0 ? active : CASES;
  return [...pool].sort((a, b) => {
    const aDiff = Math.abs(a.votesFor - a.votesAgainst) / (a.votesFor + a.votesAgainst);
    const bDiff = Math.abs(b.votesFor - b.votesAgainst) / (b.votesFor + b.votesAgainst);
    return aDiff - bDiff;
  })[0];
}

export function getDividedCases(): CourtCase[] {
  return CASES.filter((c) => {
    const total = c.votesFor + c.votesAgainst;
    if (total < 500) return false;
    const diff = Math.abs(c.votesFor - c.votesAgainst) / total;
    return diff < 0.1;
  });
}

export function getClosedCases(): CourtCase[] {
  return CASES.filter((c) => c.status === 'closed');
}

export function searchCases(query: string): CourtCase[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return CASES.filter((c) =>
    c.title.toLowerCase().includes(q) ||
    c.story.toLowerCase().includes(q) ||
    c.caseNumber.toLowerCase().includes(q) ||
    c.category.toLowerCase().includes(q) ||
    c.hook.toLowerCase().includes(q)
  );
}

export function getRandomCase(): CourtCase {
  return CASES[Math.floor(Math.random() * CASES.length)];
}
