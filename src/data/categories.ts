import type { Category } from '@/types';

export const CATEGORIES: Category[] = [
  { id: 'relationship', label: 'Relationship Court', emoji: '❤️', accent: 'crimson' },
  { id: 'friendship', label: 'Friendship Court', emoji: '👯', accent: 'gold' },
  { id: 'family', label: 'Family Court', emoji: '👨‍👩‍👧', accent: 'forest' },
  { id: 'workplace', label: 'Workplace Court', emoji: '💼', accent: 'gold' },
  { id: 'money', label: 'Money Court', emoji: '💰', accent: 'forest' },
  { id: 'campus', label: 'Campus Court', emoji: '🎓', accent: 'crimson' },
  { id: 'landlord', label: 'Landlord Court', emoji: '🏠', accent: 'gold' },
  { id: 'neighborhood', label: 'Neighbourhood Court', emoji: '🏘️', accent: 'forest' },
  { id: 'naija', label: 'Naija Court', emoji: '🇳🇬', accent: 'crimson' },
  { id: 'celebrity', label: 'Celebrity Court', emoji: '🔥', accent: 'gold', needsModeration: true },
];

export function getCategory(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
