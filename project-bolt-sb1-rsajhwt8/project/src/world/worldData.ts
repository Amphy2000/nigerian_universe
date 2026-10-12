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
    id: 'court',
    label: 'Nigerian Court',
    position: [-20, 0, -12],
    size: [12, 9, 10],
    color: '#e8e2d6',
    accentColor: '#c68f2e',
    signText: 'NIGERIAN COURT',
    signColor: '#c68f2e',
    destination: 'court',
    entranceOffset: [0, 6],
    bannerColor: '#c68f2e',
    interactions: [
      { id: 'enter-court', label: 'Enter Court', icon: 'door', action: 'navigate:court', available: true },
      { id: 'view-cases', label: 'View Trending Cases', icon: 'flame', action: 'navigate:trending', available: true },
    ],
  },
  {
    id: 'football',
    label: 'Football Arena',
    position: [20, 0, -12],
    size: [12, 8, 10],
    color: '#e0e5e0',
    accentColor: '#358a42',
    signText: 'FOOTBALL ARENA',
    signColor: '#358a42',
    destination: 'football',
    entranceOffset: [0, 6],
    bannerColor: '#358a42',
    interactions: [
      { id: 'enter-arena', label: 'Enter Arena', icon: 'door', action: 'navigate:football', available: true },
      { id: 'view-matches', label: 'View Matches', icon: 'trophy', action: 'show:matches', available: false, unavailableReason: 'Matches coming soon' },
    ],
  },
  {
    id: 'games',
    label: 'Gaming Lounge',
    position: [-20, 0, 16],
    size: [11, 7, 9],
    color: '#e8d8d8',
    accentColor: '#dc3b5c',
    signText: 'GAMING LOUNGE',
    signColor: '#dc3b5c',
    destination: 'games',
    entranceOffset: [0, 5],
    bannerColor: '#dc3b5c',
    interactions: [
      { id: 'enter-games', label: 'Enter Lounge', icon: 'door', action: 'navigate:games', available: true },
      { id: 'view-games', label: 'View Available Games', icon: 'gamepad', action: 'show:games', available: false, unavailableReason: 'Games coming soon' },
    ],
  },
  {
    id: 'cafe',
    label: 'Universe Cafe',
    position: [20, 0, 16],
    size: [10, 6, 8],
    color: '#f0e8e0',
    accentColor: '#8b5e3c',
    signText: 'UNIVERSE CAFE',
    signColor: '#8b5e3c',
    destination: 'cafe',
    entranceOffset: [0, 5],
    bannerColor: '#8b5e3c',
    interactions: [
      { id: 'enter-cafe', label: 'Enter Cafe', icon: 'door', action: 'show:cafe-info', available: true },
      { id: 'sit-cafe', label: 'Sit & Relax', icon: 'chair', action: 'show:cafe', available: false, unavailableReason: 'Social features coming soon' },
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
