import { useState } from 'react';
import { useSimLife } from '../SimLifeContext';
import { Utensils, BatteryCharging, Users, Sparkles, Smartphone, Briefcase, Backpack, Play, Pause, FastForward, ChevronUp, ChevronDown } from 'lucide-react';

interface SimsHUDProps {
  onOpenPhone: () => void;
  onOpenInventory: () => void;
  onOpenCareer: () => void;
}

export function SimsHUD({ onOpenPhone, onOpenInventory, onOpenCareer }: SimsHUDProps) {
  const {
    needs,
    naira,
    mood,
    plumbobColor,
    gameTime,
    timeSpeed,
    setTimeSpeed,
    activeToasts,
  } = useSimLife();

  const [needsExpanded, setNeedsExpanded] = useState(true);

  // Format time HH:MM
  const timeFormatted = `${gameTime.hour.toString().padStart(2, '0')}:${gameTime.minute.toString().padStart(2, '0')}`;
  const periodLabel =
    gameTime.period === 'morning' ? 'Lagos Morning 🌅' :
    gameTime.period === 'afternoon' ? 'Sunny Lagos ☀️' :
    gameTime.period === 'sunset' ? 'Golden Sunset 🌇' : 'Lagos Night Lights 🌙';

  return (
    <>
      {/* ─── Active Floating Toasts (Top Center) ───────────────────────────── */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
        {activeToasts.map((toast) => (
          <div
            key={toast.id}
            className="animate-in fade-in slide-in-from-top-4 duration-300 px-4 py-2 rounded-full shadow-2xl backdrop-blur-md border border-white/20 text-white font-medium text-sm flex items-center gap-2 bg-black/80"
          >
            <span className="text-lg">{toast.icon ?? '✨'}</span>
            <span>{toast.text}</span>
          </div>
        ))}
      </div>

      {/* ─── Sims 4 Bottom HUD Control Bar ───────────────────────────────── */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[96%] max-w-4xl select-none">
        <div className="bg-gradient-to-r from-slate-950/95 via-gray-900/95 to-slate-950/95 backdrop-blur-xl border border-white/15 rounded-3xl p-3 shadow-2xl text-white flex flex-col md:flex-row items-center justify-between gap-3">

          {/* Left: Sim Portrait & Plumbob Mood */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="relative">
              {/* Plumbob Diamond Icon over Avatar */}
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-6 animate-bounce"
                style={{
                  filter: `drop-shadow(0 0 8px ${plumbobColor})`,
                }}
              >
                <svg viewBox="0 0 24 36" className="w-full h-full">
                  <polygon
                    points="12,0 24,14 12,36 0,14"
                    fill={plumbobColor}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <polygon
                    points="12,0 24,14 12,36"
                    fill="#ffffff"
                    fillOpacity="0.3"
                  />
                </svg>
              </div>

              {/* Character Avatar Roundel */}
              <div
                className="w-14 h-14 rounded-full border-2 overflow-hidden bg-gradient-to-b from-amber-700 to-amber-950 flex items-center justify-center shadow-lg"
                style={{ borderColor: plumbobColor }}
              >
                <span className="text-2xl">🇳🇬</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-wide">You (Citizen)</span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${plumbobColor}25`,
                    color: plumbobColor,
                    border: `1px solid ${plumbobColor}50`,
                  }}
                >
                  {mood}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold mt-0.5">
                <span className="text-sm">₦</span>
                <span>{naira.toLocaleString()}</span>
              </div>
            </div>

            {/* Needs Toggle (Mobile) */}
            <button
              onClick={() => setNeedsExpanded(!needsExpanded)}
              className="md:hidden p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              {needsExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>
          </div>

          {/* Center: Live Needs Meters (Belle, Power, Cruise, Enjoyment) */}
          {needsExpanded && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full md:w-auto flex-1 max-w-md px-1">
              {/* Hunger (Belle Full) */}
              <NeedBar
                label="Belle"
                value={needs.hunger}
                icon={<Utensils size={13} className="text-orange-400" />}
                color="#f97316"
              />
              {/* Energy (Power / Rest) */}
              <NeedBar
                label="Power"
                value={needs.energy}
                icon={<BatteryCharging size={13} className="text-blue-400" />}
                color="#38bdf8"
              />
              {/* Social (Cruise / Gbeborun) */}
              <NeedBar
                label="Cruise"
                value={needs.social}
                icon={<Users size={13} className="text-emerald-400" />}
                color="#10b981"
              />
              {/* Fun (Enjoyment) */}
              <NeedBar
                label="Enjoy"
                value={needs.fun}
                icon={<Sparkles size={13} className="text-purple-400" />}
                color="#c084fc"
              />
            </div>
          )}

          {/* Right: Game Clock & Action Apps */}
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            {/* Clock & Speed controls */}
            <div className="bg-white/5 border border-white/10 rounded-2xl px-3 py-1.5 flex items-center gap-2">
              <div className="text-right">
                <div className="font-mono font-bold text-sm text-amber-300">{timeFormatted}</div>
                <div className="text-[10px] text-gray-400 leading-none">{periodLabel}</div>
              </div>
              <div className="flex items-center gap-0.5 ml-1 border-l border-white/10 pl-1.5">
                <button
                  onClick={() => setTimeSpeed(timeSpeed === 0 ? 1 : 0)}
                  className={`p-1 rounded ${timeSpeed === 0 ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'}`}
                  title="Pause"
                >
                  <Pause size={12} />
                </button>
                <button
                  onClick={() => setTimeSpeed(1)}
                  className={`p-1 rounded ${timeSpeed === 1 ? 'bg-emerald-500 text-black' : 'text-gray-400 hover:text-white'}`}
                  title="Normal Speed (1x)"
                >
                  <Play size={12} />
                </button>
                <button
                  onClick={() => setTimeSpeed(2)}
                  className={`p-1 rounded ${timeSpeed === 2 ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
                  title="Fast Forward (2x)"
                >
                  <FastForward size={12} />
                </button>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenPhone}
                className="p-2.5 rounded-2xl bg-emerald-600/30 hover:bg-emerald-500/50 border border-emerald-500/40 text-emerald-300 transition-transform active:scale-95 shadow-md flex items-center gap-1.5"
                title="Open Phone"
              >
                <Smartphone size={17} />
                <span className="hidden sm:inline text-xs font-semibold">Phone</span>
              </button>

              <button
                onClick={onOpenInventory}
                className="p-2.5 rounded-2xl bg-amber-600/30 hover:bg-amber-500/50 border border-amber-500/40 text-amber-300 transition-transform active:scale-95 shadow-md"
                title="My Items (Bag)"
              >
                <Backpack size={17} />
              </button>

              <button
                onClick={onOpenCareer}
                className="p-2.5 rounded-2xl bg-purple-600/30 hover:bg-purple-500/50 border border-purple-500/40 text-purple-300 transition-transform active:scale-95 shadow-md"
                title="Career & Hustle"
              >
                <Briefcase size={17} />
              </button>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}

function NeedBar({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  const percent = Math.round(value);
  const isCritical = value < 25;

  return (
    <div className="bg-black/40 border border-white/5 rounded-xl p-1.5 flex flex-col gap-1 min-w-[70px]">
      <div className="flex items-center justify-between text-[11px] px-0.5">
        <span className="flex items-center gap-1 text-gray-300 font-medium">
          {icon}
          {label}
        </span>
        <span className={`text-[10px] font-mono ${isCritical ? 'text-red-400 font-bold animate-pulse' : 'text-gray-400'}`}>
          {percent}%
        </span>
      </div>
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percent}%`,
            backgroundColor: isCritical ? '#ef4444' : color,
          }}
        />
      </div>
    </div>
  );
}
