import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { HumanCharacter } from './HumanCharacter';
import { type CharacterHandle, type AnimState } from './HumanCharacter';
import { PLAYER_SPEED, PLAYER_RUN_SPEED, checkCollision, checkBounds, getNearbyInteractable, type BuildingDef, type InteractableDef } from './worldData';

export interface PlayerHandle {
  group: THREE.Group | null;
  setDestination: (pos: THREE.Vector3) => void;
  clearDestination: () => void;
  getPosition: () => THREE.Vector3;
  setSitting: (sitting: boolean, faceRotation?: number) => void;
  isSitting: () => boolean;
}

interface PlayerProps {
  keys: React.MutableRefObject<Record<string, boolean>>;
  onNearInteractable: (info: { type: 'building' | 'object'; def: BuildingDef | InteractableDef } | null) => void;
  onArriveAtDestination: () => void;
  reducedMotion: boolean;
  cameraAngle: React.MutableRefObject<number>;
  cameraDistance: React.MutableRefObject<number>;
  playerRef: React.MutableRefObject<PlayerHandle | null>;
  appearanceKey: string;
}

// Reusable temp vectors to avoid per-frame allocations
const _toDest = new THREE.Vector3();
const _newPos = new THREE.Vector3();

import { useState, useEffect } from 'react';
import { type CustomAvatarConfig } from './HumanCharacter';

export function Player({ keys, onNearInteractable, onArriveAtDestination, reducedMotion, cameraAngle, cameraDistance, playerRef, appearanceKey }: PlayerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const charRef = useRef<CharacterHandle | null>(null);
  const { camera } = useThree();
  const targetRotation = useRef(0);
  const destination = useRef<THREE.Vector3 | null>(null);
  const currentSpeed = useRef(0);
  const lastNearbyId = useRef<string | null>(null);
  const sitting = useRef(false);

  const [customConfig, setCustomConfig] = useState<CustomAvatarConfig | undefined>(() => {
    try {
      const saved = localStorage.getItem('naija_avatar_config');
      return saved ? JSON.parse(saved) : undefined;
    } catch {
      return undefined;
    }
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem('naija_avatar_config');
        if (saved) setCustomConfig(JSON.parse(saved));
      } catch {}
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);
  const sitRotation = useRef(0);
  const arrivedFired = useRef(false);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const dt = Math.min(delta, 0.05);

    // If sitting, don't move — just ease rotation
    if (sitting.current) {
      groupRef.current.rotation.y = sitRotation.current;
      updateCamera(dt);
      return;
    }

    let dx = 0, dz = 0;
    let targetSpeed = 0;
    let isRunning = false;

    // Click-to-move destination
    if (destination.current) {
      const pos = groupRef.current.position;
      _toDest.subVectors(destination.current, pos);
      _toDest.y = 0;
      const dist = _toDest.length();

      if (dist < 0.4) {
        destination.current = null;
        if (!arrivedFired.current) {
          arrivedFired.current = true;
          onArriveAtDestination();
        }
      } else {
        _toDest.normalize();
        // Run for long distances, walk when close
        isRunning = dist > 6;
        targetSpeed = isRunning ? PLAYER_RUN_SPEED : PLAYER_SPEED;
        if (dist < 2) targetSpeed *= dist / 2;
        targetRotation.current = Math.atan2(_toDest.x, _toDest.z);
      }
    }

    // Keyboard movement (overrides destination)
    const k = keys.current;
    const moveZ = (k['w'] || k['arrowup'] ? 1 : 0) - (k['s'] || k['arrowdown'] ? 1 : 0);
    const moveX = (k['d'] || k['arrowright'] ? 1 : 0) - (k['a'] || k['arrowleft'] ? 1 : 0);

    if (moveZ !== 0 || moveX !== 0) {
      destination.current = null;
      dx = moveX * 0.7;
      dz = -moveZ;
      if (moveZ !== 0 && moveX !== 0) { dx *= 0.707; dz *= 0.707; }
      targetRotation.current = Math.atan2(dx, dz);
      // Shift to run
      isRunning = k['shift'] || false;
      targetSpeed = isRunning ? PLAYER_RUN_SPEED : PLAYER_SPEED;
    }

    // Acceleration / deceleration
    const accelRate = targetSpeed > currentSpeed.current ? 8 : 12;
    currentSpeed.current = THREE.MathUtils.lerp(currentSpeed.current, targetSpeed, Math.min(1, dt * accelRate));

    // Apply movement
    if (currentSpeed.current > 0.01) {
      const moveX = Math.sin(targetRotation.current) * currentSpeed.current * dt;
      const moveZ = Math.cos(targetRotation.current) * currentSpeed.current * dt;
      const pos = groupRef.current.position;

      _newPos.copy(pos);
      _newPos.x += moveX;
      if (!checkCollision(_newPos)) pos.x = _newPos.x;

      _newPos.copy(pos);
      _newPos.z += moveZ;
      if (!checkCollision(_newPos)) pos.z = _newPos.z;

      pos.y = 0;
      groupRef.current.position.copy(checkBounds(pos));
    }

    // Smooth rotation — faster when moving
    const rotSpeed = currentSpeed.current > 0.5 ? 0.15 : 0.08;
    const dr = targetRotation.current - groupRef.current.rotation.y;
    let adjDr = dr;
    while (adjDr > Math.PI) adjDr -= Math.PI * 2;
    while (adjDr < -Math.PI) adjDr += Math.PI * 2;
    groupRef.current.rotation.y += adjDr * rotSpeed;

    // Update animation state
    const isMoving = currentSpeed.current > 0.3;
    let animState: AnimState = 'idle';
    if (isMoving) {
      animState = currentSpeed.current > PLAYER_SPEED * 1.3 ? 'running' : 'walking';
    } else if (k['g']) {
      animState = 'dancing';
    }
    charRef.current?.setAnimState(animState);

    // Sync animation speed with movement speed to reduce foot sliding
    if (isMoving) {
      const baseSpeed = animState === 'running' ? PLAYER_RUN_SPEED : PLAYER_SPEED;
      const speedFactor = currentSpeed.current / baseSpeed;
      charRef.current?.setSpeedFactor(THREE.MathUtils.clamp(speedFactor, 0.3, 1.5));
    } else {
      charRef.current?.setSpeedFactor(1);
    }

    // Reset arrived flag when new destination set
    if (destination.current) arrivedFired.current = false;

    updateCamera(dt);

    // Check nearby interactable
    const nearby = getNearbyInteractable(groupRef.current.position);
    const nearbyId = nearby ? (nearby.def as { id: string }).id : null;
    if (nearbyId !== lastNearbyId.current) {
      lastNearbyId.current = nearbyId;
      onNearInteractable(nearby);
    }
  });

  function updateCamera(dt: number) {
    if (!groupRef.current) return;
    const ang = cameraAngle.current;
    const dist = cameraDistance.current;
    const target = groupRef.current.position;
    const camPos = new THREE.Vector3(
      target.x - Math.sin(ang) * dist,
      target.y + dist * 0.55,
      target.z - Math.cos(ang) * dist
    );
    const lerp = reducedMotion ? 0.25 : 0.12;
    camera.position.lerp(camPos, lerp);
    camera.lookAt(target.x, 2, target.z);
  }

  // Expose handle
  if (playerRef) {
    playerRef.current = {
      group: groupRef.current,
      setDestination: (pos: THREE.Vector3) => {
        if (sitting.current) return;
        destination.current = pos.clone();
        arrivedFired.current = false;
      },
      clearDestination: () => { destination.current = null; },
      getPosition: () => groupRef.current?.position.clone() ?? new THREE.Vector3(),
      setSitting: (s: boolean, faceRot?: number) => {
        sitting.current = s;
        destination.current = null;
        arrivedFired.current = true;
        currentSpeed.current = 0;
        if (s && faceRot !== undefined) {
          sitRotation.current = faceRot;
        }
        charRef.current?.setAnimState(s ? 'sitting' : 'idle');
      },
      isSitting: () => sitting.current,
    };
  }

  return (
    <group ref={groupRef} position={[0, 0, 10]}>
      <HumanCharacter externalRef={charRef} appearanceKey={appearanceKey} customConfig={customConfig} scale={1} />
    </group>
  );
}
