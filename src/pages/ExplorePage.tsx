import { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import { ArrowLeft, Compass, AlertTriangle, DoorOpen, X, Flame, Trophy, Gamepad2, Scale, Armchair, Sparkles, Eye, Coffee, LogOut, Utensils, Users } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useSimLife } from '@/sim/SimLifeContext';
import { SimsHUD } from '@/sim/components/SimsHUD';
import { PhoneModal } from '@/sim/components/PhoneModal';
import { InventoryModal } from '@/sim/components/InventoryModal';
import { CareerModal } from '@/sim/components/CareerModal';
import { SocialInteractionModal } from '@/sim/components/SocialInteractionModal';
import { WorldCanvas, type DestinationMarkerHandle } from '@/world/WorldCanvas';
import { type PlayerHandle } from '@/world/Player';
import { BUILDINGS, INTERACTABLES, getBenchSitPoint, getBenchSitRotation, type BuildingDef, type InteractableDef, type InteractionDef } from '@/world/worldData';
import { type SimNPCProfile } from '@/sim/types';
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
  const {
    adjustNeeds,
    spendNaira,
    showSimToast,
    doHustleWork,
    npcs,
  } = useSimLife();

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

  // Sims UI Modals
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [careerOpen, setCareerOpen] = useState(false);
  const [socialNpc, setSocialNpc] = useState<SimNPCProfile | null>(null);
  const [citizensDirectoryOpen, setCitizensDirectoryOpen] = useState(false);

  // Camera drag state
  const dragRef = useRef<{ x: number; y: number; isDragging: boolean; wasDragging: boolean; pinchDist: number; startedOnUI: boolean }>({
    x: 0, y: 0, isDragging: false, wasDragging: false, pinchDist: 0, startedOnUI: false
  });

  // Sitting restores energy gently
  useEffect(() => {
    if (!isSitting) return;
    const sitInterval = setInterval(() => {
      adjustNeeds({ energy: 4 });
    }, 3000);
    return () => clearInterval(sitInterval);
  }, [isSitting, adjustNeeds]);

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

    // ── Handle Sims-specific authentic Nigerian simulation actions ────────
    if (action.action.startsWith('sim:')) {
      switch (action.action) {
        case 'sim:buy-jollof':
          if (spendNaira(2500, 'Party Jollof & Dodo')) {
            adjustNeeds({ hunger: 45, fun: 15 });
            showSimToast('Ate hot sweet party jollof with fried plantain!', '🍛', 'success');
          }
          break;
        case 'sim:buy-amala':
          if (spendNaira(3500, 'Hot Amala & Goat Meat')) {
            adjustNeeds({ hunger: 60, energy: 20 });
            showSimToast('Swallowed steaming amala & ewedu! Belle full 100%!', '🍲', 'success');
          }
          break;
        case 'sim:buy-maltina':
          if (spendNaira(800, 'Ice-Cold Maltina')) {
            adjustNeeds({ hunger: 15, energy: 20, fun: 10 });
            showSimToast('Gulped down ice-cold Maltina! Refreshed.', '🥤', 'success');
          }
          break;
        case 'sim:buy-suya':
          if (spendNaira(2000, 'Spicy Beef Suya')) {
            adjustNeeds({ hunger: 35, fun: 25 });
            showSimToast('Chowed down on hot spicy suya wrapped in newspaper!', '🥩', 'success');
          }
          break;
        case 'sim:buy-tozo':
          if (spendNaira(3500, 'Tozo Special Suya')) {
            adjustNeeds({ hunger: 50, energy: 15, fun: 30 });
            showSimToast('Juicy Tozo suya with extra onions! Unmatched enjoyment.', '🔥', 'success');
          }
          break;
        case 'sim:suya-rest':
          adjustNeeds({ energy: 20, fun: 15 });
          showSimToast('Warmed up by the glowing barbecue coals with fellow citizens.', '✨', 'info');
          break;
        case 'sim:work-tech':
          doHustleWork();
          break;
        case 'sim:buy-espresso':
          if (spendNaira(1200, 'Tech Hub Double Espresso')) {
            adjustNeeds({ energy: 40 });
            showSimToast('Downed double-shot espresso! Maximum coding power unlocked.', '⚡', 'success');
          }
          break;
        case 'sim:tech-social':
          adjustNeeds({ social: 25, fun: 20 });
          showSimToast('Exchanged startup ideas with other tech founders at Silicon Lagoon.', '💻', 'info');
          break;
        case 'sim:ride-danfo':
          if (spendNaira(500, 'Danfo Bus to Mainland')) {
            adjustNeeds({ fun: 15, social: 10 });
            showSimToast('Cruised down the expressway in the yellow Danfo bus! Lagos vibe on point.', '🚌', 'success');
          }
          break;
        case 'sim:ride-keke':
          if (spendNaira(1200, 'Private Keke Napep')) {
            adjustNeeds({ fun: 20 });
            showSimToast('Wind in your hair in a chartered Keke Napep!', '🛺', 'success');
          }
          break;
        case 'sim:conductor-gist':
          adjustNeeds({ social: 20, fun: 25 });
          showSimToast('Conductor: "CMS! Enter with your exact change o! No 1000 naira note!"', '📢', 'info');
          break;
        case 'sim:dance-party':
          adjustNeeds({ fun: 40, social: 25, energy: -15 });
          showSimToast('Dancing to Afrobeats on the Owambe dance floor! Maximum enjoyment!', '💃', 'success');
          break;
        case 'sim:spray-party':
          if (spendNaira(1000, 'Sprayed Cash at Owambe')) {
            adjustNeeds({ fun: 35, social: 35 });
            showSimToast('Sprayed ₦1,000 notes on the celebrants! "Odogwu silencer!"', '💸', 'success');
          }
          break;
        case 'sim:party-food':
          adjustNeeds({ hunger: 35, fun: 20 });
          showSimToast('Collected free wedding party jollof with souvenir plastic bowl!', '🍛', 'success');
          break;
      }
      return;
    }

    if (action.action.startsWith('navigate:')) {
      const dest = action.action.split(':')[1] as any;
      const label = (target.def as any).label;
      navigate(dest);
      showToast(`Entering ${label}...`, 'success');
    } else if (action.action === 'show:fountain') {
      showToast('The fountain sparkles in the sunlight.', 'info');
    } else if (action.action === 'bench:sit') {
      const bench = target.def as InteractableDef;
      const sitPoint = getBenchSitPoint(bench);
      const sitRot = getBenchSitRotation(bench);
      if (playerRef.current?.group) {
        playerRef.current.group.position.set(sitPoint.x, 0, sitPoint.z);
      }
      playerRef.current?.setSitting(true, sitRot);
      setIsSitting(true);
      setSitBenchId(bench.id);
      showSimToast('Resting on park bench... Energy recharging!', '⚡', 'info');
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

    if (interaction.action === 'bench:sit') {
      const bench = target.def as InteractableDef;
      const sitPoint = getBenchSitPoint(bench);
      playerRef.current?.setDestination(sitPoint);
      markerRef.current?.show(sitPoint);
      setPendingAction({ interaction, target });
      setMenuOpen(null);
      return;
    }

    if (interaction.action.startsWith('navigate:')) {
      const def = target.def as any;
      const targetPos = new THREE.Vector3(def.position[0], 0, def.position[2] + def.entranceOffset[1]);
      playerRef.current?.setDestination(targetPos);
      markerRef.current?.show(targetPos);
      setPendingAction({ interaction, target });
      setMenuOpen(null);
      return;
    }

    executeAction(interaction, target);
    setMenuOpen(null);
  };

  const standUp = () => {
    playerRef.current?.setSitting(false);
    setIsSitting(false);
    setSitBenchId(null);
  };

  // Mouse drag for camera
  const handleMouseDown = (e: React.MouseEvent) => {
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
    if (e.touches.length === 1) {
      dragRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, isDragging: true, wasDragging: false, pinchDist: 0, startedOnUI: false };
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      dragRef.current = { ...dragRef.current, pinchDist: Math.sqrt(dx * dx + dy * dy), isDragging: false };
    }
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragRef.current.startedOnUI) return;
    if (e.touches.length === 1 && dragRef.current.isDragging) {
      const dx = e.touches[0].clientX - dragRef.current.x;
      const dy = e.touches[0].clientY - dragRef.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragRef.current.wasDragging = true;
      cameraAngle.current -= dx * 0.008;
      cameraDistance.current = THREE.MathUtils.clamp(cameraDistance.current + dy * 0.04, 7, 35);
      dragRef.current.x = e.touches[0].clientX;
      dragRef.current.y = e.touches[0].clientY;
    } else if (e.touches.length === 2 && dragRef.current.pinchDist > 0) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const delta = dragRef.current.pinchDist - dist;
      cameraDistance.current = THREE.MathUtils.clamp(cameraDistance.current + delta * 0.05, 7, 35);
      dragRef.current.pinchDist = dist;
      dragRef.current.wasDragging = true;
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
    door: DoorOpen, flame: Flame, trophy: Trophy, gamepad: Gamepad2, scale: Scale, chair: Armchair, sparkles: Sparkles, eye: Eye, stand: LogOut, coffee: Coffee, utensils: Utensils,
  };

  const getMenuInteractions = (info: NearbyInfo): InteractionDef[] => {
    if (!info) return [];
    const def = info.def as any;
    let interactions = [...(def.interactions || [])];

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
          <p className="text-sm text-ink-300 mb-6">Your browser does not support WebGL, which is required to render the 3D world.</p>
          <button onClick={() => navigate('home')} className="btn-primary w-full">Return Home</button>
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
        <div className="absolute inset-0 bg-slate-950 flex items-center justify-center z-[85]">
          <div className="text-center">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-400 to-amber-500 flex items-center justify-center mx-auto mb-4 animate-pulse shadow-xl shadow-emerald-500/20 text-3xl">
              🇳🇬
            </div>
            <h2 className="text-xl font-extrabold mb-1 text-white">Naija Universe</h2>
            <p className="text-sm text-emerald-400 font-medium">Entering Lagos City Simulation...</p>
            <div className="mt-4 w-48 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-emerald-500 rounded-full animate-[barGrow_1.8s_ease-out_forwards]" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      )}

      {/* Top HUD: Exit & Citizens Directory */}
      <div className="absolute top-0 left-0 right-0 z-[82] p-4 flex items-center justify-between pointer-events-none" data-ui>
        <button
          onClick={() => navigate('home')}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/75 backdrop-blur-md border border-white/10 text-sm font-semibold text-white hover:bg-black/90 transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Exit
        </button>

        {/* Talk to Citizens Directory Trigger */}
        <button
          onClick={() => setCitizensDirectoryOpen(true)}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-600/80 hover:bg-emerald-500 backdrop-blur-md border border-emerald-400/40 text-sm font-bold text-white transition-all shadow-lg active:scale-95"
        >
          <Users className="w-4 h-4" /> Citizens Directory
        </button>
      </div>

      {/* Sitting state — Stand button */}
      {isSitting && !menuOpen && !loading && (
        <div className="absolute bottom-28 md:bottom-24 left-1/2 -translate-x-1/2 z-[83] animate-slideUp" data-ui>
          <button
            onClick={standUp}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 text-black font-extrabold shadow-xl shadow-amber-500/30 hover:bg-amber-400 active:scale-95 transition-all"
          >
            <LogOut className="w-5 h-5" /> Stand Up
          </button>
        </div>
      )}

      {/* Nearby interaction prompt */}
      {nearby && !menuOpen && !isSitting && !loading && (
        <div className="absolute bottom-28 md:bottom-24 left-1/2 -translate-x-1/2 z-[83] animate-slideUp" data-ui>
          <button
            onClick={() => setMenuOpen(nearby)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-amber-400/40 text-sm font-bold text-amber-300 hover:bg-slate-900 active:scale-95 transition-all shadow-xl"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            {nearbyDef?.label}
            <span className="text-gray-400 font-normal text-xs">• Tap to interact</span>
          </button>
        </div>
      )}

      {/* Contextual interaction menu */}
      {menuOpen && menuDef && !loading && (
        <div className="absolute bottom-24 left-0 right-0 z-[84] animate-slideUp" data-ui>
          <div className="bg-slate-950/95 backdrop-blur-xl border border-white/15 rounded-3xl p-5 pb-6 max-w-md mx-auto shadow-2xl text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-extrabold text-amber-200">{menuDef.label}</h3>
                <p className="text-xs text-emerald-400 font-medium">{menuOpen.type === 'building' ? 'Lagos Landmark' : 'Park Object'}</p>
              </div>
              <button
                onClick={() => setMenuOpen(null)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {getMenuInteractions(menuOpen).map((interaction: InteractionDef) => {
                const Icon = iconMap[interaction.icon] ?? DoorOpen;
                return (
                  <button
                    key={interaction.id}
                    onClick={() => handleInteractionClick(interaction, menuOpen)}
                    disabled={!interaction.available}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-left ${
                      interaction.available
                        ? 'bg-white/5 hover:bg-amber-500/15 border border-white/10 hover:border-amber-400/40 text-white active:scale-[0.98]'
                        : 'bg-white/[0.02] border border-white/5 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${interaction.available ? 'bg-amber-500/20 text-amber-300' : 'bg-white/5 text-gray-500'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{interaction.label}</p>
                      {!interaction.available && interaction.unavailableReason && (
                        <p className="text-xs text-gray-500 mt-0.5">{interaction.unavailableReason}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── SIMS 4 BOTTOM HUD ─────────────────────────────────────────────── */}
      {!loading && (
        <SimsHUD
          onOpenPhone={() => setPhoneOpen(true)}
          onOpenInventory={() => setInventoryOpen(true)}
          onOpenCareer={() => setCareerOpen(true)}
        />
      )}

      {/* ─── SIMS PHONE MODAL ──────────────────────────────────────────────── */}
      {phoneOpen && <PhoneModal onClose={() => setPhoneOpen(false)} />}

      {/* ─── SIMS INVENTORY MODAL ─────────────────────────────────────────── */}
      {inventoryOpen && <InventoryModal onClose={() => setInventoryOpen(false)} />}

      {/* ─── SIMS CAREER MODAL ────────────────────────────────────────────── */}
      {careerOpen && <CareerModal onClose={() => setCareerOpen(false)} />}

      {/* ─── SIMS SOCIAL INTERACTION MODAL (When chatting with an NPC) ────── */}
      {socialNpc && <SocialInteractionModal npc={socialNpc} onClose={() => setSocialNpc(null)} />}

      {/* ─── CITIZENS DIRECTORY MODAL ─────────────────────────────────────── */}
      {citizensDirectoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-gradient-to-b from-slate-900 via-gray-900 to-slate-950 border border-white/20 rounded-3xl p-6 max-w-md w-full shadow-2xl text-white relative">
            <button
              onClick={() => setCitizensDirectoryOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-white">Citizens of Lagos</h3>
                <p className="text-xs text-gray-400">Select any citizen to start a Sims conversation</p>
              </div>
            </div>

            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {Object.values(npcs).map((npc) => (
                <div
                  key={npc.id}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:border-amber-400/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-xl">
                      🇳🇬
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{npc.name}</div>
                      <div className="text-xs text-amber-300 font-medium">"{npc.nickname}"</div>
                      <div className="text-[11px] text-gray-400">{npc.role}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCitizensDirectoryOpen(false);
                      setSocialNpc(npc);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs active:scale-95 transition-transform"
                  >
                    Gist / Talk
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
