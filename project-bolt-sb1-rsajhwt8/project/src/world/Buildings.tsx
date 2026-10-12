import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BUILDINGS, type BuildingDef } from './worldData';

export function Buildings() {
  return (
    <group>
      {BUILDINGS.map((b) => (
        <Building key={b.id} def={b} />
      ))}
    </group>
  );
}

function Building({ def }: { def: BuildingDef }) {
  const signRef = useRef<THREE.Group>(null);
  const w = def.size[0];
  const h = def.size[1];
  const d = def.size[2];

  useFrame((state) => {
    if (signRef.current) {
      signRef.current.position.y = h + 2.5 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }
  });

  const windowRows = Math.max(1, Math.floor((h - 2) / 2.5));
  const windowCols = Math.max(1, Math.floor(w / 3));

  return (
    <group position={def.position}>
      {/* Foundation */}
      <mesh receiveShadow castShadow position={[0, 0.25, 0]}>
        <boxGeometry args={[w + 0.4, 0.5, d + 0.4]} />
        <meshStandardMaterial color="#6a6258" roughness={0.9} />
      </mesh>

      {/* Main body */}
      <mesh receiveShadow castShadow position={[0, h / 2 + 0.5, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={def.color} roughness={0.85} />
      </mesh>

      {/* Front facade accent strip */}
      <mesh position={[0, h * 0.35 + 0.5, d / 2 + 0.02]}>
        <planeGeometry args={[w, 0.3]} />
        <meshStandardMaterial color={def.accentColor} roughness={0.6} />
      </mesh>

      {/* Roof slab */}
      <mesh castShadow position={[0, h + 0.7, 0]}>
        <boxGeometry args={[w + 0.8, 0.4, d + 0.8]} />
        <meshStandardMaterial color={def.accentColor} roughness={0.5} />
      </mesh>

      {/* Parapet railing */}
      <mesh position={[0, h + 1.1, 0]}>
        <boxGeometry args={[w + 0.4, 0.5, d + 0.4]} />
        <meshStandardMaterial color={def.color} roughness={0.8} />
      </mesh>

      {/* Per-building distinctive features */}
      {def.id === 'court' && <CourtFeatures w={w} h={h} d={d} />}
      {def.id === 'football' && <ArenaFeatures w={w} h={h} d={d} />}
      {def.id === 'games' && <LoungeFeatures w={w} h={h} d={d} />}
      {def.id === 'cafe' && <CafeFeatures w={w} h={h} d={d} />}

      {/* Windows on front face */}
      {Array.from({ length: windowRows }).map((_, row) =>
        Array.from({ length: windowCols }).map((_, col) => {
          const x = -w / 2 + (w / (windowCols + 1)) * (col + 1);
          const y = 2 + row * 2.5;
          return (
            <group key={`${row}-${col}`} position={[x, y, d / 2 + 0.03]}>
              <mesh>
                <planeGeometry args={[1.6, 1.8]} />
                <meshStandardMaterial color="#5a8ab8" roughness={0.1} metalness={0.4} transparent opacity={0.7} />
              </mesh>
              <mesh position={[0, 0, -0.02]}>
                <boxGeometry args={[1.8, 2, 0.04]} />
                <meshStandardMaterial color="#3a3a3a" roughness={0.7} />
              </mesh>
              <mesh position={[0, -1, 0.05]}>
                <boxGeometry args={[1.8, 0.1, 0.15]} />
                <meshStandardMaterial color={def.accentColor} roughness={0.6} />
              </mesh>
            </group>
          );
        })
      )}

      {/* Side windows */}
      {Array.from({ length: windowRows }).map((_, row) =>
        Array.from({ length: Math.max(1, Math.floor(d / 3)) }).map((_, col) => {
          const z = -d / 2 + (d / (Math.floor(d / 3) + 1)) * (col + 1);
          const y = 2 + row * 2.5;
          return (
            <mesh key={`l-${row}-${col}`} position={[-w / 2 - 0.03, y, z]} rotation={[0, -Math.PI / 2, 0]}>
              <planeGeometry args={[1.6, 1.8]} />
              <meshStandardMaterial color="#5a8ab8" roughness={0.1} metalness={0.4} transparent opacity={0.7} />
            </mesh>
          );
        })
      )}
      {Array.from({ length: windowRows }).map((_, row) =>
        Array.from({ length: Math.max(1, Math.floor(d / 3)) }).map((_, col) => {
          const z = -d / 2 + (d / (Math.floor(d / 3) + 1)) * (col + 1);
          const y = 2 + row * 2.5;
          return (
            <mesh key={`r-${row}-${col}`} position={[w / 2 + 0.03, y, z]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[1.6, 1.8]} />
              <meshStandardMaterial color="#5a8ab8" roughness={0.1} metalness={0.4} transparent opacity={0.7} />
            </mesh>
          );
        })
      )}

      {/* Entrance */}
      <group position={[0, 0, d / 2 + 0.1]}>
        <mesh castShadow position={[0, 3.5, 0.3]}>
          <boxGeometry args={[4, 0.3, 1.5]} />
          <meshStandardMaterial color={def.accentColor} roughness={0.5} />
        </mesh>
        <mesh castShadow position={[-1.6, 2, 0.7]}>
          <cylinderGeometry args={[0.08, 0.08, 3, 8]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh castShadow position={[1.6, 2, 0.7]}>
          <cylinderGeometry args={[0.08, 0.08, 3, 8]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[-0.55, 1.6, 0]}>
          <boxGeometry args={[1, 3.2, 0.1]} />
          <meshStandardMaterial color="#2a1a0e" roughness={0.4} metalness={0.3} />
        </mesh>
        <mesh position={[0.55, 1.6, 0]}>
          <boxGeometry args={[1, 3.2, 0.1]} />
          <meshStandardMaterial color="#2a1a0e" roughness={0.4} metalness={0.3} />
        </mesh>
        <mesh position={[0, 1.6, -0.05]}>
          <boxGeometry args={[2.4, 3.6, 0.08]} />
          <meshStandardMaterial color={def.accentColor} roughness={0.5} />
        </mesh>
        <mesh receiveShadow position={[0, 0.1, 0.5]}>
          <boxGeometry args={[3.5, 0.2, 0.8]} />
          <meshStandardMaterial color="#9a9088" roughness={0.8} />
        </mesh>
        <mesh receiveShadow position={[0, 0.05, 0.9]}>
          <boxGeometry args={[4, 0.1, 0.4]} />
          <meshStandardMaterial color="#8a8078" roughness={0.8} />
        </mesh>
      </group>

      {/* Floating glowing sign */}
      <group ref={signRef} position={[0, h + 2.5, 0]}>
        <mesh>
          <boxGeometry args={[Math.max(w * 0.6, 5), 1.2, 0.15]} />
          <meshStandardMaterial color={def.signColor} emissive={def.signColor} emissiveIntensity={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[-Math.max(w * 0.3, 2.5), -1.5, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 3, 8]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[Math.max(w * 0.3, 2.5), -1.5, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 3, 8]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.5} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

// Court: classical columns and a gavel symbol
function CourtFeatures({ w, h, d }: { w: number; h: number; d: number }) {
  const colPositions = [-w / 2 + 1.5, -w / 4, 0, w / 4, w / 2 - 1.5];
  return (
    <group>
      {/* Columns along front */}
      {colPositions.map((x, i) => (
        <group key={i} position={[x, 0, d / 2 + 0.3]}>
          <mesh castShadow position={[0, h * 0.4 + 0.5, 0]}>
            <cylinderGeometry args={[0.35, 0.4, h * 0.8, 12]} />
            <meshStandardMaterial color="#e8e2d6" roughness={0.5} />
          </mesh>
          <mesh castShadow position={[0, h + 0.9, 0]}>
            <boxGeometry args={[0.9, 0.3, 0.9]} />
            <meshStandardMaterial color="#d4c8b8" roughness={0.5} />
          </mesh>
          <mesh castShadow position={[0, 0.6, 0]}>
            <boxGeometry args={[0.9, 0.2, 0.9]} />
            <meshStandardMaterial color="#d4c8b8" roughness={0.5} />
          </mesh>
        </group>
      ))}
      {/* Gavel symbol on roof */}
      <group position={[0, h + 1.4, 0]}>
        <mesh castShadow rotation={[0, 0, Math.PI / 6]}>
          <cylinderGeometry args={[0.3, 0.3, 1.2, 12]} />
          <meshStandardMaterial color="#c68f2e" roughness={0.4} metalness={0.3} />
        </mesh>
        <mesh castShadow position={[0.6, 0.1, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.8, 8]} />
          <meshStandardMaterial color="#8b5e3c" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

// Arena: stadium light towers and a soccer ball
function ArenaFeatures({ w, h, d }: { w: number; h: number; d: number }) {
  const lightPositions: [number, number][] = [
    [-w / 2 - 0.5, -d / 2 - 0.5], [w / 2 + 0.5, -d / 2 - 0.5],
    [-w / 2 - 0.5, d / 2 + 0.5], [w / 2 + 0.5, d / 2 + 0.5],
  ];
  return (
    <group>
      {lightPositions.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh castShadow position={[0, h + 1, 0]}>
            <cylinderGeometry args={[0.12, 0.15, h + 2, 8]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, h + 2, 0]}>
            <boxGeometry args={[1.5, 0.6, 0.8]} />
            <meshStandardMaterial color="#1a1a1a" emissive="#fff8e0" emissiveIntensity={0.3} />
          </mesh>
        </group>
      ))}
      {/* Soccer ball on roof */}
      <mesh castShadow position={[0, h + 1.4, 0]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      {/* Green pitch accent on front facade */}
      <mesh position={[0, 1, d / 2 + 0.03]}>
        <planeGeometry args={[w - 1, 0.8]} />
        <meshStandardMaterial color="#358a42" roughness={0.7} />
      </mesh>
    </group>
  );
}

// Lounge: neon accent strips and a game controller silhouette
function LoungeFeatures({ w, h, d }: { w: number; h: number; d: number }) {
  return (
    <group>
      {/* Neon strips on front corners */}
      <mesh position={[-w / 2 + 0.2, h * 0.5, d / 2 + 0.05]}>
        <boxGeometry args={[0.15, h * 0.7, 0.06]} />
        <meshStandardMaterial color="#dc3b5c" emissive="#dc3b5c" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[w / 2 - 0.2, h * 0.5, d / 2 + 0.05]}>
        <boxGeometry args={[0.15, h * 0.7, 0.06]} />
        <meshStandardMaterial color="#dc3b5c" emissive="#dc3b5c" emissiveIntensity={0.8} />
      </mesh>
      {/* Glowing accent band */}
      <mesh position={[0, h * 0.7 + 0.5, d / 2 + 0.02]}>
        <planeGeometry args={[w - 0.5, 0.15]} />
        <meshStandardMaterial color="#dc3b5c" emissive="#dc3b5c" emissiveIntensity={0.6} />
      </mesh>
      {/* Controller icon on roof */}
      <group position={[0, h + 1.4, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.4, 0.5, 0.9]} />
          <meshStandardMaterial color="#dc3b5c" roughness={0.4} />
        </mesh>
        {/* Analog sticks */}
        <mesh position={[-0.35, 0.3, 0.2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.1, 8]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>
        <mesh position={[0.35, 0.3, 0.2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.1, 8]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

// Cafe: awning, outdoor table, and a coffee cup
function CafeFeatures({ w, h, d }: { w: number; h: number; d: number }) {
  return (
    <group>
      {/* Striped awning over entrance */}
      <group position={[0, 3, d / 2 + 0.8]}>
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={i} position={[-2 + i * 1, 0, 0]} rotation={[-Math.PI / 6, 0, 0]}>
            <boxGeometry args={[1, 0.08, 1.2]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#8b5e3c' : '#f0e8e0'} roughness={0.6} />
          </mesh>
        ))}
      </group>
      {/* Outdoor table */}
      <group position={[w / 2 - 2, 0, d / 2 + 2.5]}>
        <mesh castShadow position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.08, 16]} />
          <meshStandardMaterial color="#8b5e3c" roughness={0.6} />
        </mesh>
        <mesh castShadow position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.7, 8]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.5} />
        </mesh>
        {/* Coffee cup on table */}
        <mesh castShadow position={[0, 0.78, 0]}>
          <cylinderGeometry args={[0.12, 0.1, 0.2, 12]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
      </group>
      {/* Coffee cup on roof */}
      <mesh castShadow position={[0, h + 1.4, 0]}>
        <cylinderGeometry args={[0.5, 0.4, 0.7, 16]} />
        <meshStandardMaterial color="#8b5e3c" roughness={0.5} />
      </mesh>
      <mesh position={[0.6, h + 1.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.25, 0.05, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#8b5e3c" roughness={0.5} />
      </mesh>
    </group>
  );
}
