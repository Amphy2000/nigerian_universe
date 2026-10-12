import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

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

const HUMAN_MODEL_URL = '/HumanModels.glb';

type BoneMap = {
  hips: THREE.Bone | null;
  spine: THREE.Bone | null;
  leftThigh: THREE.Bone | null;
  rightThigh: THREE.Bone | null;
  leftShin: THREE.Bone | null;
  rightShin: THREE.Bone | null;
  leftUpperArm: THREE.Bone | null;
  rightUpperArm: THREE.Bone | null;
  leftForearm: THREE.Bone | null;
  rightForearm: THREE.Bone | null;
};

type BaseRotations = Map<THREE.Bone, number>;

// Nigerian skin tone variations for realistic representation
const SKIN_TONES = [
  '#4a291a', // Rich deep brown
  '#5d3620', // Warm chocolate
  '#74452a', // Bronze mocha
  '#8c5535', // Warm amber
  '#a26744', // Golden caramel
];

export function HumanCharacter({ externalRef, appearanceKey = '', scale = 1, position = [0, 0, 0] }: HumanCharacterProps) {
  return (
    <RiggedHuman
      externalRef={externalRef}
      appearanceKey={appearanceKey}
      scale={scale}
      position={position}
    />
  );
}

function RiggedHuman({ externalRef, appearanceKey = '', scale = 1, position = [0, 0, 0] }: HumanCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const stateRef = useRef<AnimState>('idle');
  const speedRef = useRef(1);
  const phaseRef = useRef(Math.random() * Math.PI * 2);

  const { scene } = useGLTF(HUMAN_MODEL_URL);

  const isFemale = appearanceKey.toLowerCase().includes('female');
  const targetRigName = isFemale ? 'Woman_(Rig)' : 'Man_(Rig)';

  // Pick deterministic skin tone based on appearance key hash
  const skinTone = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < appearanceKey.length; i++) hash = (hash * 31 + appearanceKey.charCodeAt(i)) & 0xffff;
    return SKIN_TONES[Math.abs(hash) % SKIN_TONES.length];
  }, [appearanceKey]);

  // Clone full hierarchy safely
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const activeRig = useMemo(() => clonedScene.getObjectByName(targetRigName) as THREE.Object3D | null, [clonedScene, targetRigName]);
  const bones = useMemo(() => activeRig ? createBoneMap(activeRig) : createBoneMap(clonedScene), [activeRig, clonedScene]);
  const baseRotations = useMemo(() => captureBaseRotations(bones), [bones]);
  const baseHipY = useRef(0);

  useEffect(() => {
    // Hide unselected rig, non-rig and high-poly models; configure shadows and skin tone
    clonedScene.traverse((object: THREE.Object3D) => {
      const name = object.name;
      if (name === 'Man_(Rig)' || name === 'Woman_(Rig)') {
        object.visible = name === targetRigName;
        // Center the rig at origin: the authoring file placed Man at -1.5 and Woman at +1.5
        if (name === targetRigName) {
          object.position.x = isFemale ? -1.488 : 1.498;
          object.position.y = 0;
          object.position.z = 0;
        }
      } else if (name.includes('NonRig') || name.includes('HighPoly')) {
        object.visible = false;
      }

      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        if (object.material) {
          // Clone material per character for independent skin tone tint
          const mat = (object.material as THREE.MeshStandardMaterial).clone();
          mat.color = new THREE.Color(skinTone);
          mat.roughness = 0.65;
          object.material = mat;
        }
      }
    });

    baseHipY.current = bones.hips?.position.y ?? 0;
  }, [bones.hips, clonedScene, isFemale, skinTone, targetRigName]);

  useEffect(() => {
    if (!externalRef) return;
    externalRef.current = {
      group: groupRef.current,
      setAnimState: (state: AnimState) => { stateRef.current = state; },
      getAnimState: () => stateRef.current,
      setSpeedFactor: (factor: number) => { speedRef.current = THREE.MathUtils.clamp(factor, 0.3, 2); },
    };
    return () => {
      if (externalRef.current?.group === groupRef.current) externalRef.current = null;
    };
  }, [externalRef]);

  useFrame((_, delta) => {
    const state = stateRef.current;
    const moving = state === 'walking' || state === 'running';
    const sitting = state === 'sitting';
    const frequency = state === 'running' ? 10 : 6;
    phaseRef.current += delta * frequency * speedRef.current;
    const stride = moving ? Math.sin(phaseRef.current) * (state === 'running' ? 0.65 : 0.45) : 0;
    const idleSway = !moving && !sitting ? Math.sin(phaseRef.current * 0.7) * 0.025 : 0;

    poseBone(bones.hips, 'y', sitting ? baseHipY.current - 0.42 : baseHipY.current + idleSway, delta);
    poseRotation(bones.spine, baseRotations, sitting ? -0.16 : idleSway * 1.5, delta);
    poseRotation(bones.leftThigh, baseRotations, sitting ? -1.25 : stride, delta);
    poseRotation(bones.rightThigh, baseRotations, sitting ? -1.25 : -stride, delta);
    poseRotation(bones.leftShin, baseRotations, sitting ? 1.4 : Math.max(0, -stride) * 0.85, delta);
    poseRotation(bones.rightShin, baseRotations, sitting ? 1.4 : Math.max(0, stride) * 0.85, delta);
    poseRotation(bones.leftUpperArm, baseRotations, sitting ? -0.22 : -stride * 0.48, delta);
    poseRotation(bones.rightUpperArm, baseRotations, sitting ? -0.22 : stride * 0.48, delta);
    poseRotation(bones.leftForearm, baseRotations, sitting ? -0.18 : 0, delta);
    poseRotation(bones.rightForearm, baseRotations, sitting ? -0.18 : 0, delta);
  });

  return (
    <group ref={groupRef} position={position} scale={(scale ?? 1) * 0.58}>
      <primitive object={clonedScene} />
    </group>
  );
}

function createBoneMap(root: THREE.Object3D): BoneMap {
  return {
    hips: findBone(root, [/pelvis.*l/i, /hip/i]),
    spine: findBone(root, [/^spine(_1)?$/i, /spine/i]),
    leftThigh: findBone(root, [/thigh.*l/i, /leftupleg/i]),
    rightThigh: findBone(root, [/thigh.*r/i, /rightupleg/i]),
    leftShin: findBone(root, [/shin.*l/i, /leftleg/i]),
    rightShin: findBone(root, [/shin.*r/i, /rightleg/i]),
    leftUpperArm: findBone(root, [/upper_arm.*l/i, /leftarm/i]),
    rightUpperArm: findBone(root, [/upper_arm.*r/i, /rightarm/i]),
    leftForearm: findBone(root, [/forearm.*l/i, /leftforearm/i]),
    rightForearm: findBone(root, [/forearm.*r/i, /rightforearm/i]),
  };
}

function captureBaseRotations(bones: BoneMap): BaseRotations {
  const rotations = new Map<THREE.Bone, number>();
  Object.values(bones).forEach((bone) => {
    if (bone) rotations.set(bone, bone.rotation.x);
  });
  return rotations;
}

function findBone(root: THREE.Object3D, patterns: (string | RegExp)[]): THREE.Bone | null {
  let result: THREE.Bone | null = null;
  root.traverse((obj) => {
    if (result) return;
    if (obj instanceof THREE.Bone) {
      for (const p of patterns) {
        if (typeof p === 'string' && obj.name.toLowerCase() === p.toLowerCase()) {
          result = obj;
          return;
        } else if (p instanceof RegExp && p.test(obj.name)) {
          result = obj;
          return;
        }
      }
    }
  });
  return result;
}

function poseRotation(bone: THREE.Bone | null, baseRotations: BaseRotations, offset: number, delta: number) {
  if (!bone) return;
  const base = baseRotations.get(bone) ?? 0;
  bone.rotation.x = THREE.MathUtils.damp(bone.rotation.x, base + offset, 9, delta);
}

function poseBone(bone: THREE.Bone | null, axis: 'x' | 'y' | 'z', target: number, delta: number) {
  if (!bone) return;
  bone.position[axis] = THREE.MathUtils.damp(bone.position[axis], target, 8, delta);
}

useGLTF.preload(HUMAN_MODEL_URL);
