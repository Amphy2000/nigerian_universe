import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { type SimNeeds, type PlumbobMood, type CareerDef, type InventoryItem, type GameTime, type SimNPCProfile, type SocialOption } from './types';

interface ToastMessage {
  id: string;
  text: string;
  icon?: string;
  type?: 'success' | 'info' | 'warning' | 'naira';
}

interface SimLifeContextType {
  needs: SimNeeds;
  naira: number;
  career: CareerDef;
  inventory: InventoryItem[];
  gameTime: GameTime;
  mood: PlumbobMood;
  plumbobColor: string;
  npcs: Record<string, SimNPCProfile>;
  activeToasts: ToastMessage[];
  timeSpeed: number; // 0 = pause, 1 = normal, 2 = fast
  setTimeSpeed: (speed: number) => void;
  adjustNeeds: (delta: Partial<SimNeeds>) => void;
  spendNaira: (amount: number, reason: string) => boolean;
  earnNaira: (amount: number, reason: string) => void;
  eatFood: (item: InventoryItem) => void;
  buyItem: (item: InventoryItem) => boolean;
  interactWithNPC: (npcId: string, option: SocialOption) => string;
  doHustleWork: () => { earned: number; message: string } | null;
  sleepOrRest: (energyGain?: number) => void;
  showSimToast: (text: string, icon?: string, type?: ToastMessage['type']) => void;
}

const DEFAULT_NEEDS: SimNeeds = {
  hunger: 85,
  energy: 90,
  social: 75,
  fun: 80,
};

const DEFAULT_CAREER: CareerDef = {
  id: 'tech-junior',
  title: 'Junior Frontend Tech Bro',
  level: 1,
  salary: 15000,
  field: 'Silicon Lagoon (Yaba)',
  description: 'Building sleek React apps while drinking cold energy drinks at the hub.',
  nextPromotion: 'Mid-Level Fullstack Baller (₦35,000/day)',
};

const INITIAL_NPCS: Record<string, SimNPCProfile> = {
  'npc-1': {
    id: 'npc-1',
    name: 'Femi Adeyemi',
    nickname: 'Chairman Femi',
    appearanceKey: 'male-a',
    role: 'Tech Lead & Crypto Enthusiast',
    personality: 'Ambitious, friendly, always looking for the next big startup.',
    relationship: 20,
    favoriteFood: 'Party Jollof Rice & Plantain',
    currentActivity: 'Checking crypto charts near the fountain',
  },
  'npc-2': {
    id: 'npc-2',
    name: 'Chidinma Okonkwo',
    nickname: 'Chi-Chi Queen',
    appearanceKey: 'female-b',
    role: 'Fashion Designer & Lifestyle Influencer',
    personality: 'Stylish, witty, loves owambe parties and bold Ankara prints.',
    relationship: 15,
    favoriteFood: 'Pounded Yam & Egusi with Assorted Meat',
    currentActivity: 'Taking selfies near the plaza trees',
  },
  'npc-3': {
    id: 'npc-3',
    name: 'Alhaji Musa Danladi',
    nickname: 'Mai Suya Supreme',
    appearanceKey: 'male-b',
    role: 'Master Suya Grill Artisan',
    personality: 'Warm, generous, guardian of the secret Yaji spice recipe.',
    relationship: 30,
    favoriteFood: 'Tender Beef Suya with Extra Onions',
    currentActivity: 'Grilling prime cuts over hot coals',
  },
  'npc-4': {
    id: 'npc-4',
    name: 'Blessing Udoh',
    nickname: 'Barrister Blessing',
    appearanceKey: 'female-a',
    role: 'Corporate Lawyer & Community Advocate',
    personality: 'Sharp, principled, passionate about civic justice and justice.',
    relationship: 10,
    favoriteFood: 'Pepper Soup with Fresh Catfish',
    currentActivity: 'Reviewing community legal briefs in the plaza',
  },
};

const SimLifeContext = createContext<SimLifeContextType | null>(null);

export function SimLifeProvider({ children }: { children: React.ReactNode }) {
  const [needs, setNeeds] = useState<SimNeeds>(() => {
    try {
      const saved = localStorage.getItem('naija_sim_needs');
      return saved ? JSON.parse(saved) : DEFAULT_NEEDS;
    } catch {
      return DEFAULT_NEEDS;
    }
  });

  const [naira, setNaira] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('naija_sim_naira');
      return saved ? JSON.parse(saved) : 35000; // Starting wallet: ₦35,000
    } catch {
      return 35000;
    }
  });

  const [career, setCareer] = useState<CareerDef>(() => {
    try {
      const saved = localStorage.getItem('naija_sim_career');
      return saved ? JSON.parse(saved) : DEFAULT_CAREER;
    } catch {
      return DEFAULT_CAREER;
    }
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('naija_sim_inventory');
      return saved ? JSON.parse(saved) : [
        {
          id: 'maltina-1',
          name: 'Chilled Maltina',
          category: 'drink',
          icon: '🥤',
          price: 800,
          description: 'Ice-cold malt drink. Pure replenishment.',
          effects: { hunger: 10, energy: 15, fun: 10 },
        },
      ];
    } catch {
      return [];
    }
  });

  const [npcs, setNpcs] = useState<Record<string, SimNPCProfile>>(INITIAL_NPCS);
  const [timeSpeed, setTimeSpeed] = useState<number>(1);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [gameTime, setGameTime] = useState<GameTime>({
    hour: 14,
    minute: 30,
    day: 1,
    period: 'afternoon',
  });

  // Persist key state
  useEffect(() => {
    localStorage.setItem('naija_sim_needs', JSON.stringify(needs));
  }, [needs]);

  useEffect(() => {
    localStorage.setItem('naija_sim_naira', JSON.stringify(naira));
  }, [naira]);

  useEffect(() => {
    localStorage.setItem('naija_sim_career', JSON.stringify(career));
  }, [career]);

  useEffect(() => {
    localStorage.setItem('naija_sim_inventory', JSON.stringify(inventory));
  }, [inventory]);

  const showSimToast = useCallback((text: string, icon = '✨', type: ToastMessage['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 5);
    setToasts((prev) => [...prev.slice(-3), { id, text, icon, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // Live game clock & natural need decay
  useEffect(() => {
    if (timeSpeed === 0) return;
    const intervalMs = timeSpeed === 2 ? 800 : 2000;

    const timer = setInterval(() => {
      // Advance clock: 1 real tick = 5 game minutes
      setGameTime((prev) => {
        let newMin = prev.minute + 5;
        let newHour = prev.hour;
        let newDay = prev.day;

        if (newMin >= 60) {
          newMin = 0;
          newHour += 1;
        }
        if (newHour >= 24) {
          newHour = 0;
          newDay += 1;
        }

        let period: GameTime['period'] = 'afternoon';
        if (newHour >= 6 && newHour < 12) period = 'morning';
        else if (newHour >= 12 && newHour < 17) period = 'afternoon';
        else if (newHour >= 17 && newHour < 20) period = 'sunset';
        else period = 'night';

        return { hour: newHour, minute: newMin, day: newDay, period };
      });

      // Needs decay gently
      setNeeds((prev) => ({
        hunger: Math.max(0, prev.hunger - 0.25),
        energy: Math.max(0, prev.energy - 0.18),
        social: Math.max(0, prev.social - 0.22),
        fun: Math.max(0, prev.fun - 0.20),
      }));
    }, intervalMs);

    return () => clearInterval(timer);
  }, [timeSpeed]);

  // Adjust needs utility
  const adjustNeeds = useCallback((delta: Partial<SimNeeds>) => {
    setNeeds((prev) => ({
      hunger: Math.min(100, Math.max(0, prev.hunger + (delta.hunger ?? 0))),
      energy: Math.min(100, Math.max(0, prev.energy + (delta.energy ?? 0))),
      social: Math.min(100, Math.max(0, prev.social + (delta.social ?? 0))),
      fun: Math.min(100, Math.max(0, prev.fun + (delta.fun ?? 0))),
    }));
  }, []);

  // Spend Naira
  const spendNaira = useCallback((amount: number, reason: string): boolean => {
    if (naira < amount) {
      showSimToast(`Sapa is real! You need ₦${amount.toLocaleString()} but only have ₦${naira.toLocaleString()}`, '💸', 'warning');
      return false;
    }
    setNaira((prev) => prev - amount);
    showSimToast(`Spent ₦${amount.toLocaleString()} on ${reason}`, '💳', 'naira');
    return true;
  }, [naira, showSimToast]);

  // Earn Naira
  const earnNaira = useCallback((amount: number, reason: string) => {
    setNaira((prev) => prev + amount);
    showSimToast(`Alert! Credited ₦${amount.toLocaleString()} (${reason})`, '💰', 'success');
  }, [showSimToast]);

  // Eat food
  const eatFood = useCallback((item: InventoryItem) => {
    adjustNeeds(item.effects);
    setInventory((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      if (idx === -1) return prev;
      const next = [...prev];
      next.splice(idx, 1);
      return next;
    });
    showSimToast(`Chowed down on ${item.name}! Belly is happy.`, '🍲', 'success');
  }, [adjustNeeds, showSimToast]);

  // Buy item
  const buyItem = useCallback((item: InventoryItem): boolean => {
    if (!spendNaira(item.price, item.name)) return false;
    setInventory((prev) => [...prev, item]);
    return true;
  }, [spendNaira]);

  // Sleep / Rest
  const sleepOrRest = useCallback((energyGain = 45) => {
    adjustNeeds({ energy: energyGain, hunger: -10 });
    showSimToast(`Rested peacefully. Energy recharged! (+${energyGain} Power)`, '⚡', 'success');
  }, [adjustNeeds, showSimToast]);

  // Do hustle work (Tech Hub / Side hustle)
  const doHustleWork = useCallback(() => {
    if (needs.energy < 20) {
      showSimToast('You are too exhausted to hustle! Go rest on a bench or sleep first.', '😴', 'warning');
      return null;
    }
    const pay = career.salary;
    adjustNeeds({ energy: -25, hunger: -15, fun: -10 });
    earnNaira(pay, `${career.title} daily hustle`);
    return { earned: pay, message: `Hustled hard at ${career.field}! Paid ₦${pay.toLocaleString()}` };
  }, [career.field, career.salary, career.title, earnNaira, needs.energy, showSimToast, adjustNeeds]);

  // Social interaction with NPC
  const interactWithNPC = useCallback((npcId: string, option: SocialOption): string => {
    const npc = npcs[npcId];
    if (!npc) return 'Hello!';

    if (option.cost && !spendNaira(option.cost, `${option.label} to ${npc.name}`)) {
      return 'No enough cash in pocket!';
    }

    // Apply social & fun gains
    adjustNeeds({
      social: option.effects.social,
      fun: option.effects.fun,
    });

    // Update relationship with NPC
    setNpcs((prev) => {
      const current = prev[npcId];
      if (!current) return prev;
      const newRel = Math.min(100, Math.max(-100, current.relationship + option.effects.relationship));
      return {
        ...prev,
        [npcId]: { ...current, relationship: newRel },
      };
    });

    const reply = option.npcReplies[Math.floor(Math.random() * option.npcReplies.length)];
    showSimToast(`${npc.name}: "${reply}"`, '💬', 'info');
    return reply;
  }, [adjustNeeds, npcs, showSimToast, spendNaira]);

  // Plumbob mood calculation
  const mood: PlumbobMood = useMemo(() => {
    const avg = (needs.hunger + needs.energy + needs.social + needs.fun) / 4;
    if (needs.hunger < 25) return 'hungry';
    if (needs.energy < 20) return 'tired';
    if (needs.fun < 20 && needs.social < 20) return 'vawulence';
    if (avg >= 80) return 'ecstatic';
    if (avg >= 60) return 'happy';
    if (avg >= 40) return 'fine';
    return 'bored';
  }, [needs]);

  // Plumbob hex color
  const plumbobColor = useMemo(() => {
    switch (mood) {
      case 'ecstatic': return '#00ff66'; // Glowing Emerald Green
      case 'happy':    return '#44dd44'; // Bright Green
      case 'fine':     return '#ffd700'; // Gold/Yellow
      case 'hungry':   return '#ff8800'; // Warning Orange
      case 'tired':    return '#ff5500'; // Amber/Red
      case 'bored':    return '#aa66ff'; // Purple/Bored
      case 'vawulence':return '#ff1133'; // Hot Crimson Red
    }
  }, [mood]);

  const value: SimLifeContextType = {
    needs,
    naira,
    career,
    inventory,
    gameTime,
    mood,
    plumbobColor,
    npcs,
    activeToasts: toasts,
    timeSpeed,
    setTimeSpeed,
    adjustNeeds,
    spendNaira,
    earnNaira,
    eatFood,
    buyItem,
    interactWithNPC,
    doHustleWork,
    sleepOrRest,
    showSimToast,
  };

  return <SimLifeContext.Provider value={value}>{children}</SimLifeContext.Provider>;
}

export function useSimLife() {
  const context = useContext(SimLifeContext);
  if (!context) {
    throw new Error('useSimLife must be used within a SimLifeProvider');
  }
  return context;
}
