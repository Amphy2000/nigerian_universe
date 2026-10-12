export type NeedType = 'hunger' | 'energy' | 'social' | 'fun';

export interface SimNeeds {
  hunger: number; // 0 (Starving) - 100 (Belle Full)
  energy: number; // 0 (Exhausted) - 100 (Full Power)
  social: number; // 0 (Lonely) - 100 (Cruise Master)
  fun: number;    // 0 (Bored) - 100 (Maximum Enjoyment)
}

export type PlumbobMood = 'ecstatic' | 'happy' | 'fine' | 'hungry' | 'tired' | 'bored' | 'vawulence';

export interface CareerDef {
  id: string;
  title: string;
  level: number;
  salary: number; // Daily salary in Naira
  field: string;
  description: string;
  nextPromotion: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'food' | 'drink' | 'clothing' | 'gadget' | 'souvenir';
  icon: string;
  price: number;
  description: string;
  effects: Partial<SimNeeds>;
}

export interface SocialOption {
  id: string;
  label: string;
  pidgin: string;
  category: 'friendly' | 'funny' | 'cultural' | 'hustle' | 'romance' | 'vawulence';
  minRelationship?: number;
  cost?: number; // E.g. spraying money
  effects: {
    social: number;
    fun: number;
    relationship: number;
  };
  npcReplies: string[];
}

export interface SimNPCProfile {
  id: string;
  name: string;
  nickname: string;
  appearanceKey: string;
  role: string;
  personality: string;
  relationship: number; // -100 to +100
  favoriteFood: string;
  currentActivity: string;
}

export interface GameTime {
  hour: number;
  minute: number;
  day: number;
  period: 'morning' | 'afternoon' | 'sunset' | 'night';
}
