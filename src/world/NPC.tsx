import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { HumanCharacter } from './HumanCharacter';
import { type CharacterHandle, type AnimState } from './HumanCharacter';
import { checkCollision, checkBounds } from './worldData';

export interface NPCDef {
  id: string;
  appearanceKey: string;
  startPos: [number, number, number];
  patrolPoints: [number, number][];
  speed: number;
  idleTime: number;
}

interface NPCProps {
  def: NPCDef;
}

const _toDest = new THREE.Vector3();
const _pos = new THREE.Vector3();

export function NPC({ def }: NPCProps) {
  const groupRef = useRef<THREE.Group>(null);
  const charRef = useRef<CharacterHandle | null>(null);
  const targetRotation = useRef(0);
  const currentSpeed = useRef(0);
  const patrolIdx = useRef(0);
  const state = useRef<'walking' | 'idle'>('walking');
  const idleTimer = useRef(0);

  const points = useMemo(() => {
    return def.patrolPoints.map(([x, z]) => new THREE.Vector3(x, 0, z));
  }, [def.patrolPoints]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const dt = Math.min(delta, 0.05);

    let targetSpeed = 0;

    if (state.current === 'idle') {
      idleTimer.current -= dt;
      if (idleTimer.current <= 0) {
        state.current = 'walking';
        patrolIdx.current = (patrolIdx.current + 1) % points.length;
      }
    } else {
      const target = points[patrolIdx.current];
      const pos = groupRef.current.position;
      _toDest.subVectors(target, pos);
      _toDest.y = 0;
      const dist = _toDest.length();

      if (dist < 0.6) {
        state.current = 'idle';
        idleTimer.current = def.idleTime + Math.random() * 2;
        targetSpeed = 0;
      } else {
        _toDest.normalize();
        targetSpeed = def.speed;
        if (dist < 1.5) targetSpeed *= dist / 1.5;
        targetRotation.current = Math.atan2(_toDest.x, _toDest.z);
      }
    }

    const rate = targetSpeed > currentSpeed.current ? 5 : 8;
    currentSpeed.current = THREE.MathUtils.lerp(currentSpeed.current, targetSpeed, Math.min(1, dt * rate));

    if (currentSpeed.current > 0.01) {
      const moveX = Math.sin(targetRotation.current) * currentSpeed.current * dt;
      const moveZ = Math.cos(targetRotation.current) * currentSpeed.current * dt;
      _pos.copy(groupRef.current.position);
      const tryX = _pos.x + moveX;
      const tryZ = _pos.z + moveZ;
      if (!checkCollision(new THREE.Vector3(tryX, _pos.y, _pos.z))) _pos.x = tryX;
      if (!checkCollision(new THREE.Vector3(_pos.x, _pos.y, tryZ))) _pos.z = tryZ;
      _pos.y = 0;
      groupRef.current.position.copy(checkBounds(_pos));
    }

    const dr = targetRotation.current - groupRef.current.rotation.y;
    let adj = dr;
    while (adj > Math.PI) adj -= Math.PI * 2;
    while (adj < -Math.PI) adj += Math.PI * 2;
    groupRef.current.rotation.y += adj * 0.1;

    const isMoving = currentSpeed.current > 0.3;
    const animState: AnimState = isMoving
      ? 'walking'
      : (def.id === 'npc-2' ? 'talking' : def.id === 'npc-3' ? 'dancing' : 'idle');
    charRef.current?.setAnimState(animState);

    if (isMoving) {
      charRef.current?.setSpeedFactor(THREE.MathUtils.clamp(currentSpeed.current / def.speed, 0.3, 1.5));
    } else {
      charRef.current?.setSpeedFactor(1);
    }
  });

  return (
    <group ref={groupRef} position={def.startPos}>
      <HumanCharacter externalRef={charRef} appearanceKey={def.appearanceKey} scale={1} />
    </group>
  );
}

export const NPCS: NPCDef[] = [
  {
    id: 'npc-1',
    appearanceKey: 'male-a',
    startPos: [4, 0, -8],
    patrolPoints: [[4, -8], [8, 0], [4, 8], [0, 5], [-4, 0]],
    speed: 3.5,
    idleTime: 3,
  },
  {
    id: 'npc-2',
    appearanceKey: 'female-b',
    startPos: [-8, 0, 6],
    patrolPoints: [[-8, 6], [-10, 0], [-6, -4], [-4, 6], [-8, 10]],
    speed: 3,
    idleTime: 4,
  },
  {
    id: 'npc-3',
    appearanceKey: 'male-b',
    startPos: [10, 0, 4],
    patrolPoints: [[10, 4], [12, -2], [8, -8], [6, 0], [10, 6]],
    speed: 4,
    idleTime: 2,
  },
  {
    id: 'npc-4',
    appearanceKey: 'female-a',
    startPos: [-12, 0, -2],
    patrolPoints: [[-12, -2], [-8, -8], [-4, -2], [-8, 4], [-12, 6]],
    speed: 3.2,
    idleTime: 3.5,
  },
];
