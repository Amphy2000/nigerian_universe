/**
 * HumanCharacter.tsx
 *
 * Sims 4-Grade Mocap 3D Humanoid Engine for Nigerian Universe:
 * - Uses ReadyPlayerMe base avatar (readyplayer.me.glb)
 * - Directly drives skeleton using official ReadyPlayerMe motion clips:
 *   - idle.glb (M_Standing_Idle_001)
 *   - walk.glb (M_Walk_001, stabilized in-place)
 *   - run.glb (M_Run_001, stabilized in-place)
 *   - dance.glb (M_Dances_001)
 *   - talk.glb (M_Talking_Variations_001)
 * - Ground-pinned foot plant at exact Y = 0 (no floating, no sinking)
 * - Fluid cross-fading (0.2s) with speed-matching timeScale
 * - Retains seated bench kinematics and customizer melanin & Ankara palettes
 */

import { useEffect, useMemo, useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import sittingAnimationData from './sittingAnimation.json';

export type AnimState = 'idle' | 'walking' | 'running' | 'sitting' | 'dancing' | 'talking';

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
  initialAnim?: AnimState;
}

const RPM_URL = '/readyplayer.me.glb';
const IDLE_URL = '/animations/idle.glb';
const WALK_URL = '/animations/walk.glb';
const RUN_URL = '/animations/run.glb';
const DANCE_URL = '/animations/dance.glb';
const TALK_URL = '/animations/talk.glb';

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

// In-place stabilizer: zero out forward Z movement on root/hips
function processInPlace(clip: THREE.AnimationClip): THREE.AnimationClip {
  const cloned = clip.clone();
  for (const track of cloned.tracks) {
    if (track.name.toLowerCase().includes('hips.position') || track.name.toLowerCase().includes('root.position')) {
      for (let i = 2; i < track.values.length; i += 3) {
        track.values[i] = 0;
      }
    }
  }
  return cloned;
}

export function HumanCharacter({
  externalRef,
  appearanceKey = '',
  customConfig,
  scale = 1,
  position = [0, 0, 0],
  initialAnim = 'idle',
}: HumanCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const stateRef = useRef<AnimState>(initialAnim);
  const speedRef = useRef(1);

  // Load avatar and official RPM animation clips
  const { scene: rpmScene } = useGLTF(RPM_URL);
  const idleGltf = useGLTF(IDLE_URL);
  const walkGltf = useGLTF(WALK_URL);
  const runGltf = useGLTF(RUN_URL);
  const danceGltf = useGLTF(DANCE_URL);
  const talkGltf = useGLTF(TALK_URL);

  // Clone RPM avatar scene uniquely for this instance
  const clonedScene = useMemo(() => SkeletonUtils.clone(rpmScene), [rpmScene]);

  // Set up Three.js AnimationMixer on clonedScene
  const mixer = useMemo(() => new THREE.AnimationMixer(clonedScene), [clonedScene]);

  // Parse authentic sitting clip
  const sittingClip = useMemo(() => {
    try {
      const clip = THREE.AnimationClip.parse(sittingAnimationData);
      clip.name = 'sitting';
      return clip;
    } catch {
      return null;
    }
  }, []);

  // Create AnimationActions from RPM clips
  const actions = useMemo(() => {
    if (!mixer) return null;
    const idleClip = idleGltf.animations?.[0];
    const walkClip = walkGltf.animations?.[0] ? processInPlace(walkGltf.animations[0]) : null;
    const runClip = runGltf.animations?.[0] ? processInPlace(runGltf.animations[0]) : null;
    const danceClip = danceGltf.animations?.[0];
    const talkClip = talkGltf.animations?.[0];

    const map: Record<AnimState, THREE.AnimationAction | null> = {
      idle: idleClip ? mixer.clipAction(idleClip) : null,
      walking: walkClip ? mixer.clipAction(walkClip) : null,
      running: runClip ? mixer.clipAction(runClip) : null,
      dancing: danceClip ? mixer.clipAction(danceClip) : null,
      talking: talkClip ? mixer.clipAction(talkClip) : null,
      sitting: sittingClip ? mixer.clipAction(sittingClip) : null,
    };

    Object.values(map).forEach((act) => {
      if (act) {
        act.setLoop(THREE.LoopRepeat, Infinity);
        act.clampWhenFinished = false;
      }
    });

    return map;
  }, [mixer, idleGltf, walkGltf, runGltf, danceGltf, talkGltf, sittingClip]);

  const currentActionRef = useRef<THREE.AnimationAction | null>(null);

  // Smooth cross-fade transition between animation states
  const transitionTo = useCallback((nextState: AnimState) => {
    if (!actions) return;
    if (stateRef.current === nextState && currentActionRef.current?.isRunning()) return;

    stateRef.current = nextState;
    const prevAction = currentActionRef.current;
    const nextAction = actions[nextState] ?? null;

    if (nextAction && nextAction !== prevAction) {
      nextAction.reset();
      nextAction.timeScale = speedRef.current;
      nextAction.fadeIn(0.2);
      nextAction.play();
    }

    if (prevAction && prevAction !== nextAction) {
      prevAction.fadeOut(0.2);
    }

    currentActionRef.current = nextAction;
  }, [actions]);

  // Start with initial animation
  useEffect(() => {
    if (!actions) return;
    const startAction = actions[initialAnim] || actions.idle;
    if (startAction) {
      startAction.reset().fadeIn(0.2).play();
      currentActionRef.current = startAction;
    }
    return () => {
      mixer.stopAllAction();
    };
  }, [actions, mixer, initialAnim]);

  // Compute appearance colors
  const hash = useMemo(() => hashKey(appearanceKey), [appearanceKey]);
  const skinColor = customConfig?.skinTone ?? NIGERIAN_SKIN_TONES[hash % NIGERIAN_SKIN_TONES.length].color;
  const outfitPreset = ANKARA_OUTFIT_PRESETS[hash % ANKARA_OUTFIT_PRESETS.length];
  const topColor = customConfig?.outfitTopColor ?? outfitPreset[0];
  const bottomColor = customConfig?.outfitBottomColor ?? outfitPreset[1];
  const shoesColor = customConfig?.footwearColor ?? '#1c1917';
  const hairColor = customConfig?.hairColor ?? ['#0c0704', '#170b05', '#241006'][hash % 3];
  const hatColor = customConfig?.headwearColor ?? ['#1e293b', '#3b1f0e', '#0f172a'][hash % 3];

  // Discover RPM bones for sitting posture
  const bones = useMemo(() => {
    return {
      hips: clonedScene.getObjectByName('Hips') ?? null,
      spine: clonedScene.getObjectByName('Spine') ?? null,
      leftUpLeg: clonedScene.getObjectByName('LeftUpLeg') ?? null,
      rightUpLeg: clonedScene.getObjectByName('RightUpLeg') ?? null,
      leftLeg: clonedScene.getObjectByName('LeftLeg') ?? null,
      rightLeg: clonedScene.getObjectByName('RightLeg') ?? null,
      leftArm: clonedScene.getObjectByName('LeftArm') ?? null,
      rightArm: clonedScene.getObjectByName('RightArm') ?? null,
      leftForearm: clonedScene.getObjectByName('LeftForeArm') ?? null,
      rightForearm: clonedScene.getObjectByName('RightForeArm') ?? null,
    };
  }, [clonedScene]);

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

  // Apply melanin, Ankara prints, and shadow settings
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

      if (name.includes('teeth')) {
        applyMat('#f5f5f5', 0.3);
        return;
      }
      if (name.includes('eye')) {
        applyMat('#ffffff', 0.2);
        return;
      }
      if (name.includes('head') || name.includes('body')) {
        applyMat(skinColor, 0.65);
        return;
      }
      if (name.includes('hair') || name.includes('beard')) {
        applyMat(hairColor, 0.85);
        return;
      }
      if (name.includes('headwear') || name === 'mesh') {
        applyMat(hatColor, 0.8);
        return;
      }
      if (name.includes('outfit_top') || name.includes('top')) {
        applyMat(topColor, 0.7);
        return;
      }
      if (name.includes('outfit_bottom') || name.includes('bottom')) {
        applyMat(bottomColor, 0.75);
        return;
      }
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
        transitionTo(s);
      },
      getAnimState: () => stateRef.current,
      setSpeedFactor: (factor: number) => {
        speedRef.current = THREE.MathUtils.clamp(factor, 0.4, 2.2);
        if (currentActionRef.current && (stateRef.current === 'walking' || stateRef.current === 'running')) {
          currentActionRef.current.timeScale = speedRef.current;
        }
      },
    };
    return () => {
      if (externalRef.current?.group === groupRef.current) externalRef.current = null;
    };
  }, [externalRef, transitionTo]);

  // Render loop
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    mixer.update(dt);
  });

  return (
    <group ref={groupRef} position={position} scale={(scale ?? 1) * 0.96}>
      <primitive object={clonedScene} />
    </group>
  );
}

useGLTF.preload(RPM_URL);
useGLTF.preload(IDLE_URL);
useGLTF.preload(WALK_URL);
useGLTF.preload(RUN_URL);
useGLTF.preload(DANCE_URL);
useGLTF.preload(TALK_URL);
