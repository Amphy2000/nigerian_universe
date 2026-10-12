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
        <meshStandardMaterial color="#332d29" roughness={0.9} />
      </mesh>

      {/* Main body */}
      <mesh receiveShadow castShadow position={[0, h / 2 + 0.5, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={def.color} roughness={0.85} />
      </mesh>

      {/* Front facade accent strip */}
      <mesh position={[0, h * 0.35 + 0.5, d / 2 + 0.02]}>
        <planeGeometry args={[w, 0.4]} />
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

      {/* Per-building authentic Nigerian features */}
      {def.id === 'buka' && <BukaFeatures w={w} h={h} d={d} />}
      {def.id === 'suya' && <SuyaFeatures w={w} h={h} d={d} />}
      {def.id === 'tech-hub' && <TechHubFeatures w={w} h={h} d={d} />}
      {def.id === 'danfo-stop' && <DanfoFeatures w={w} h={h} d={d} />}
      {def.id === 'owambe-canopy' && <OwambeFeatures w={w} h={h} d={d} />}

      {/* Windows on front face */}
      {Array.from({ length: windowRows }).map((_, row) =>
        Array.from({ length: windowCols }).map((_, col) => {
          const x = -w / 2 + (w / (windowCols + 1)) * (col + 1);
          const y = 2 + row * 2.5;
          return (
            <group key={`${row}-${col}`} position={[x, y, d / 2 + 0.03]}>
              <mesh>
                <planeGeometry args={[1.6, 1.8]} />
                <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.4} transparent opacity={0.6} />
              </mesh>
              <mesh position={[0, 0, -0.02]}>
                <boxGeometry args={[1.8, 2, 0.04]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
              </mesh>
            </group>
          );
        })
      )}

      {/* Entrance */}
      <group position={[0, 0, d / 2 + 0.1]}>
        <mesh castShadow position={[0, 3.5, 0.3]}>
          <boxGeometry args={[4, 0.3, 1.5]} />
          <meshStandardMaterial color={def.accentColor} roughness={0.5} />
        </mesh>
        <mesh position={[-0.55, 1.6, 0]}>
          <boxGeometry args={[1, 3.2, 0.1]} />
          <meshStandardMaterial color="#2a1a0e" roughness={0.4} metalness={0.3} />
        </mesh>
        <mesh position={[0.55, 1.6, 0]}>
          <boxGeometry args={[1, 3.2, 0.1]} />
          <meshStandardMaterial color="#2a1a0e" roughness={0.4} metalness={0.3} />
        </mesh>
      </group>

      {/* Floating glowing sign */}
      <group ref={signRef} position={[0, h + 2.5, 0]}>
        <mesh>
          <boxGeometry args={[Math.max(w * 0.7, 6), 1.2, 0.15]} />
          <meshStandardMaterial
            color={def.signColor}
            emissive={def.signColor}
            emissiveIntensity={0.6}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[-Math.max(w * 0.35, 3), -1.5, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 3, 8]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[Math.max(w * 0.35, 3), -1.5, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 3, 8]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.5} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

// ─── 1. BUKA / MAMA PUT: Giant Pots, Crates & Striped Umbrella ──────────────
function BukaFeatures({ w, d }: { w: number; h: number; d: number }) {
  return (
    <group>
      {/* Steaming Aluminium Cooking Pots on Wood Counter */}
      <group position={[-w / 2 + 2, 0, d / 2 + 1.8]}>
        {/* Wooden serving bench */}
        <mesh castShadow receiveShadow position={[0, 0.8, 0]}>
          <boxGeometry args={[3, 0.8, 1.2]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        {/* Pot 1 (Jollof) */}
        <mesh castShadow position={[-0.8, 1.4, 0]}>
          <cylinderGeometry args={[0.45, 0.4, 0.5, 16]} />
          <meshStandardMaterial color="#d1d5db" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Pot 2 (Egusi / Goat Meat) */}
        <mesh castShadow position={[0.8, 1.4, 0]}>
          <cylinderGeometry args={[0.45, 0.4, 0.5, 16]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Yellow Plastic Crates Stack */}
      <group position={[w / 2 - 1.8, 0, d / 2 + 1.5]}>
        <mesh castShadow position={[0, 0.4, 0]}>
          <boxGeometry args={[1.2, 0.8, 0.8]} />
          <meshStandardMaterial color="#eab308" roughness={0.5} />
        </mesh>
        <mesh castShadow position={[0, 1.1, 0]}>
          <boxGeometry args={[1.2, 0.6, 0.8]} />
          <meshStandardMaterial color="#ca8a04" roughness={0.5} />
        </mesh>
      </group>

      {/* Big Sun Umbrella Canopy */}
      <group position={[-w / 2 + 2, 0, d / 2 + 3.2]}>
        <mesh position={[0, 1.8, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 3.6, 8]} />
          <meshStandardMaterial color="#374151" roughness={0.7} />
        </mesh>
        <mesh position={[0, 3.5, 0]}>
          <coneGeometry args={[2.2, 0.9, 16]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

// ─── 2. SUYA JOINT: Glowing Red Charcoal Barbecue Pit ───────────────────────
function SuyaFeatures({ w, d }: { w: number; h: number; d: number }) {
  return (
    <group>
      {/* Brick Grill Pit */}
      <group position={[w / 2 - 2.5, 0, d / 2 + 2]}>
        {/* Brick base */}
        <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
          <boxGeometry args={[2.5, 1.2, 1.4]} />
          <meshStandardMaterial color="#991b1b" roughness={0.9} />
        </mesh>
        {/* Glowing Charcoal Embers */}
        <mesh position={[0, 1.22, 0]}>
          <boxGeometry args={[2.2, 0.05, 1.1]} />
          <meshStandardMaterial color="#ef4444" emissive="#ff3300" emissiveIntensity={1.8} roughness={0.4} />
        </mesh>
        {/* Metal Grill Wire */}
        <mesh position={[0, 1.26, 0]}>
          <boxGeometry args={[2.3, 0.02, 1.2]} />
          <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Skewers on the grill */}
        {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
          <mesh key={i} castShadow position={[x, 1.32, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.07, 0.07, 0.8, 8]} />
            <meshStandardMaterial color="#78350f" roughness={0.7} />
          </mesh>
        ))}
        {/* Suya Stand Lantern */}
        <mesh position={[1.4, 2.2, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 2.5, 8]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
        <mesh position={[1.4, 3.4, 0]}>
          <sphereGeometry args={[0.25, 12, 12]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={1.5} />
        </mesh>
      </group>
    </group>
  );
}

// ─── 3. TECH HUB: Silicon Lagoon Neon Trims & Glass Atrium ───────────────────
function TechHubFeatures({ w, h, d }: { w: number; h: number; d: number }) {
  return (
    <group>
      {/* Neon Cyan Edge Trims */}
      <mesh position={[-w / 2 + 0.1, h * 0.5, d / 2 + 0.05]}>
        <boxGeometry args={[0.15, h * 0.9, 0.06]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[w / 2 - 0.1, h * 0.5, d / 2 + 0.05]}>
        <boxGeometry args={[0.15, h * 0.9, 0.06]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1.2} />
      </mesh>

      {/* Fiber Optics Glow Strip */}
      <mesh position={[0, h * 0.8 + 0.5, d / 2 + 0.02]}>
        <planeGeometry args={[w - 0.5, 0.2]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.0} />
      </mesh>

      {/* Silicon Lagoon Rooftop Satellite Antenna */}
      <group position={[0, h + 1.2, 0]}>
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 1.6, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        <mesh position={[0, 1.8, 0]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.9, 0.1, 0.2, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

// ─── 4. CMS DANFO TERMINAL: Yellow VW Bus & Keke Napep ──────────────────────
function DanfoFeatures({ w, d }: { w: number; h: number; d: number }) {
  return (
    <group>
      {/* Yellow Danfo Bus (Iconic Lagos VW Transporter) */}
      <group position={[w / 2 - 3, 0, d / 2 + 3.5]} rotation={[0, -0.2, 0]}>
        {/* Main yellow body */}
        <mesh castShadow position={[0, 1.1, 0]}>
          <boxGeometry args={[2.4, 1.4, 4.2]} />
          <meshStandardMaterial color="#eab308" roughness={0.4} />
        </mesh>
        {/* Twin Black Stripes (Signature Lagos Danfo!) */}
        <mesh position={[0, 1.15, 0]}>
          <boxGeometry args={[2.42, 0.18, 4.22]} />
          <meshStandardMaterial color="#111827" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[2.42, 0.18, 4.22]} />
          <meshStandardMaterial color="#111827" roughness={0.6} />
        </mesh>
        {/* Front windshield */}
        <mesh position={[0, 1.3, 2.12]}>
          <planeGeometry args={[1.8, 0.8]} />
          <meshStandardMaterial color="#0284c7" roughness={0.1} transparent opacity={0.7} />
        </mesh>
        {/* 4 Wheels */}
        {[-1.2, 1.2].map((x, xi) =>
          [-1.3, 1.3].map((z, zi) => (
            <mesh key={`${xi}-${zi}`} castShadow position={[x, 0.4, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
              <meshStandardMaterial color="#1f2937" roughness={0.9} />
            </mesh>
          ))
        )}
      </group>

      {/* Yellow Keke Napep Tricycle */}
      <group position={[-w / 2 + 2.5, 0, d / 2 + 2.5]}>
        {/* Body */}
        <mesh castShadow position={[0, 0.7, 0]}>
          <boxGeometry args={[1.4, 1.0, 2.0]} />
          <meshStandardMaterial color="#eab308" roughness={0.4} />
        </mesh>
        {/* Black canvas roof */}
        <mesh position={[0, 1.3, 0]}>
          <boxGeometry args={[1.45, 0.2, 2.05]} />
          <meshStandardMaterial color="#18181b" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

// ─── 5. OWAMBE PARTY CANOPY: Striped Tent, DJ Tower & Speakers ─────────────
function OwambeFeatures({ w, d }: { w: number; h: number; d: number }) {
  return (
    <group>
      {/* Green & White Striped Canopy Tent Overhang */}
      <group position={[0, 0, d / 2 + 3]}>
        <mesh castShadow position={[0, 3.8, 0]} rotation={[0.08, 0, 0]}>
          <boxGeometry args={[w - 1, 0.15, 6]} />
          <meshStandardMaterial color="#15803d" roughness={0.7} />
        </mesh>
        {/* 4 Canopy Poles */}
        {[-w / 2 + 1, w / 2 - 1].map((x, i) => (
          <mesh key={i} castShadow position={[x, 1.8, 2.8]}>
            <cylinderGeometry args={[0.06, 0.06, 3.6, 8]} />
            <meshStandardMaterial color="#e5e7eb" metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* Giant DJ Sound System Stack (Loudspeakers) */}
      <group position={[-w / 2 + 1.8, 0, d / 2 + 1.5]}>
        <mesh castShadow position={[0, 1.2, 0]}>
          <boxGeometry args={[1.2, 2.4, 1.0]} />
          <meshStandardMaterial color="#09090b" roughness={0.8} />
        </mesh>
        {/* Speaker Cones */}
        {[0.6, 1.4, 2.0].map((y, i) => (
          <mesh key={i} position={[0, y, 0.52]}>
            <circleGeometry args={[0.3, 16]} />
            <meshStandardMaterial color="#27272a" roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Gold Chiavari Party Chairs */}
      {[-2, 0, 2].map((x, i) => (
        <group key={i} position={[x, 0, d / 2 + 2.5]}>
          <mesh castShadow position={[0, 0.45, 0]}>
            <boxGeometry args={[0.6, 0.08, 0.6]} />
            <meshStandardMaterial color="#facc15" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh castShadow position={[0, 0.9, -0.28]}>
            <boxGeometry args={[0.6, 0.8, 0.06]} />
            <meshStandardMaterial color="#facc15" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
