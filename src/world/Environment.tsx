import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { INTERACTABLES, BUILDINGS } from './worldData';

export function Environment() {
  return (
    <group>
      <Ground />
      <Walkways />
      <StreetLayer />
      <MarketStalls />
      <PalmLandscaping />
      <PlazaDetails />
      <InteractableObjects />
      <Trees />
      <FlowerBeds />
      <Flags />
      <BoundaryHedge />
      <SkyDome />
    </group>
  );
}

function Ground() {
  const grassTex = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#4a7a4a';
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const shade = Math.random();
      ctx.fillStyle = shade > 0.5 ? '#5a8a5a' : '#3a6a3a';
      ctx.fillRect(x, y, 3, 3);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(12, 10);
    return tex;
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
      <planeGeometry args={[70, 54]} />
      <meshStandardMaterial map={grassTex} roughness={0.95} />
    </mesh>
  );
}

function Walkways() {
  const pavingTex = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#c4c0b8';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#a09a8e';
    ctx.lineWidth = 3;
    const ts = 64;
    for (let i = 0; i <= 256; i += ts) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 256); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(256, i); ctx.stroke();
    }
    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = `rgba(${180 + Math.random() * 20}, ${175 + Math.random() * 20}, ${165 + Math.random() * 20}, 0.4)`;
      ctx.fillRect(Math.random() * 256, Math.random() * 256, 8, 8);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 5);
    return tex;
  }, []);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.01, 2]}>
        <circleGeometry args={[14, 48]} />
        <meshStandardMaterial map={pavingTex} roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[-10, 0.01, -4]}>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial map={pavingTex} roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[10, 0.01, -4]}>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial map={pavingTex} roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[-10, 0.01, 12]}>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial map={pavingTex} roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[10, 0.01, 12]}>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial map={pavingTex} roughness={0.8} />
      </mesh>
    </group>
  );
}

function PlazaDetails() {
  return (
    <group>
      <AnimatedFountain />
      <WelcomeArch />

      {[
        [-10, 8], [10, 8], [-10, -6], [10, -6], [-8, 14], [8, 14],
      ].map((pos, i) => (
        <Planter key={i} position={[pos[0], 0, pos[1]]} />
      ))}

      {[
        [-14, 10], [14, 10], [-14, -8], [14, -8], [-14, 18], [14, 18], [0, -18],
      ].map((pos, i) => (
        <LampPost key={i} position={[pos[0], 0, pos[1]]} />
      ))}
    </group>
  );
}

function AnimatedFountain() {
  const waterRef = useRef<THREE.Mesh>(null);
  const spoutRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (waterRef.current) {
      waterRef.current.position.y = 0.6 + Math.sin(t * 1.5) * 0.03;
    }
    if (spoutRef.current) {
      spoutRef.current.scale.y = 1 + Math.sin(t * 3) * 0.15;
    }
  });

  return (
    <group position={[0, 0, 2]}>
      <mesh position={[0, 0.4, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3.5, 3.8, 0.8, 32]} />
        <meshStandardMaterial color="#a8a098" roughness={0.6} />
      </mesh>
      <mesh ref={waterRef} position={[0, 0.6, 0]}>
        <cylinderGeometry args={[3.1, 3.1, 0.1, 32]} />
        <meshStandardMaterial color="#4a9adb" roughness={0.1} metalness={0.3} transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, 2, 16]} />
        <meshStandardMaterial color="#c4b8a8" roughness={0.5} />
      </mesh>
      <mesh position={[0, 2.8, 0]} castShadow>
        <cylinderGeometry args={[1.2, 0.6, 0.4, 16]} />
        <meshStandardMaterial color="#c4b8a8" roughness={0.5} />
      </mesh>
      <mesh ref={spoutRef} position={[0, 3.5, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1, 8]} />
        <meshStandardMaterial color="#6ab4eb" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <torusGeometry args={[3.5, 0.12, 8, 32]} />
        <meshStandardMaterial color="#d4c8b8" roughness={0.4} />
      </mesh>
      {/* Decorative stone blocks around fountain */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2;
        const r = 4.3;
        return (
          <mesh key={i} castShadow position={[Math.cos(angle) * r, 0.2, Math.sin(angle) * r + 2]}>
            <boxGeometry args={[0.6, 0.4, 0.6]} />
            <meshStandardMaterial color="#9a9088" roughness={0.8} />
          </mesh>
        );
      })}
    </group>
  );
}

function WelcomeArch() {
  return (
    <group position={[0, 0, 18]}>
      {/* Left pillar */}
      <mesh castShadow position={[-4, 2.5, 0]}>
        <boxGeometry args={[0.8, 5, 0.8]} />
        <meshStandardMaterial color="#d4c8b8" roughness={0.6} />
      </mesh>
      {/* Right pillar */}
      <mesh castShadow position={[4, 2.5, 0]}>
        <boxGeometry args={[0.8, 5, 0.8]} />
        <meshStandardMaterial color="#d4c8b8" roughness={0.6} />
      </mesh>
      {/* Arch top */}
      <mesh castShadow position={[0, 5.5, 0]}>
        <boxGeometry args={[9, 1, 0.8]} />
        <meshStandardMaterial color="#c68f2e" roughness={0.5} />
      </mesh>
      {/* Sign panel */}
      <mesh position={[0, 5.5, 0.42]}>
        <planeGeometry args={[8, 0.8]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.4} />
      </mesh>
      {/* Decorative caps on pillars */}
      <mesh castShadow position={[-4, 5.1, 0]}>
        <boxGeometry args={[1, 0.2, 1]} />
        <meshStandardMaterial color="#c68f2e" roughness={0.5} />
      </mesh>
      <mesh castShadow position={[4, 5.1, 0]}>
        <boxGeometry args={[1, 0.2, 1]} />
        <meshStandardMaterial color="#c68f2e" roughness={0.5} />
      </mesh>
    </group>
  );
}

function InteractableObjects() {
  return (
    <group>
      {INTERACTABLES.filter((o) => o.type === 'bench').map((bench) => (
        <Bench key={bench.id} position={bench.position} rotation={bench.sitRotation} />
      ))}
    </group>
  );
}

function Bench({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[2, 0.12, 0.6]} />
        <meshStandardMaterial color="#6b4e3a" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0, 0.85, -0.25]}>
        <boxGeometry args={[2, 0.6, 0.1]} />
        <meshStandardMaterial color="#6b4e3a" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[-0.8, 0.25, 0]}>
        <boxGeometry args={[0.1, 0.5, 0.5]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh castShadow position={[0.8, 0.25, 0]}>
        <boxGeometry args={[0.1, 0.5, 0.5]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Bench armrests */}
      <mesh castShadow position={[-0.95, 0.65, 0]}>
        <boxGeometry args={[0.08, 0.3, 0.5]} />
        <meshStandardMaterial color="#6b4e3a" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0.95, 0.65, 0]}>
        <boxGeometry args={[0.08, 0.3, 0.5]} />
        <meshStandardMaterial color="#6b4e3a" roughness={0.7} />
      </mesh>
    </group>
  );
}

function Trees() {
  const positions: [number, number][] = [
    [-26, -18], [26, -18], [-26, 20], [26, 20],
    [-14, -18], [14, -18], [-28, 0], [28, 0],
    [-26, -10], [26, -10], [-28, 10], [28, 10],
    [-15, 22], [15, 22],
  ];

  return (
    <group>
      {positions.map((pos, i) => (
        <Tree key={i} position={[pos[0], 0, pos[1]]} variant={i % 3} />
      ))}
    </group>
  );
}

function Tree({ position, variant }: { position: [number, number, number]; variant: number }) {
  const trunkColor = '#5c3a1e';
  const leafColors = ['#3a6a3a', '#4a7a4a', '#2a5a2a'];

  return (
    <group position={position}>
      <mesh castShadow position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.25, 0.35, 3, 8]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>
      {variant === 0 && (
        <>
          <mesh castShadow position={[0, 3.5, 0]}>
            <sphereGeometry args={[1.6, 16, 16]} />
            <meshStandardMaterial color={leafColors[0]} roughness={0.9} />
          </mesh>
          <mesh castShadow position={[0.8, 4, 0.3]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color={leafColors[1]} roughness={0.9} />
          </mesh>
        </>
      )}
      {variant === 1 && (
        <>
          <mesh castShadow position={[0, 3.2, 0]}>
            <coneGeometry args={[1.8, 3, 12]} />
            <meshStandardMaterial color={leafColors[2]} roughness={0.9} />
          </mesh>
          <mesh castShadow position={[0, 4.5, 0]}>
            <coneGeometry args={[1.2, 2, 12]} />
            <meshStandardMaterial color={leafColors[0]} roughness={0.9} />
          </mesh>
        </>
      )}
      {variant === 2 && (
        <>
          <mesh castShadow position={[0, 3, 0]}>
            <sphereGeometry args={[1.4, 16, 16]} />
            <meshStandardMaterial color={leafColors[1]} roughness={0.9} />
          </mesh>
          <mesh castShadow position={[-0.6, 4, 0.4]}>
            <sphereGeometry args={[0.9, 12, 12]} />
            <meshStandardMaterial color={leafColors[0]} roughness={0.9} />
          </mesh>
          <mesh castShadow position={[0.6, 3.8, -0.3]}>
            <sphereGeometry args={[0.8, 12, 12]} />
            <meshStandardMaterial color={leafColors[2]} roughness={0.9} />
          </mesh>
        </>
      )}
    </group>
  );
}

function LampPost({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 5, 8]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 5, 0]}>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshStandardMaterial color="#fff8e0" emissive="#fff8e0" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, 4.8, 0]}>
        <cylinderGeometry args={[0.3, 0.15, 0.3, 12]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Lamp base */}
      <mesh castShadow position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.2, 12]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.6} />
      </mesh>
    </group>
  );
}

function Planter({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
        <boxGeometry args={[1.6, 0.7, 1.6]} />
        <meshStandardMaterial color="#8a7a6a" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, 1, 0]}>
        <sphereGeometry args={[0.7, 12, 12]} />
        <meshStandardMaterial color="#3a7a3a" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0.3, 1.2, 0.2]}>
        <sphereGeometry args={[0.4, 10, 10]} />
        <meshStandardMaterial color="#4a8a4a" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[-0.3, 1.1, -0.2]}>
        <sphereGeometry args={[0.35, 10, 10]} />
        <meshStandardMaterial color="#2a6a2a" roughness={0.9} />
      </mesh>
    </group>
  );
}

function FlowerBeds() {
  const bedColors = ['#e8447a', '#f4c842', '#e07a3a', '#d44a8a', '#f87a4a'];
  return (
    <group>
      {/* Flower beds near fountain */}
      {[
        [-8, 5], [8, 5], [-8, -1], [8, -1],
      ].map((pos, i) => (
        <group key={i} position={[pos[0], 0, pos[1]]}>
          <mesh receiveShadow castShadow position={[0, 0.15, 0]}>
            <boxGeometry args={[2.5, 0.3, 1]} />
            <meshStandardMaterial color="#8a7a6a" roughness={0.8} />
          </mesh>
          {/* Flowers */}
          {Array.from({ length: 6 }).map((_, fi) => {
            const fx = -1 + (fi % 3) * 0.8;
            const fz = -0.3 + Math.floor(fi / 3) * 0.5;
            return (
              <mesh key={fi} castShadow position={[fx, 0.35, fz]}>
                <sphereGeometry args={[0.15, 8, 8]} />
                <meshStandardMaterial color={bedColors[(i * 6 + fi) % bedColors.length]} roughness={0.8} />
              </mesh>
            );
          })}
          {/* Stems */}
          {Array.from({ length: 6 }).map((_, fi) => {
            const fx = -1 + (fi % 3) * 0.8;
            const fz = -0.3 + Math.floor(fi / 3) * 0.5;
            return (
              <mesh key={`s-${fi}`} position={[fx, 0.28, fz]}>
                <cylinderGeometry args={[0.02, 0.02, 0.25, 4]} />
                <meshStandardMaterial color="#2a6a2a" roughness={0.9} />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}

function Flags() {
  return (
    <group>
      {BUILDINGS.map((b) => (
        <Flag key={b.id} position={[b.position[0], b.size[1] + 3, b.position[2] - b.size[2] / 2 - 0.5]} color={b.accentColor} />
      ))}
    </group>
  );
}

function Flag({ position, color }: { position: [number, number, number]; color: string }) {
  const flagRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (flagRef.current) {
      const t = state.clock.elapsedTime;
      flagRef.current.rotation.y = Math.sin(t * 1.5 + position[0]) * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* Pole */}
      <mesh castShadow position={[0, 1, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 2, 8]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Flag */}
      <mesh ref={flagRef} position={[0.5, 1.7, 0]}>
        <planeGeometry args={[1, 0.6]} />
        <meshStandardMaterial color={color} roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function BoundaryHedge() {
  const hedgeMat = { color: '#3a6a3a', roughness: 0.95 };
  return (
    <group>
      <mesh position={[0, 0.6, -25]} castShadow receiveShadow>
        <boxGeometry args={[70, 1.2, 0.6]} />
        <meshStandardMaterial {...hedgeMat} />
      </mesh>
      <mesh position={[-15, 0.6, 25]} castShadow receiveShadow>
        <boxGeometry args={[40, 1.2, 0.6]} />
        <meshStandardMaterial {...hedgeMat} />
      </mesh>
      <mesh position={[15, 0.6, 25]} castShadow receiveShadow>
        <boxGeometry args={[40, 1.2, 0.6]} />
        <meshStandardMaterial {...hedgeMat} />
      </mesh>
      <mesh position={[-33, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 1.2, 52]} />
        <meshStandardMaterial {...hedgeMat} />
      </mesh>
      <mesh position={[33, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 1.2, 52]} />
        <meshStandardMaterial {...hedgeMat} />
      </mesh>
    </group>
  );
}

function StreetLayer() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.018, -18]} receiveShadow>
        <planeGeometry args={[70, 7]} />
        <meshStandardMaterial color="#34383a" roughness={0.92} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, -18]}>
        <planeGeometry args={[70, 0.12]} />
        <meshStandardMaterial color="#e0b84d" roughness={0.8} />
      </mesh>
      {[-29, -17, -5, 7, 19, 31].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.03, -18]}>
          <planeGeometry args={[4, 0.12]} />
          <meshStandardMaterial color="#efe9d9" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function MarketStalls() {
  const stalls: [number, number, string][] = [
    [-12, 13, '#d47b32'],
    [0, 15, '#19756b'],
    [12, 13, '#be3e3e'],
  ];
  return (
    <group>
      {stalls.map(([x, z, canopy]) => (
        <group key={`${x}-${z}`} position={[x, 0, z]}>
          <mesh castShadow position={[0, 1.35, 0]}>
            <boxGeometry args={[4.8, 0.14, 2.3]} />
            <meshStandardMaterial color={canopy} roughness={0.7} />
          </mesh>
          {[-2, 2].map((postX) => (
            <mesh key={postX} castShadow position={[postX, 0.75, 0]}>
              <cylinderGeometry args={[0.07, 0.09, 1.5, 8]} />
              <meshStandardMaterial color="#6b432d" roughness={0.8} />
            </mesh>
          ))}
          <mesh castShadow receiveShadow position={[0, 0.55, 0.15]}>
            <boxGeometry args={[4.4, 0.85, 1.1]} />
            <meshStandardMaterial color="#8b5b38" roughness={0.82} />
          </mesh>
          {[-1.4, -0.45, 0.45, 1.4].map((itemX, index) => (
            <mesh key={itemX} castShadow position={[itemX, 1.05, 0.75]}>
              <sphereGeometry args={[0.18 + (index % 2) * 0.04, 12, 10]} />
              <meshStandardMaterial color={['#d88935', '#e3b43d', '#cf4e43', '#4c9a51'][index]} roughness={0.75} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function PalmLandscaping() {
  const palms: [number, number][] = [[-25, 14], [25, 14], [-24, -15], [24, -15]];
  return (
    <group>
      {palms.map(([x, z]) => (
        <group key={`${x}-${z}`} position={[x, 0, z]}>
          <mesh castShadow position={[0, 2.6, 0]} rotation={[0, 0, x < 0 ? -0.08 : 0.08]}>
            <cylinderGeometry args={[0.22, 0.38, 5.2, 10]} />
            <meshStandardMaterial color="#754829" roughness={0.9} />
          </mesh>
          {[0, 1, 2, 3, 4].map((leaf) => (
            <mesh key={leaf} castShadow position={[0, 5.25, 0]} rotation={[0.15, (leaf / 5) * Math.PI * 2, 0.45]}>
              <coneGeometry args={[0.22, 3.2, 5]} />
              <meshStandardMaterial color={leaf % 2 ? '#2d7447' : '#3b8b50'} roughness={0.9} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function SkyDome() {
  return (
    <mesh>
      <sphereGeometry args={[100, 32, 16]} />
      <meshBasicMaterial color="#87b8e8" side={THREE.BackSide} fog={false} />
    </mesh>
  );
}
