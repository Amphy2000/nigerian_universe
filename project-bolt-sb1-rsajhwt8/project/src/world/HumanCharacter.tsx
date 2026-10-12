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

function RiggedHuman({ externalRef, appearanceKey, scale, position }: HumanCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const stateRef = useRef<AnimState>('idle');
  const speedRef = useRef(1);
  const phaseRef = useRef(Math.random() * Math.PI * 2);
  const { scene } = useGLTF(HUMAN_MODEL_URL);
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const characterName = (appearanceKey ?? '').toLowerCase().includes('female') ? 'Woman' : 'Man';
  const bones = useMemo(() => createBoneMap(clonedScene), [clonedScene]);
  const baseRotations = useMemo(() => captureBaseRotations(bones), [bones]);
  const baseHipY = useRef(0);

  useEffect(() => {
    clonedScene.traverse((object: THREE.Object3D) => {
      if (object.name === 'Man' || object.name === 'Woman') object.visible = object.name === characterName;
      if (object.name.includes('NonRig') || object.name.includes('HighPoly')) object.visible = false;
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
    baseHipY.current = bones.hips?.position.y ?? 0;
  }, [bones.hips, characterName, clonedScene]);

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
    const stride = moving ? Math.sin(phaseRef.current) * (state === 'running' ? 0.62 : 0.42) : 0;
    const idleSway = !moving && !sitting ? Math.sin(phaseRef.current * 0.65) * 0.025 : 0;

    poseBone(bones.hips, 'y', sitting ? baseHipY.current - 0.42 : baseHipY.current + idleSway, delta);
    poseRotation(bones.spine, baseRotations, sitting ? -0.16 : idleSway * 1.5, delta);
    poseRotation(bones.leftThigh, baseRotations, sitting ? -1.18 : stride, delta);
    poseRotation(bones.rightThigh, baseRotations, sitting ? -1.18 : -stride, delta);
    poseRotation(bones.leftShin, baseRotations, sitting ? 1.35 : Math.max(0, -stride) * 0.8, delta);
    poseRotation(bones.rightShin, baseRotations, sitting ? 1.35 : Math.max(0, stride) * 0.8, delta);
    poseRotation(bones.leftUpperArm, baseRotations, sitting ? -0.22 : -stride * 0.48, delta);
    poseRotation(bones.rightUpperArm, baseRotations, sitting ? -0.22 : stride * 0.48, delta);
    poseRotation(bones.leftForearm, baseRotations, sitting ? -0.18 : 0, delta);
    poseRotation(bones.rightForearm, baseRotations, sitting ? -0.18 : 0, delta);
  });

  return (
    <group ref={groupRef} position={position} scale={(scale ?? 1) * 1.12}>
      <primitive object={clonedScene} />
    </group>
  );
}

function createBoneMap(root: THREE.Object3D): BoneMap {
  return {
    hips: findBone(root, ['pelvis.L', 'Hips', 'mixamorigHips']),
    spine: findBone(root, ['spine', 'Spine', 'mixamorigSpine']),
    leftThigh: findBone(root, ['thigh.L', 'LeftUpLeg', 'mixamorigLeftUpLeg']),
    rightThigh: findBone(root, ['thigh.R', 'RightUpLeg', 'mixamorigRightUpLeg']),
    leftShin: findBone(root, ['shin.L', 'LeftLeg', 'mixamorigLeftLeg']),
    rightShin: findBone(root, ['shin.R', 'RightLeg', 'mixamorigRightLeg']),
    leftUpperArm: findBone(root, ['upper_arm.L', 'LeftArm', 'mixamorigLeftArm']),
    rightUpperArm: findBone(root, ['upper_arm.R', 'RightArm', 'mixamorigRightArm']),
    leftForearm: findBone(root, ['forearm.L', 'LeftForeArm', 'mixamorigLeftForeArm']),
    rightForearm: findBone(root, ['forearm.R', 'RightForeArm', 'mixamorigRightForeArm']),
  };
}

function captureBaseRotations(bones: BoneMap): BaseRotations {
  const rotations = new Map<THREE.Bone, number>();
  Object.values(bones).forEach((bone) => {
    if (bone) rotations.set(bone, bone.rotation.x);
  });
  return rotations;
}

function findBone(root: THREE.Object3D, names: string[]): THREE.Bone | null {
  for (const name of names) {
    const found = root.getObjectByName(name);
    if (found instanceof THREE.Bone) return found;
  }
  return null;
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
