import { Component, useRef, forwardRef, useImperativeHandle, Suspense, type ErrorInfo, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Player, type PlayerHandle } from './Player';
import { Buildings } from './Buildings';
import { Environment } from './Environment';
import { NPC, NPCS } from './NPC';
import { HumanCharacter } from './HumanCharacter';
import { BUILDINGS, INTERACTABLES, getBenchSitPoint, getBenchSitRotation, type BuildingDef, type InteractableDef } from './worldData';

export interface DestinationMarkerHandle {
  show: (pos: THREE.Vector3) => void;
}

interface WorldCanvasProps {
  keys: React.MutableRefObject<Record<string, boolean>>;
  onNearInteractable: (info: { type: 'building' | 'object'; def: BuildingDef | InteractableDef } | null) => void;
  onArriveAtDestination: () => void;
  onGroundClick: (point: THREE.Vector3) => void;
  onObjectClick: (info: { type: 'building' | 'object'; def: BuildingDef | InteractableDef }) => void;
  reducedMotion: boolean;
  quality: 'high' | 'low';
  playerAppearance: string;
  cameraAngle: React.MutableRefObject<number>;
  cameraDistance: React.MutableRefObject<number>;
  playerRef: React.MutableRefObject<PlayerHandle | null>;
  markerRef: React.MutableRefObject<DestinationMarkerHandle | null>;
}

export function WorldCanvas({ keys, onNearInteractable, onArriveAtDestination, onGroundClick, onObjectClick, reducedMotion, quality, playerAppearance, cameraAngle, cameraDistance, playerRef, markerRef }: WorldCanvasProps) {
  const dpr: [number, number] = quality === 'high' ? [1, 1.5] : [0.6, 0.9];
  const shadows = quality === 'high';
  const shadowMapSize: [number, number] = quality === 'high' ? [2048, 2048] : [512, 512];

  return (
    <Canvas
      shadows={shadows}
      dpr={dpr}
      camera={{ position: [0, 14, 20], fov: 50, near: 0.1, far: 250 }}
      gl={{ antialias: quality === 'high', powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
      }}
    >
      <fog attach="fog" args={['#b0d0f0', 55, 130]} />

      <ambientLight intensity={0.5} color="#fffaf2" />
      <hemisphereLight args={['#b7d9f5', '#274c36', 0.9]} />
      <directionalLight
        position={[25, 35, 15]}
        intensity={1.7}
        color="#fff8e0"
        castShadow={shadows}
        shadow-mapSize={shadowMapSize}
        shadow-camera-far={100}
        shadow-camera-left={-45}
        shadow-camera-right={45}
        shadow-camera-top={45}
        shadow-camera-bottom={-45}
        shadow-bias={-0.0005}
      />

      <Environment />
      <Buildings />
      <ContactShadows position={[0, 0.03, 0]} opacity={0.32} scale={70} blur={2.4} far={18} resolution={quality === 'high' ? 1024 : 512} />

      {/* Characters load independently so one asset cannot hide the whole cast. */}
      {NPCS.map((npc) => (
        <CharacterBoundary key={npc.id}>
          <Suspense fallback={<group />}>
            <NPC def={npc} />
          </Suspense>
        </CharacterBoundary>
      ))}

      <CharacterBoundary>
        <Suspense fallback={<group />}>
          <Player
            keys={keys}
            onNearInteractable={onNearInteractable}
            onArriveAtDestination={onArriveAtDestination}
            reducedMotion={reducedMotion}
            cameraAngle={cameraAngle}
            cameraDistance={cameraDistance}
            playerRef={playerRef}
            appearanceKey={playerAppearance}
          />
        </Suspense>
      </CharacterBoundary>

      {/* Invisible ground plane for raycasting clicks — must be large enough */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onGroundClick(e.point);
        }}
      >
        <planeGeometry args={[80, 60]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Click targets for buildings — opens interaction menu directly */}
      {BUILDINGS.map((b) => (
        <mesh
          key={b.id}
          position={[b.position[0], b.size[1] / 2, b.position[2]]}
          onClick={(e) => {
            e.stopPropagation();
            onObjectClick({ type: 'building', def: b });
          }}
        >
          <boxGeometry args={b.size} />
          <meshBasicMaterial visible={false} />
        </mesh>
      ))}

      {/* Click targets for interactables — opens interaction menu directly */}
      {INTERACTABLES.map((obj) => (
        <mesh
          key={obj.id}
          position={[obj.position[0], 1, obj.position[2]]}
          onClick={(e) => {
            e.stopPropagation();
            onObjectClick({ type: 'object', def: obj });
          }}
        >
          <boxGeometry args={[Math.max(obj.collisionRadius * 2, 1.5), 2, Math.max(obj.collisionRadius * 2, 1.5)]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      ))}

      <DestinationMarker ref={markerRef} />
    </Canvas>
  );
}

const DestinationMarker = forwardRef<DestinationMarkerHandle>((_props, ref) => {
  const markerRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const targetPos = useRef<THREE.Vector3 | null>(null);
  const alpha = useRef(0);

  useFrame((_, delta) => {
    if (targetPos.current && markerRef.current && ringRef.current && pulseRef.current) {
      markerRef.current.position.set(targetPos.current.x, 0.05, targetPos.current.z);
      markerRef.current.rotation.z += delta * 1.5;
      ringRef.current.position.set(targetPos.current.x, 0.05, targetPos.current.z);
      ringRef.current.rotation.z -= delta * 1;
      pulseRef.current.position.set(targetPos.current.x, 0.05, targetPos.current.z);

      alpha.current -= delta * 0.5;
      if (alpha.current <= 0) {
        targetPos.current = null;
        markerRef.current.visible = false;
        ringRef.current.visible = false;
        pulseRef.current.visible = false;
      } else {
        const mat1 = markerRef.current.material as THREE.MeshBasicMaterial;
        const mat2 = ringRef.current.material as THREE.MeshBasicMaterial;
        const mat3 = pulseRef.current.material as THREE.MeshBasicMaterial;
        mat1.opacity = Math.min(alpha.current * 0.9, 0.9);
        mat2.opacity = Math.min(alpha.current * 0.6, 0.6);
        mat3.opacity = Math.min(alpha.current * 0.4, 0.4);
        const scale = 1 + (1 - alpha.current) * 0.8;
        ringRef.current.scale.set(scale, scale, 1);
        pulseRef.current.scale.set(1 + (1 - alpha.current) * 1.5, 1 + (1 - alpha.current) * 1.5, 1);
      }
    }
  });

  useImperativeHandle(ref, () => ({
    show: (pos: THREE.Vector3) => {
      targetPos.current = pos.clone();
      alpha.current = 1;
      if (markerRef.current) markerRef.current.visible = true;
      if (ringRef.current) ringRef.current.visible = true;
      if (pulseRef.current) pulseRef.current.visible = true;
    },
  }));

  return (
    <group>
      <mesh ref={markerRef} visible={false} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.5, 24]} />
        <meshBasicMaterial color="#c68f2e" transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ringRef} visible={false} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.7, 24]} />
        <meshBasicMaterial color="#d4a449" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={pulseRef} visible={false} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.85, 24]} />
        <meshBasicMaterial color="#f4c469" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
});
DestinationMarker.displayName = 'DestinationMarker';

class CharacterBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    this.setState({ hasError: true });
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}
