import * as THREE from 'three';

export type Destination = 'explore' | 'football' | 'games' | 'court' | 'plaza' | 'cafe' | 'bench';

export interface BuildingDef {
  id: string;
  label: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  accentColor: string;
  signText: string;
  signColor: string;
  destination: Destination;
  interactions: InteractionDef[];
  entranceOffset: [number, number];
  bannerColor?: string;
}

export interface InteractionDef {
  id: string;
  label: string;
  icon: string;
  action: string;
  available: boolean;
  unavailableReason?: string;
}

export interface InteractableDef {
  id: string;
  label: string;
  type: 'bench' | 'tree' | 'fountain' | 'lamp' | 'planter';
  position: [number, number, number];
  interactions: InteractionDef[];
  collisionRadius: number;
  sitOffset?: [number, number, number]; // Where character stands before sitting
  sitRotation?: number; // Facing direction when sitting
}

export const BUILDINGS: BuildingDef[] = [
  {
    id: 'buka',
    label: 'Mama Bisi Buka & Kitchen',
    position: [-20, 0, -12],
    size: [12, 8, 10],
    color: '#d97706',
    accentColor: '#b45309',
    signText: 'MAMA BISI BUKA',
    signColor: '#fbbf24',
    destination: 'explore',
    entranceOffset: [0, 6],
    bannerColor: '#f59e0b',
    interactions: [
      { id: 'buka-jollof', label: 'Buy Party Jollof & Dodo (₦2,500)', icon: 'utensils', action: 'sim:buy-jollof', available: true },
      { id: 'buka-amala', label: 'Hot Amala, Ewedu & Goat Meat (₦3,500)', icon: 'flame', action: 'sim:buy-amala', available: true },
      { id: 'buka-maltina', label: 'Ice-Cold Maltina (₦800)', icon: 'coffee', action: 'sim:buy-maltina', available: true },
    ],
  },
  {
    id: 'suya',
    label: 'Alhaji Musa Suya Spot',
    position: [20, 0, 16],
    size: [11, 7, 9],
    color: '#7f1d1d',
    accentColor: '#b91c1c',
    signText: 'ALHAJI MUSA SUYA SPOT',
    signColor: '#f87171',
    destination: 'explore',
    entranceOffset: [0, 5],
    bannerColor: '#dc2626',
    interactions: [
      { id: 'suya-beef', label: 'Buy Spicy Beef Suya (₦2,000)', icon: 'flame', action: 'sim:buy-suya', available: true },
      { id: 'suya-tozo', label: 'Tozo Special with Onions (₦3,500)', icon: 'sparkles', action: 'sim:buy-tozo', available: true },
      { id: 'suya-chill', label: 'Hangout by the Warm Charcoal Fire', icon: 'chair', action: 'sim:suya-rest', available: true },
    ],
  },
  {
    id: 'tech-hub',
    label: 'Silicon Lagoon Tech Hub',
    position: [-20, 0, 16],
    size: [11, 9, 9],
    color: '#0f172a',
    accentColor: '#06b6d4',
    signText: 'SILICON LAGOON (TECH HUB)',
    signColor: '#38bdf8',
    destination: 'explore',
    entranceOffset: [0, 5],
    bannerColor: '#0ea5e9',
    interactions: [
      { id: 'tech-code', label: 'Clock In / Code Daily Shift (+₦15,000)', icon: 'gamepad', action: 'sim:work-tech', available: true },
      { id: 'tech-coffee', label: 'Tech Espresso & Red Bull (₦1,200)', icon: 'coffee', action: 'sim:buy-espresso', available: true },
      { id: 'tech-meetup', label: 'Join Startup Pitch & Banter (+Social)', icon: 'sparkles', action: 'sim:tech-social', available: true },
    ],
  },
  {
    id: 'danfo-stop',
    label: 'CMS Danfo & Keke Hub',
    position: [20, 0, -12],
    size: [12, 7, 10],
    color: '#ca8a04',
    accentColor: '#171717',
    signText: 'CMS DANFO TERMINAL',
    signColor: '#eab308',
    destination: 'explore',
    entranceOffset: [0, 6],
    bannerColor: '#eab308',
    interactions: [
      { id: 'danfo-ride', label: 'Hop on Danfo to Mainland (₦500)', icon: 'door', action: 'sim:ride-danfo', available: true },
      { id: 'keke-charter', label: 'Charter Private Keke Napep (₦1,200)', icon: 'trophy', action: 'sim:ride-keke', available: true },
      { id: 'conductor-gist', label: 'Throw Banter with Bus Conductor', icon: 'sparkles', action: 'sim:conductor-gist', available: true },
    ],
  },
  {
    id: 'owambe-canopy',
    label: "Oba's Owambe Party Canopy",
    position: [0, 0, -22],
    size: [16, 6, 12],
    color: '#15803d',
    accentColor: '#eab308',
    signText: 'OWAMBE CELEBRATION',
    signColor: '#facc15',
    destination: 'explore',
    entranceOffset: [0, 7],
    bannerColor: '#16a34a',
    interactions: [
      { id: 'owambe-dance', label: 'Dance to Heavy Afrobeats (+Enjoyment)', icon: 'sparkles', action: 'sim:dance-party', available: true },
      { id: 'owambe-spray', label: 'Spray ₦1,000 Cash Notes on Dancers! 💸', icon: 'flame', action: 'sim:spray-party', available: true },
      { id: 'owambe-jollof', label: 'Eat Free Souvenir Party Jollof', icon: 'utensils', action: 'sim:party-food', available: true },
    ],
  },
  {
    id: 'game-lounge',
    label: 'Recreation & Gaming Lounge',
    position: [24, 0, 2],
    size: [10, 7, 8],
    color: '#3b0764',
    accentColor: '#d946ef',
    signText: 'GAMING LOUNGE (WHOT & SPORTS)',
    signColor: '#e879f9',
    destination: 'explore',
    entranceOffset: [0, 5],
    bannerColor: '#a855f7',
    interactions: [
      { id: 'play-whot', label: 'Play 1v1 Whot! Card Match (₦3,000 Bet)', icon: 'gamepad', action: 'sim:play-whot', available: true },
      { id: 'play-football', label: 'Play Street Penalty Shootout ⚽', icon: 'trophy', action: 'sim:play-football', available: true },
    ],
  },
  {
    id: 'my-apartment',
    label: 'My Lagos Residence (Apartment)',
    position: [-24, 0, 2],
    size: [10, 8, 8],
    color: '#1e293b',
    accentColor: '#f59e0b',
    signText: 'MY RESIDENCE (APARTMENT)',
    signColor: '#fbbf24',
    destination: 'explore',
    entranceOffset: [0, 5],
    bannerColor: '#f59e0b',
    interactions: [
      { id: 'enter-apartment', label: 'Enter My Living Room & Bed', icon: 'door', action: 'sim:open-apartment', available: true },
    ],
  },
];

export const INTERACTABLES: InteractableDef[] = [
  {
    id: 'fountain',
    label: 'Central Fountain',
    type: 'fountain',
    position: [0, 0, 2],
    collisionRadius: 3,
    interactions: [
      { id: 'view-fountain', label: 'Admire', icon: 'sparkles', action: 'show:fountain', available: true },
    ],
  },
  {
    id: 'bench-1', label: 'Park Bench', type: 'bench', position: [-6, 0, 8], collisionRadius: 1.2,
    sitOffset: [-6, 0, 9.5], sitRotation: Math.PI,
    interactions: [
      { id: 'sit', label: 'Sit', icon: 'chair', action: 'bench:sit', available: true },
      { id: 'stand', label: 'Stand', icon: 'stand', action: 'bench:stand', available: false, unavailableReason: 'Only available when sitting' },
    ],
  },
  {
    id: 'bench-2', label: 'Park Bench', type: 'bench', position: [6, 0, 8], collisionRadius: 1.2,
    sitOffset: [6, 0, 9.5], sitRotation: Math.PI,
    interactions: [
      { id: 'sit', label: 'Sit', icon: 'chair', action: 'bench:sit', available: true },
      { id: 'stand', label: 'Stand', icon: 'stand', action: 'bench:stand', available: false, unavailableReason: 'Only available when sitting' },
    ],
  },
  {
    id: 'bench-3', label: 'Park Bench', type: 'bench', position: [-6, 0, -4], collisionRadius: 1.2,
    sitOffset: [-6, 0, -2.5], sitRotation: 0,
    interactions: [
      { id: 'sit', label: 'Sit', icon: 'chair', action: 'bench:sit', available: true },
      { id: 'stand', label: 'Stand', icon: 'stand', action: 'bench:stand', available: false, unavailableReason: 'Only available when sitting' },
    ],
  },
  {
    id: 'bench-4', label: 'Park Bench', type: 'bench', position: [6, 0, -4], collisionRadius: 1.2,
    sitOffset: [6, 0, -2.5], sitRotation: 0,
    interactions: [
      { id: 'sit', label: 'Sit', icon: 'chair', action: 'bench:sit', available: true },
      { id: 'stand', label: 'Stand', icon: 'stand', action: 'bench:stand', available: false, unavailableReason: 'Only available when sitting' },
    ],
  },
];

export const WORLD_BOUNDS = {
  minX: -34,
  maxX: 34,
  minZ: -26,
  maxZ: 26,
};

export const PLAYER_SPEED = 7;
export const PLAYER_RUN_SPEED = 12;
export const PLAYER_RADIUS = 0.7;
export const BUILDING_COLLISION_PAD = 0.6;

export function checkCollision(pos: THREE.Vector3): boolean {
  for (const b of BUILDINGS) {
    const halfW = b.size[0] / 2 + PLAYER_RADIUS + BUILDING_COLLISION_PAD;
    const halfD = b.size[2] / 2 + PLAYER_RADIUS + BUILDING_COLLISION_PAD;
    const dx = Math.abs(pos.x - b.position[0]);
    const dz = Math.abs(pos.z - b.position[2]);
    if (dx < halfW && dz < halfD) return true;
  }
  for (const obj of INTERACTABLES) {
    if (obj.collisionRadius <= 0) continue;
    const dx = pos.x - obj.position[0];
    const dz = pos.z - obj.position[2];
    const objectRadius = obj.type === 'bench' ? 0.45 : obj.collisionRadius;
    if (Math.sqrt(dx * dx + dz * dz) < objectRadius + PLAYER_RADIUS) return true;
  }
  return false;
}

export function checkBounds(pos: THREE.Vector3): THREE.Vector3 {
  return new THREE.Vector3(
    THREE.MathUtils.clamp(pos.x, WORLD_BOUNDS.minX, WORLD_BOUNDS.maxX),
    pos.y,
    THREE.MathUtils.clamp(pos.z, WORLD_BOUNDS.minZ, WORLD_BOUNDS.maxZ)
  );
}

export function getNearbyInteractable(pos: THREE.Vector3, threshold = 5): { type: 'building' | 'object'; def: BuildingDef | InteractableDef } | null {
  let closest: { type: 'building' | 'object'; def: BuildingDef | InteractableDef; dist: number } | null = null;

  for (const b of BUILDINGS) {
    const dx = pos.x - b.position[0];
    const dz = pos.z - b.position[2];
    const dist = Math.sqrt(dx * dx + dz * dz);
    const reach = threshold + Math.max(b.size[0], b.size[2]) / 2;
    if (dist < reach && (!closest || dist < closest.dist)) {
      closest = { type: 'building', def: b, dist };
    }
  }

  for (const obj of INTERACTABLES) {
    const dx = pos.x - obj.position[0];
    const dz = pos.z - obj.position[2];
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist < threshold && (!closest || dist < closest.dist)) {
      closest = { type: 'object', def: obj, dist };
    }
  }

  return closest ? { type: closest.type, def: closest.def } : null;
}

export function getEntrancePoint(building: BuildingDef): THREE.Vector3 {
  return new THREE.Vector3(
    building.position[0] + building.entranceOffset[0],
    0,
    building.position[2] + building.entranceOffset[1]
  );
}

export function getBenchSitPoint(bench: InteractableDef): THREE.Vector3 {
  if (bench.sitOffset) {
    return new THREE.Vector3(bench.sitOffset[0], bench.sitOffset[1], bench.sitOffset[2]);
  }
  return new THREE.Vector3(bench.position[0], 0, bench.position[2] + 1.5);
}

export function getBenchSitRotation(bench: InteractableDef): number {
  return bench.sitRotation ?? Math.PI;
}
