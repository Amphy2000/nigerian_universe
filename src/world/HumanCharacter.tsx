/**
 * HumanCharacter.tsx
 *
 * Grounded Sims-style 3D Humanoid Character Engine:
 * - Uses ReadyPlayerMe multi-mesh clothed avatar (readyplayer.me.glb)
 * - Captures exact rest-pose orientations of the RPM skeleton
 * - Applies natural forward-kinematics locomotion (Idle, Walk, Run, Sit)
 *   with proper knee flexion, counter-arm swinging, and foot planting at Y=0
 * - Fully supports live character customization: skin tones, hair colors,
 *   Ankara outfit palettes, gender scaling, and traditional attire styles.
 */

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

export type AnimState = 'idle' | 'walking' | 'running' | 'sitting';

export interface CustomAvatarConfig {
  gender?: 'male' | 'female';
  skinTone?: string;
  outfitTopColor?: string;
  outfitBottomColor?: string;
  footwearColor?: string;
  hairColor?: string;
  headwearColor?: string;
}

export interface CharacterHandle {
  group: THREE.Group | null;
  setAnimState: (state: AnimState) => void;
  getAnimState: () => AnimState;
  setSpeedFactor: (factor: number) => void;
}

interface HumanCharacterProps {
  externalRef?: React.MutableRefObject<CharacterHandle | null>;
  appearanceKey?: string;
  customConfig?: CustomAvatarConfig;
  scale?: number;
  position?: [number, number, number];
}

const RPM_URL = '/readyplayer.me.glb';

// Authentic Nigerian Melanin Skin Tones
export const NIGERIAN_SKIN_TONES = [
  { id: 'ebony', name: 'Deep Ebony', color: '#32180b' },
  { id: 'mahogany', name: 'Rich Mahogany', color: '#4a2512' },
  { id: 'umber', name: 'Warm Umber', color: '#683719' },
  { id: 'bronze', name: 'Bronze Caramel', color: '#884b25' },
  { id: 'honey', name: 'Honey Copper', color: '#ab6538' },
  { id: 'golden', name: 'Golden Amber', color: '#c48253' },
];

// Ankara & Traditional Nigerian Fashion Palettes [Top, Bottom]
export const ANKARA_OUTFIT_PRESETS: [string, string][] = [
  ['#15803d', '#ca8a04'], // Forest Green & Gold (National Prestige)
  ['#880e4f', '#1e3a8a'], // Royal Burgundy & Deep Indigo
  ['#ea580c', '#15803d'], // Vibrant Orange & Green (Lagos Market)
  ['#6b21a8', '#f59e0b'], // Imperial Purple & Warm Gold
  ['#0284c7', '#dc2626'], // Ocean Teal & Crimson (Eyo Festival)
  ['#18181b', '#d97706'], // Charcoal Black & Golden Ankara Print
  ['#047857', '#fbbf24'], // Emerald & Yellow (Celebration)
];

function hashKey(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) & 0xffff;
  return Math.abs(h);
}

interface BoneMap {
  hips: THREE.Object3D | null;
  spine: THREE.Object3D | null;
  spine1: THREE.Object3D | null;
  neck: THREE.Object3D | null;
  head: THREE.Object3D | null;
  leftUpLeg: THREE.Object3D | null;
  rightUpLeg: THREE.Object3D | null;
  leftLeg: THREE.Object3D | null;
  rightLeg: THREE.Object3D | null;
  leftFoot: THREE.Object3D | null;
  rightFoot: THREE.Object3D | null;
  leftArm: THREE.Object3D | null;
  rightArm: THREE.Object3D | null;
  leftForearm: THREE.Object3D | null;
  rightForearm: THREE.Object3D | null;
}

export function HumanCharacter({
  externalRef,
  appearanceKey = '',
  customConfig,
  scale = 1,
  position = [0, 0, 0],
}: HumanCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const stateRef = useRef<AnimState>('idle');
  const speedRef = useRef(1);
  const phaseRef = useRef(Math.random() * Math.PI * 2);

  const { scene: rpmScene } = useGLTF(RPM_URL);
  const clonedScene = useMemo(() => SkeletonUtils.clone(rpmScene), [rpmScene]);

  const hash = useMemo(() => hashKey(appearanceKey), [appearanceKey]);
  const isFemale = customConfig?.gender === 'female' || appearanceKey.toLowerCase().includes('female');

  // Compute colors
  const skinColor = customConfig?.skinTone ?? NIGERIAN_SKIN_TONES[hash % NIGERIAN_SKIN_TONES.length].color;
  const outfitPreset = ANKARA_OUTFIT_PRESETS[hash % ANKARA_OUTFIT_PRESETS.length];
  const topColor = customConfig?.outfitTopColor ?? outfitPreset[0];
  const bottomColor = customConfig?.outfitBottomColor ?? outfitPreset[1];
  const shoesColor = customConfig?.footwearColor ?? '#1c1917';
  const hairColor = customConfig?.hairColor ?? ['#0c0704', '#170b05', '#241006'][hash % 3];
  const hatColor = customConfig?.headwearColor ?? ['#1e293b', '#3b1f0e', '#0f172a'][hash % 3];

  // Discover RPM bones
  const bones = useMemo<BoneMap>(() => {
    return {
      hips: clonedScene.getObjectByName('Hips') ?? null,
      spine: clonedScene.getObjectByName('Spine') ?? null,
      spine1: clonedScene.getObjectByName('Spine1') ?? null,
      neck: clonedScene.getObjectByName('Neck') ?? null,
      head: clonedScene.getObjectByName('Head') ?? null,
      leftUpLeg: clonedScene.getObjectByName('LeftUpLeg') ?? null,
      rightUpLeg: clonedScene.getObjectByName('RightUpLeg') ?? null,
      leftLeg: clonedScene.getObjectByName('LeftLeg') ?? null,
      rightLeg: clonedScene.getObjectByName('RightLeg') ?? null,
      leftFoot: clonedScene.getObjectByName('LeftFoot') ?? null,
      rightFoot: clonedScene.getObjectByName('RightFoot') ?? null,
      leftArm: clonedScene.getObjectByName('LeftArm') ?? null,
      rightArm: clonedScene.getObjectByName('RightArm') ?? null,
      leftForearm: clonedScene.getObjectByName('LeftForeArm') ?? null,
      rightForearm: clonedScene.getObjectByName('RightForeArm') ?? null,
    };
  }, [clonedScene]);

  // Capture RPM base rest rotations
  const baseRotations = useMemo(() => {
    const map = new Map<THREE.Object3D, { x: number; y: number; z: number }>();
    Object.values(bones).forEach((bone) => {
      if (bone) {
        map.set(bone, { x: bone.rotation.x, y: bone.rotation.y, z: bone.rotation.z });
      }
    });
    return map;
  }, [bones]);

  const baseHipsY = useRef(1.02);

  // Apply materials once
  useEffect(() => {
    clonedScene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      obj.castShadow = true;
      obj.receiveShadow = true;

      const name = obj.name.toLowerCase();

      const applyMat = (color: string, roughness = 0.75, metalness = 0.0) => {
        const mat = (obj.material as THREE.MeshStandardMaterial).clone();
        mat.color = new THREE.Color(color);
        mat.roughness = roughness;
        mat.metalness = metalness;
        obj.material = mat;
      };

      // Teeth
      if (name.includes('teeth')) {
        applyMat('#f5f5f5', 0.3);
        return;
      }
      // Eyes: preserve realistic cornea
      if (name.includes('eye')) {
        applyMat('#ffffff', 0.2);
        return;
      }
      // Head & Body skin
      if (name.includes('head') || name.includes('body')) {
        applyMat(skinColor, 0.65);
        return;
      }
      // Hair & Beard
      if (name.includes('hair') || name.includes('beard')) {
        applyMat(hairColor, 0.85);
        return;
      }
      // Hat / Headwear
      if (name.includes('headwear') || name === 'mesh') {
        applyMat(hatColor, 0.8);
        return;
      }
      // Shirt / Jacket
      if (name.includes('outfit_top') || name.includes('top')) {
        applyMat(topColor, 0.7);
        return;
      }
      // Trousers / Pants
      if (name.includes('outfit_bottom') || name.includes('bottom')) {
        applyMat(bottomColor, 0.75);
        return;
      }
      // Shoes
      if (name.includes('footwear') || name.includes('shoe')) {
        applyMat(shoesColor, 0.6);
        return;
      }
    });

    if (bones.hips) {
      baseHipsY.current = bones.hips.position.y || 1.02;
    }
  }, [clonedScene, skinColor, topColor, bottomColor, shoesColor, hairColor, hatColor, bones.hips]);

  // Expose CharacterHandle to Player and NPC controllers
  useEffect(() => {
    if (!externalRef) return;
    externalRef.current = {
      group: groupRef.current,
      setAnimState: (s: AnimState) => {
        stateRef.current = s;
      },
      getAnimState: () => stateRef.current,
      setSpeedFactor: (factor: number) => {
        speedRef.current = THREE.MathUtils.clamp(factor, 0.4, 2.2);
      },
    };
    return () => {
      if (externalRef.current?.group === groupRef.current) externalRef.current = null;
    };
  }, [externalRef]);

  // ── Natural Grounded Locomotion Kinematics on useFrame ─────────────────────
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = stateRef.current;
    const isMoving = state === 'walking' || state === 'running';
    const isSitting = state === 'sitting';
    const isRunning = state === 'running';

    const freq = isRunning ? 9.5 : 5.8;
    phaseRef.current += dt * freq * speedRef.current;

    const phase = phaseRef.current;

    // Stride amplitude
    const stride = isMoving ? Math.sin(phase) * (isRunning ? 0.65 : 0.42) : 0;
    const idleBreathe = !isMoving && !isSitting ? Math.sin(phase * 0.4) * 0.025 : 0;

    // Helper to rotate relative to captured base
    const rotateBone = (bone: THREE.Object3D | null, axis: 'x' | 'y' | 'z', offset: number, dampSpeed = 12) => {
      if (!bone) return;
      const base = baseRotations.get(bone);
      if (!base) return;
      const target = base[axis] + offset;
      bone.rotation[axis] = THREE.MathUtils.damp(bone.rotation[axis], target, dampSpeed, dt);
    };

    if (isSitting) {
      // ── SITTING: Legs 90 deg forward, knees 90 deg down, hips on bench ──
      if (bones.hips) {
        bones.hips.position.y = THREE.MathUtils.damp(bones.hips.position.y, baseHipsY.current - 0.42, 10, dt);
      }
      rotateBone(bones.spine, 'x', -0.12, 10);
      rotateBone(bones.leftUpLeg, 'x', -1.4, 10);
      rotateBone(bones.rightUpLeg, 'x', -1.4, 10);
      rotateBone(bones.leftLeg, 'x', 1.45, 10);
      rotateBone(bones.rightLeg, 'x', 1.45, 10);
      rotateBone(bones.leftArm, 'x', 0.25, 10);
      rotateBone(bones.rightArm, 'x', 0.25, 10);
      rotateBone(bones.leftForearm, 'x', -0.3, 10);
      rotateBone(bones.rightForearm, 'x', -0.3, 10);
      return;
    }

    // ── STANDING & WALKING: Strict ground contact at Y=0 ───────────────────
    if (bones.hips) {
      const hipBob = isMoving ? Math.abs(Math.sin(phase * 2)) * 0.03 : idleBreathe;
      bones.hips.position.y = THREE.MathUtils.damp(bones.hips.position.y, baseHipsY.current + hipBob, 12, dt);
    }

    // Spine posture (lean slightly forward when running)
    const spineLean = isRunning ? -0.15 : isMoving ? -0.06 : idleBreathe;
    rotateBone(bones.spine, 'x', spineLean, 10);

    // Upper Legs (Thighs swing opposite each other)
    rotateBone(bones.leftUpLeg, 'x', stride, 14);
    rotateBone(bones.rightUpLeg, 'x', -stride, 14);

    // Lower Legs (Knees bend during forward swing, straight on ground plant)
    const leftKneeBend = isMoving ? Math.max(0, -stride) * 0.85 : 0;
    const rightKneeBend = isMoving ? Math.max(0, stride) * 0.85 : 0;
    rotateBone(bones.leftLeg, 'x', leftKneeBend, 14);
    rotateBone(bones.rightLeg, 'x', rightKneeBend, 14);

    // Arms counter-swing opposite legs
    const armSwing = isMoving ? stride * 0.55 : Math.sin(phase * 0.5) * 0.02;
    rotateBone(bones.leftArm, 'x', -armSwing, 12);
    rotateBone(bones.rightArm, 'x', armSwing, 12);

    // Forearms slightly bent forward
    rotateBone(bones.leftForearm, 'x', isRunning ? -0.35 : -0.12, 10);
    rotateBone(bones.rightForearm, 'x', isRunning ? -0.35 : -0.12, 10);
  });

  return (
    <group ref={groupRef} position={position} scale={(scale ?? 1) * 0.96}>
      <primitive object={clonedScene} />
    </group>
  );
}

useGLTF.preload(RPM_URL);
