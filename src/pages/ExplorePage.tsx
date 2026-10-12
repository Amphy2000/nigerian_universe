import { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import { ArrowLeft, Compass, AlertTriangle, DoorOpen, X, Flame, Trophy, Gamepad2, Scale, Armchair, Sparkles, Eye, Coffee, LogOut } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { WorldCanvas, type DestinationMarkerHandle } from '@/world/WorldCanvas';
import { type PlayerHandle } from '@/world/Player';
import { BUILDINGS, INTERACTABLES, getBenchSitPoint, getBenchSitRotation, type BuildingDef, type InteractableDef, type InteractionDef } from '@/world/worldData';
import * as THREE from 'three';

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

type NearbyInfo = { type: 'building' | 'object'; def: BuildingDef | InteractableDef } | null;

export function ExplorePage() {
  const { navigate, showToast } = useApp();
  const keys = useRef<Record<string, boolean>>({});
  const cameraAngle = useRef(Math.PI);
  const cameraDistance = useRef(18);
  const playerRef = useRef<PlayerHandle | null>(null);
  const markerRef = useRef<DestinationMarkerHandle | null>(null);

  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [quality, setQuality] = useState<'high' | 'low'>('high');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [nearby, setNearby] = useState<NearbyInfo>(null);
  const [menuOpen, setMenuOpen] = useState<NearbyInfo>(null);
  const [pendingAction, setPendingAction] = useState<{ interaction: InteractionDef; target: NearbyInfo } | null>(null);
  const [isSitting, setIsSitting] = useState(false);
  const [sitBenchId, setSitBenchId] = useState<string | null>(null);

  // Camera drag state — track if gesture started on UI
  const dragRef = useRef<{ x: number; y: number; isDragging: boolean; wasDragging: boolean; pinchDist: number; startedOnUI: boolean }>({ x: 0, y: 0, isDragging: false, wasDragging: false, pinchDist: 0, startedOnUI: false });

  useEffect(() => {
    const hasWebGL = detectWebGL();
    setWebglAvailable(hasWebGL);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(prefersReduced);

    const isLowEnd = (navigator as any).deviceMemory && (navigator as any).deviceMemory <= 4;
    if (isLowEnd) {
      setQuality('low');
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'shift'].includes(key)) {
        if (playerRef.current?.isSitting()) return;
        keys.current[key] = true;
        if (key !== 'shift') e.preventDefault();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const timer = setTimeout(() => setLoading(false), 2000);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearTimeout(timer);
    };
  }, []);

  const handleNearInteractable = useCallback((info: NearbyInfo) => {
    setNearby(info);
  }, []);

  const handleArriveAtDestination = useCallback(() => {
    if (pendingAction) {
      executeAction(pendingAction.interaction, pendingAction.target);
      setPendingAction(null);
    }
  }, [pendingAction]);

  const handleGroundClick = useCallback((point: THREE.Vector3) => {
    if (dragRef.current.wasDragging) {
      dragRef.current.wasDragging = false;
      return;
    }
    if (menuOpen) {
      setMenuOpen(null);
      return;
    }
    // If sitting, standing up is handled by the Stand button
    if (playerRef.current?.isSitting()) return;
    playerRef.current?.setDestination(point);
    markerRef.current?.show(point);
  }, [menuOpen]);

  const handleObjectClick = useCallback((info: { type: 'building' | 'object'; def: BuildingDef | InteractableDef }) => {
    if (dragRef.current.wasDragging) {
      dragRef.current.wasDragging = false;
      return;
    }
    if (playerRef.current?.isSitting()) return;
    setMenuOpen(info);
  }, []);

  const executeAction = (action: InteractionDef, target: NearbyInfo) => {
    if (!target) return;
    if (!action.available) {
      showToast(action.unavailableReason ?? 'This feature is not available yet.', 'info');
      return;
    }

    if (action.action.startsWith('navigate:')) {
      const dest = action.action.split(':')[1] as any;
      const label = (target.def as any).label;
      navigate(dest);
      showToast(`Entering ${label}...`, 'success');
    } else if (action.action === 'show:fountain') {
      showToast('The fountain sparkles in the sunlight.', 'info');
    } else if (action.action === 'show:cafe-info') {
      showToast('Universe Cafe will be a place to socialize. Coming soon!', 'info');
    } else if (action.action === 'bench:sit') {
      // Actually sit on the bench
      const bench = target.def as InteractableDef;
      const sitPoint = getBenchSitPoint(bench);
      const sitRot = getBenchSitRotation(bench);
      // Move player to sit position
      if (playerRef.current?.group) {
        playerRef.current.group.position.set(sitPoint.x, 0, sitPoint.z);
      }
      playerRef.current?.setSitting(true, sitRot);
      setIsSitting(true);
      setSitBenchId(bench.id);
    } else if (action.action === 'bench:stand') {
      playerRef.current?.setSitting(false);
      setIsSitting(false);
      setSitBenchId(null);
    }
  };

  const handleInteractionClick = (interaction: InteractionDef, target: NearbyInfo) => {
    if (!target) return;
    if (!interaction.available) {
      showToast(interaction.unavailableReason ?? 'Not available yet.', 'info');
      return;
    }

    // Bench sit: walk to bench first, then sit
    if (interaction.action === 'bench:sit') {
      const bench = target.def as InteractableDef;
      const sitPoint = getBenchSitPoint(bench);
      playerRef.current?.setDestination(sitPoint);
      markerRef.current?.show(sitPoint);
      setPendingAction({ interaction, target });
      setMenuOpen(null);
      return;
    }

    // Building navigation: walk to entrance first
    if (interaction.action.startsWith('navigate:')) {
      const def = target.def as any;
      const targetPos = new THREE.Vector3(def.position[0], 0, def.position[2] + def.entranceOffset[1]);
      playerRef.current?.setDestination(targetPos);
      markerRef.current?.show(targetPos);
      setPendingAction({ interaction, target });
      setMenuOpen(null);
      return;
    }

    // Immediate actions (fountain, cafe info)
    executeAction(interaction, target);
    setMenuOpen(null);
  };

  const standUp = () => {
    playerRef.current?.setSitting(false);
    setIsSitting(false);
    setSitBenchId(null);
  };

  // Mouse drag for camera (desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't start drag on UI elements
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[data-ui]')) {
      dragRef.current.startedOnUI = true;
      return;
    }
    dragRef.current = { x: e.clientX, y: e.clientY, isDragging: true, wasDragging: false, pinchDist: 0, startedOnUI: false };
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current.isDragging || dragRef.current.startedOnUI) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragRef.current.wasDragging = true;
    cameraAngle.current -= dx * 0.008;
    cameraDistance.current = THREE.MathUtils.clamp(cameraDistance.current + dy * 0.04, 7, 35);
    dragRef.current.x = e.clientX;
    dragRef.current.y = e.clientY;
  };
  const handleMouseUp = () => {
    dragRef.current.isDragging = false;
    dragRef.current.startedOnUI = false;
  };
  const handleWheel = (e: React.WheelEvent) => {
    cameraDistance.current = THREE.MathUtils.clamp(cameraDistance.current + e.deltaY * 0.025, 7, 35);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[data-ui]')) {
      dragRef.current.startedOnUI = true;
      return;
    }
    dragRef.current.startedOnUI = false;
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      dragRef.current.pinchDist = Math.sqrt(dx * dx + dy * dy);
      dragRef.current.isDragging = false;
    } else if (e.touches.length === 1) {
      dragRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, isDragging: true, wasDragging: false, pinchDist: 0, startedOnUI: false };
    }
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragRef.current.startedOnUI) return;
    if (e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const delta = dist - dragRef.current.pinchDist;
      cameraDistance.current = THREE.MathUtils.clamp(cameraDistance.current - delta * 0.08, 7, 35);
      dragRef.current.pinchDist = dist;
      dragRef.current.wasDragging = true;
    } else if (e.touches.length === 1 && dragRef.current.isDragging) {
      const dx = e.touches[0].clientX - dragRef.current.x;
      const dy = e.touches[0].clientY - dragRef.current.y;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) dragRef.current.wasDragging = true;
      cameraAngle.current -= dx * 0.008;
      cameraDistance.current = THREE.MathUtils.clamp(cameraDistance.current + dy * 0.04, 7, 35);
      dragRef.current.x = e.touches[0].clientX;
      dragRef.current.y = e.touches[0].clientY;
    }
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      dragRef.current.isDragging = false;
      dragRef.current.startedOnUI = false;
    }
  };

  const nearbyDef = nearby ? (nearby.def as any) : null;
  const menuDef = menuOpen ? (menuOpen.def as any) : null;

  const iconMap: Record<string, typeof DoorOpen> = {
    door: DoorOpen, flame: Flame, trophy: Trophy, gamepad: Gamepad2, scale: Scale, chair: Armchair, sparkles: Sparkles, eye: Eye, stand: LogOut, coffee: Coffee,
  };

  // Get interactions for menu, filtering based on sit state
  const getMenuInteractions = (info: NearbyInfo): InteractionDef[] => {
    if (!info) return [];
    const def = info.def as any;
    let interactions = [...(def.interactions || [])];

    // If this is the bench we're sitting on, show Stand instead of Sit
    if (info.type === 'object' && def.id === sitBenchId) {
      interactions = interactions.map((i) =>
        i.action === 'bench:sit'
          ? { ...i, id: 'stand', label: 'Stand Up', icon: 'stand', action: 'bench:stand', available: true, unavailableReason: undefined }
          : i
      );
    }
    return interactions;
  };

  if (webglAvailable === false) {
    return (
      <div className="fixed inset-0 z-[90] bg-ink-950 flex items-center justify-center p-6">
        <div className="max-w-sm text-center">
          <div className="w-16 h-16 rounded-3xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-gold-400" />
          </div>
          <h2 className="font-display text-xl font-bold mb-2">3D Not Available</h2>
          <p className="text-sm text-ink-300 mb-6">
            Your device does not support WebGL, which is needed to render the 3D world. You can still enjoy the rest of Nigerian Universe.
          </p>
          <div className="space-y-2">
            <button onClick={() => navigate('court')} className="btn-primary w-full">Go to Nigerian Court</button>
            <button onClick={() => navigate('home')} className="btn-ghost w-full">Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[80] bg-sky-200 overflow-hidden select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'none' }}
    >
      {/* 3D Canvas */}
      {webglAvailable && (
        <Suspense fallback={null}>
          <WorldCanvas
            keys={keys}
            onNearInteractable={handleNearInteractable}
            onArriveAtDestination={handleArriveAtDestination}
            onGroundClick={handleGroundClick}
            onObjectClick={handleObjectClick}
            reducedMotion={reducedMotion}
            quality={quality}
            playerAppearance="female-a"
            cameraAngle={cameraAngle}
            cameraDistance={cameraDistance}
            playerRef={playerRef}
            markerRef={markerRef}
          />
        </Suspense>
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-ink-950 flex items-center justify-center z-[85]">
          <div className="text-center">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Compass className="w-8 h-8 text-ink-950" strokeWidth={2.5} />
            </div>
            <h2 className="font-display text-lg font-bold mb-1 text-ink-100">Loading the Universe...</h2>
            <p className="text-sm text-ink-400">Building the world around you</p>
            <div className="mt-4 w-48 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-gold-500 rounded-full animate-[barGrow_1.8s_ease-out_forwards]" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      )}

      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 z-[82] p-4 flex items-center justify-between pointer-events-none" data-ui>
        <button
          onClick={() => navigate('home')}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-2xl bg-ink-900/80 backdrop-blur-md border border-white/10 text-sm font-semibold text-ink-100 hover:bg-ink-800/80 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Exit
        </button>
        <div className="pointer-events-auto flex items-center gap-2" />
      </div>

      {/* Sitting state — Stand button */}
      {isSitting && !menuOpen && !loading && (
        <div className="absolute bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[83] animate-slideUp" data-ui>
          <button
            onClick={standUp}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gold-500 text-ink-950 font-bold shadow-lg shadow-gold-500/30 hover:bg-gold-400 active:scale-95 transition-all"
          >
            <LogOut className="w-5 h-5" /> Stand Up
          </button>
        </div>
      )}

      {/* Nearby interaction prompt */}
      {nearby && !menuOpen && !isSitting && !loading && (
        <div className="absolute bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[83] animate-slideUp" data-ui>
          <button
            onClick={() => setMenuOpen(nearby)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-ink-900/85 backdrop-blur-md border border-gold-500/30 text-sm font-bold text-gold-300 hover:bg-ink-800/85 active:scale-95 transition-all shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            {nearbyDef?.label}
            <span className="text-ink-400 font-normal text-xs">Tap to interact</span>
          </button>
        </div>
      )}

      {/* Contextual interaction menu */}
      {menuOpen && menuDef && !loading && (
        <div className="absolute bottom-0 left-0 right-0 z-[84] animate-slideUp" data-ui>
          <div className="bg-ink-900/95 backdrop-blur-xl border-t border-white/10 rounded-t-3xl p-5 pb-8 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-ink-100">{menuDef.label}</h3>
                <p className="text-xs text-ink-400">{menuOpen.type === 'building' ? 'Building' : 'Object'}</p>
              </div>
              <button onClick={() => setMenuOpen(null)} className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-ink-300 hover:text-white hover:bg-white/10 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {getMenuInteractions(menuOpen).map((interaction: InteractionDef) => {
                const Icon = iconMap[interaction.icon] ?? DoorOpen;
                return (
                  <button
                    key={interaction.id}
                    onClick={() => handleInteractionClick(interaction, menuOpen)}
                    disabled={!interaction.available}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-left ${
                      interaction.available
                        ? 'bg-white/5 hover:bg-gold-500/10 border border-white/10 hover:border-gold-500/20 text-ink-100'
                        : 'bg-white/[0.02] border border-white/5 text-ink-500 cursor-not-allowed'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${interaction.available ? 'bg-gold-500/15 text-gold-300' : 'bg-white/5 text-ink-500'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{interaction.label}</p>
                      {!interaction.available && interaction.unavailableReason && (
                        <p className="text-xs text-ink-500 mt-0.5">{interaction.unavailableReason}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Desktop controls hint */}
      <div className="hidden md:block absolute bottom-4 right-4 z-[82] pointer-events-none" data-ui>
        <div className="px-4 py-3 rounded-2xl bg-ink-900/70 backdrop-blur-md border border-white/10 text-xs text-ink-200">
          <p className="font-bold text-ink-100 mb-1">Controls</p>
          <p>Click ground to walk</p>
          <p className="text-ink-300 mt-0.5">Click buildings to interact</p>
          <p className="text-ink-300 mt-0.5">Drag to rotate camera</p>
          <p className="text-ink-300 mt-0.5">Scroll to zoom</p>
          <p className="text-ink-400 mt-0.5">WASD to move, Shift to run</p>
        </div>
      </div>

      {/* Mobile hint */}
      <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-[82] pointer-events-none" data-ui>
        <div className="px-3 py-2 rounded-xl bg-ink-900/70 backdrop-blur-md border border-white/10 text-[10px] text-ink-200">
          Tap ground to walk. Tap objects to interact. Drag to rotate. Pinch to zoom.
        </div>
      </div>
    </div>
  );
}
