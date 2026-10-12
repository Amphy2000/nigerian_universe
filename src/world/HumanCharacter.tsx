/**
 * HumanCharacter.tsx
 *
 * Sims-style clothed 3D characters:
 *  - Visual body: ReadyPlayerMe avatar (readyplayer.me.glb) — has separate head, hair,
 *    body, outfit top, outfit bottom and footwear meshes
 *  - Animations: Xbot.glb clips (idle / walk / run) retargeted to the RPM rig via
 *    shared Mixamo bone naming — AnimationMixer handles real mocap transitions
 *  - Nigerian skin tones applied per character
 *  - Vibrant outfit colours per character (Ankara-inspired palette)
 */

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

// ─── Public types ────────────────────────────────────────────────────────────

export type AnimState = 'idle' | 'walking' | 'running' | 'sitting';

export interface CharacterHandle {
  group: THREE.Group | null;
  setAnimState: (state: AnimState) => void;
  getAnimState: () => AnimState;
  setSpeedFactor: (factor: number) => void;
}

interface HumanCharacterProps {
  externalRef?: React.MutableRefObject<CharacterHandle | null>;
  appearanceKey?: string;
  scale?: number;
  position?: [number, number, number];
}

// ─── Asset URLs ──────────────────────────────────────────────────────────────

const RPM_URL   = '/readyplayer.me.glb';  // clothed avatar, no animations
const XBOT_URL  = '/Xbot.glb';            // animations only (idle / walk / run)

// ─── Nigerian melanin skin tones ─────────────────────────────────────────────

const SKIN_TONES = [
  '#3b1f0e', // Deep ebony
  '#5c2d0e', // Rich mahogany
  '#7a3b1e', // Warm umber
  '#9e5220', // Bronze caramel
  '#c47a45', // Golden copper
];

// ─── Ankara-inspired outfit colour sets [top, bottom] ────────────────────────

const OUTFIT_SETS: [string, string][] = [
  ['#1b5e20', '#ff6f00'],  // Forest green + amber
  ['#880e4f', '#1a237e'],  // Magenta + indigo
  ['#e65100', '#1b5e20'],  // Deep orange + forest
  ['#4a148c', '#f57f17'],  // Deep purple + gold
  ['#006064', '#b71c1c'],  // Teal + crimson
  ['#1565c0', '#f9a825'],  // Royal blue + sunflower
  ['#263238', '#ff8f00'],  // Charcoal + amber
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hashKey(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) & 0xffff;
  return Math.abs(h);
}

/**
 * Clone animation clips from the Xbot scene and retarget their track names so
 * they drive the RPM skeleton.
 *
 * Both skeletons use identical Mixamo bone naming (LeftUpLeg, RightLeg, etc.)
 * so "retargeting" here is simply ensuring the clip references root correctly.
 *
 * The RPM skeleton root is named "Armature" → the Xbot root is "Armature" too,
 * so clips work as-is once we attach the mixer to the RPM scene.
 */
function cloneClipsForRPM(xbotClips: THREE.AnimationClip[]): THREE.AnimationClip[] {
  return xbotClips.map((clip) => {
    const cloned = clip.clone();
    // Xbot tracks are relative to its Armature; RPM uses the same bone names,
    // so we just strip any leading "Armature." from track names if present.
    cloned.tracks = cloned.tracks.map((track) => {
      const t = track.clone();
      t.name = t.name.replace(/^Armature\./, '');
      return t;
    });
    return cloned;
  });
}

// ─── Main component ───────────────────────────────────────────────────────────

export function HumanCharacter({
  externalRef,
  appearanceKey = '',
  scale = 1,
  position = [0, 0, 0],
}: HumanCharacterProps) {
  // Load clothed avatar (visual body — no animations)
  const { scene: rpmScene } = useGLTF(RPM_URL);
  // Load Xbot (animations only)
  const { animations: xbotClips } = useGLTF(XBOT_URL);

  // ── Clone the RPM scene so every character is independent ───────────────
  const clonedScene = useMemo(() => SkeletonUtils.clone(rpmScene), [rpmScene]);

  // ── Retargeted animation clips ───────────────────────────────────────────
  const retargetedClips = useMemo(
    () => cloneClipsForRPM(xbotClips),
    [xbotClips]
  );

  // ── useAnimations attaches an AnimationMixer to clonedScene ─────────────
  const { actions, mixer } = useAnimations(retargetedClips, clonedScene);

  // ── Per-character appearance ─────────────────────────────────────────────
  const hash = useMemo(() => hashKey(appearanceKey), [appearanceKey]);
  const isFemale = appearanceKey.toLowerCase().includes('female');
  const skinTone   = SKIN_TONES[hash % SKIN_TONES.length];
  const outfitSet  = OUTFIT_SETS[hash % OUTFIT_SETS.length];

  // ── Internal state refs ──────────────────────────────────────────────────
  const groupRef      = useRef<THREE.Group>(null);
  const stateRef      = useRef<AnimState>('idle');
  const speedRef      = useRef(1);
  const currentAction = useRef<THREE.AnimationAction | null>(null);
  const sitPoseRef    = useRef<boolean>(false);

  // ── Apply skin + outfit colours once ────────────────────────────────────
  useEffect(() => {
    clonedScene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      obj.castShadow = true;
      obj.receiveShadow = true;

      const name = obj.name.toLowerCase();

      const applyColor = (color: string) => {
        const mat = (obj.material as THREE.MeshStandardMaterial).clone();
        mat.color = new THREE.Color(color);
        mat.roughness = 0.75;
        mat.metalness = 0.0;
        obj.material = mat;
      };

      // Teeth should remain clean white
      if (name.includes('teeth')) {
        const mat = (obj.material as THREE.MeshStandardMaterial).clone();
        mat.color = new THREE.Color('#f0f0f0');
        mat.roughness = 0.4;
        obj.material = mat;
        return;
      }

      // Eyes: preserve realistic eye appearance
      if (name.includes('eye')) {
        const mat = (obj.material as THREE.MeshStandardMaterial).clone();
        mat.roughness = 0.2;
        obj.material = mat;
        return;
      }

      // Hair & Beard: deep authentic dark hair shades
      if (name.includes('hair') || name.includes('beard') || name === 'mesh') {
        const hairTones = ['#110905', '#1a0d07', '#241209', '#0d0704'];
        const hairColor = hairTones[hash % hairTones.length];
        applyColor(hairColor);
        return;
      }

      // Head & Body: authentic Nigerian melanin skin tones
      if (name.includes('head') || name.includes('body')) {
        applyColor(skinTone);
        return;
      }

      // Outfit top (shirt / jacket)
      if (name.includes('outfit_top') || name.includes('top')) {
        applyColor(outfitSet[0]);
        return;
      }

      // Outfit bottom (trousers / skirt)
      if (name.includes('outfit_bottom') || name.includes('bottom')) {
        applyColor(outfitSet[1]);
        return;
      }

      // Footwear (shoes / sneakers)
      if (name.includes('footwear') || name.includes('shoe') || name.includes('foot')) {
        applyColor('#222222');
        return;
      }
    });
  }, [clonedScene, skinTone, outfitSet, hash, isFemale]);

  // ── Start idle animation on mount ────────────────────────────────────────
  useEffect(() => {
    const idleAction = actions['idle'] ?? actions['Idle'] ?? null;
    if (idleAction) {
      idleAction.reset().fadeIn(0.3).play();
      currentAction.current = idleAction;
    }
    return () => {
      mixer.stopAllAction();
    };
  }, [actions, mixer]);

  // ── Expose CharacterHandle ───────────────────────────────────────────────
  useEffect(() => {
    if (!externalRef) return;
    externalRef.current = {
      group: groupRef.current,
      setAnimState: (state: AnimState) => {
        if (stateRef.current === state) return;
        stateRef.current = state;

        // Sitting uses a frozen pose (mixer paused or T-pose with bend)
        if (state === 'sitting') {
          sitPoseRef.current = true;
          // Fade out current animation
          currentAction.current?.fadeOut(0.4);
          // Play idle very slowly and freeze-like
          const idleAct = actions['idle'] ?? actions['Idle'];
          if (idleAct) {
            idleAct.reset().setEffectiveTimeScale(0.05).setEffectiveWeight(1).fadeIn(0.4).play();
            currentAction.current = idleAct;
          }
          return;
        }

        sitPoseRef.current = false;

        // Map AnimState → Xbot clip name
        const clipName =
          state === 'running' ? 'run' :
          state === 'walking' ? 'walk' :
          'idle';

        // Try lower-case first (Xbot naming), then capitalised (Soldier naming)
        const next =
          actions[clipName] ??
          actions[clipName.charAt(0).toUpperCase() + clipName.slice(1)] ??
          null;

        if (!next || next === currentAction.current) return;

        // Cross-fade
        const prev = currentAction.current;
        next.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(0.25).play();
        prev?.fadeOut(0.25);
        currentAction.current = next;
      },
      getAnimState: () => stateRef.current,
      setSpeedFactor: (factor: number) => {
        speedRef.current = THREE.MathUtils.clamp(factor, 0.3, 2.5);
        if (currentAction.current) {
          currentAction.current.setEffectiveTimeScale(speedRef.current);
        }
      },
    };
    return () => {
      if (externalRef.current?.group === groupRef.current) externalRef.current = null;
    };
  }, [actions, externalRef, mixer]);

  // ── Advance AnimationMixer every frame ───────────────────────────────────
  useFrame((_, delta) => {
    mixer.update(delta);
  });

  // RPM avatar ground offset: the model origin is at the hip level (~1.0 m up)
  // We shift it down so feet sit at Y=0
  const groundOffset: [number, number, number] = [0, -0.92, 0];

  return (
    <group ref={groupRef} position={position} scale={(scale ?? 1) * 0.95}>
      {/* Nudge scene down so feet touch ground */}
      <group position={groundOffset}>
        <primitive object={clonedScene} />
      </group>
    </group>
  );
}

// Preload both assets
useGLTF.preload(RPM_URL);
useGLTF.preload(XBOT_URL);
