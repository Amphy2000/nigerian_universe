import { useState } from 'react';
import { useSimLife } from '@/sim/SimLifeContext';
import { X, Sparkles, DollarSign, Flame, Music, Volume2, Users, PartyPopper } from 'lucide-react';

interface ClubInteriorModalProps {
  onClose: () => void;
  onTriggerDance?: () => void;
}

export function ClubInteriorModal({ onClose, onTriggerDance }: ClubInteriorModalProps) {
  const { adjustNeeds, spendNaira, showSimToast, naira } = useSimLife();

  const [activeTab, setActiveTab] = useState<'spray' | 'dance' | 'bar'>('spray');
  const [sprayParticles, setSprayParticles] = useState<{ id: number; left: number; note: string }[]>([]);
  const [hypeDialogue, setHypeDialogue] = useState<string>(
    "Welcome to Cubana Lagos VIP! The bass is heavy, the champagne is cold, and the dancefloor is on fire! Show us your level!"
  );
  const [currentTrack, setCurrentTrack] = useState<string>("Asake - Lonely At The Top (Remix)");

  const handleSprayNaira = (amount: number, noteLabel: string) => {
    if (!spendNaira(amount, `Sprayed Cash at Cubana Lounge`)) return;

    adjustNeeds({ fun: 35, social: 35, energy: -5 });
    showSimToast(`Sprayed ₦${amount.toLocaleString()} on the dancefloor! Owo wole! 💸`, '💸', 'success');

    // Spawn floating banknotes animation
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      left: 10 + Math.random() * 80,
      note: noteLabel,
    }));
    setSprayParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setSprayParticles((prev) => prev.filter((p) => !newParticles.includes(p)));
    }, 2000);

    const cheers = [
      "E choke o! Odogwu silencer! Spray that cash!",
      "Baller of the Year! Who said money cannot buy happiness in Lagos?!",
      "Eze ego! The highest spender in the VIP section tonight!",
      "Money na water! Clear road for the chairman!",
    ];
    setHypeDialogue(cheers[Math.floor(Math.random() * cheers.length)]);
  };

  const handleDance = (moveName: string, icon: string) => {
    adjustNeeds({ fun: 40, social: 20, energy: -15 });
    showSimToast(`Hitting the ${moveName} on the dance floor! Maximum groove!`, icon, 'success');
    setHypeDialogue(`Gbe body e! Look at those sharp legwork moves! The whole club is watching you!`);
    if (onTriggerDance) onTriggerDance();
  };

  const handleBuyDrink = (drinkName: string, cost: number, icon: string) => {
    if (!spendNaira(cost, `Ordered ${drinkName} at VIP Bar`)) return;
    adjustNeeds({ fun: 25, energy: 20, hunger: 10 });
    showSimToast(`Sipped cold ${drinkName}! Feeling top of the world.`, icon, 'success');
    setHypeDialogue(`VIP treatment only! Raise your glass to good life and prosperity in Nigeria!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-purple-950/90 via-slate-950 to-black border border-purple-500/40 rounded-[36px] max-w-2xl w-full p-5 sm:p-7 shadow-2xl text-white relative flex flex-col max-h-[92vh] overflow-hidden">

        {/* Floating Spraying Banknotes Animation */}
        {sprayParticles.map((p) => (
          <div
            key={p.id}
            style={{ left: `${p.left}%` }}
            className="absolute bottom-10 z-30 pointer-events-none animate-floatUp font-black text-emerald-400 bg-emerald-950/90 border border-emerald-400/60 px-3 py-1 rounded-xl shadow-lg shadow-emerald-500/50 text-xs sm:text-sm"
          >
            ₦ {p.note}
          </div>
        ))}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5 shrink-0">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-3xl shadow-lg shadow-purple-500/20">
            🪩
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black tracking-tight text-purple-200">Cubana Lounge & Owambe VIP</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-pink-500/20 text-pink-400 border border-pink-500/30 animate-pulse">
                VIP NIGHTLIFE
              </span>
            </div>
            <p className="text-xs text-purple-300 font-medium">Lagos Premier Nightclub • Heavy Afrobeats & Cash Spraying</p>
          </div>
        </div>

        {/* Hype Man Banner */}
        <div className="mb-5 p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-start gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full bg-pink-600/30 border border-pink-400/40 flex items-center justify-center text-xl shrink-0">
            🎤
          </div>
          <div className="flex-1 text-xs sm:text-sm">
            <span className="font-extrabold text-pink-300 block mb-0.5">MC Hype Man:</span>
            <p className="text-gray-200 italic leading-relaxed">"{hypeDialogue}"</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-5 shrink-0">
          <button
            onClick={() => setActiveTab('spray')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'spray' ? 'bg-purple-500 text-white shadow-md' : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <DollarSign size={14} /> Spray Naira (Baller)
          </button>
          <button
            onClick={() => setActiveTab('dance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'dance' ? 'bg-purple-500 text-white shadow-md' : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Flame size={14} /> Dance Floor Legwork
          </button>
          <button
            onClick={() => setActiveTab('bar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'bar' ? 'bg-purple-500 text-white shadow-md' : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Sparkles size={14} /> VIP Bar Drinks
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">

          {/* ─── TAB 1: SPRAY NAIRA (THE ULTIMATE NAIJA FLEX) ────────────── */}
          {activeTab === 'spray' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-purple-950/60 border border-emerald-500/30">
                <h4 className="font-black text-sm text-emerald-300 mb-1 flex items-center gap-2">
                  <PartyPopper size={16} /> Cash Spraying Machine
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  The quintessential Nigerian party experience! Shower the dancers, musicians, and celebrants with crisp bank notes. Boosts your social clout and status instantly!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1,000 spray */}
                <button
                  onClick={() => handleSprayNaira(1000, '1,000')}
                  className="p-4 rounded-2xl bg-stone-900 border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-950/40 text-left transition-all active:scale-95 group shadow-lg"
                >
                  <span className="text-2xl mb-2 block">💵</span>
                  <h5 className="font-extrabold text-sm text-emerald-300 group-hover:text-emerald-200">
                    Spray ₦1,000 Note
                  </h5>
                  <p className="text-xs text-gray-400 mt-1">Crisp polymer note flutter</p>
                  <span className="text-[11px] font-bold text-emerald-400 mt-2 block">+35 Social</span>
                </button>

                {/* 5,000 bundle spray */}
                <button
                  onClick={() => handleSprayNaira(5000, '5,000 BUNDLE')}
                  className="p-4 rounded-2xl bg-stone-900 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-950/40 text-left transition-all active:scale-95 group shadow-lg"
                >
                  <span className="text-2xl mb-2 block">💸</span>
                  <h5 className="font-extrabold text-sm text-amber-300 group-hover:text-amber-200">
                    Spray ₦5,000 Bundle
                  </h5>
                  <p className="text-xs text-gray-400 mt-1">Mint bundle shower</p>
                  <span className="text-[11px] font-bold text-amber-400 mt-2 block">+60 Social & Clout</span>
                </button>

                {/* 20,000 Odogwu Cannon */}
                <button
                  onClick={() => handleSprayNaira(20000, '20,000 CANNON!')}
                  className="p-4 rounded-2xl bg-stone-900 border border-pink-500/40 hover:border-pink-400 hover:bg-pink-950/40 text-left transition-all active:scale-95 group shadow-lg"
                >
                  <span className="text-2xl mb-2 block">👑</span>
                  <h5 className="font-extrabold text-sm text-pink-300 group-hover:text-pink-200">
                    Odogwu Cash Cannon (₦20k)
                  </h5>
                  <p className="text-xs text-gray-400 mt-1">Full club currency rain</p>
                  <span className="text-[11px] font-bold text-pink-400 mt-2 block">+100 VIP Fame</span>
                </button>
              </div>
            </div>
          )}

          {/* ─── TAB 2: DANCE FLOOR LEGWORK ────────────────────────────── */}
          {activeTab === 'dance' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-xl">
                    🎧
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-white">DJ Spinall On The Deck</h5>
                    <p className="text-xs text-gray-400">{currentTrack}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const tracks = [
                      "Burna Boy - City Boys (Lagos Edit)",
                      "Rema - Calm Down (Amapiano Fusion)",
                      "Asake - Basquiat (Live Owambe)",
                      "Wizkid - Essence (Club Remix)",
                    ];
                    const next = tracks[(tracks.indexOf(currentTrack) + 1) % tracks.length];
                    setCurrentTrack(next);
                    showSimToast(`DJ switched track to ${next}!`, '🎵', 'info');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-bold text-xs"
                >
                  Change Track
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleDance('Poco Lee Zanku & Legwork', '⚡')}
                  className="p-4 rounded-2xl bg-stone-900 border border-white/10 hover:border-purple-400 hover:bg-purple-500/10 text-left transition-all active:scale-95"
                >
                  <span className="text-2xl mb-1 block">⚡</span>
                  <h5 className="font-extrabold text-sm text-purple-200">Poco Lee Zanku</h5>
                  <p className="text-xs text-gray-400 mt-0.5">High-energy Lagos street legwork</p>
                </button>

                <button
                  onClick={() => handleDance('Gbese Kick', '🕺')}
                  className="p-4 rounded-2xl bg-stone-900 border border-white/10 hover:border-purple-400 hover:bg-purple-500/10 text-left transition-all active:scale-95"
                >
                  <span className="text-2xl mb-1 block">🕺</span>
                  <h5 className="font-extrabold text-sm text-purple-200">Gbese Step</h5>
                  <p className="text-xs text-gray-400 mt-0.5">Lift leg & drop the bass</p>
                </button>

                <button
                  onClick={() => handleDance('Azonto Wave', '🌊')}
                  className="p-4 rounded-2xl bg-stone-900 border border-white/10 hover:border-purple-400 hover:bg-purple-500/10 text-left transition-all active:scale-95"
                >
                  <span className="text-2xl mb-1 block">🌊</span>
                  <h5 className="font-extrabold text-sm text-purple-200">Azonto Hands</h5>
                  <p className="text-xs text-gray-400 mt-0.5">Smooth rhythmic upper-body flow</p>
                </button>

                <button
                  onClick={() => handleDance('Afrobeats Slow Whine', '✨')}
                  className="p-4 rounded-2xl bg-stone-900 border border-white/10 hover:border-purple-400 hover:bg-purple-500/10 text-left transition-all active:scale-95"
                >
                  <span className="text-2xl mb-1 block">✨</span>
                  <h5 className="font-extrabold text-sm text-purple-200">Afrobeats Slow Whine</h5>
                  <p className="text-xs text-gray-400 mt-0.5">Vibe smoothly with the crowd</p>
                </button>
              </div>
            </div>
          )}

          {/* ─── TAB 3: VIP BAR DRINKS ─────────────────────────────────── */}
          {activeTab === 'bar' && (
            <div className="space-y-3">
              {/* Chapman */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-red-950 flex items-center justify-center text-2xl border border-red-800">
                    🍹
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-white">Classic Lagos Chapman</h5>
                    <p className="text-xs text-gray-400">Fanta, Sprite, Angostura bitters & sliced cucumber</p>
                    <span className="text-xs font-black text-amber-400 mt-0.5 block">₦1,500</span>
                  </div>
                </div>
                <button
                  onClick={() => handleBuyDrink('Classic Chapman', 1500, '🍹')}
                  className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-black text-xs transition-all active:scale-95"
                >
                  Order
                </button>
              </div>

              {/* Star Radler */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-950 flex items-center justify-center text-2xl border border-amber-800">
                    🍺
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-white">Ice-Cold Star Radler (Citrus)</h5>
                    <p className="text-xs text-gray-400">Refreshing Nigerian beer with citrus burst</p>
                    <span className="text-xs font-black text-amber-400 mt-0.5 block">₦1,200</span>
                  </div>
                </div>
                <button
                  onClick={() => handleBuyDrink('Star Radler', 1200, '🍺')}
                  className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-black text-xs transition-all active:scale-95"
                >
                  Order
                </button>
              </div>

              {/* Hennessy VIP */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-900/60 flex items-center justify-center text-2xl border border-amber-700">
                    🥃
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-white">Hennessy VIP Gold Shot</h5>
                    <p className="text-xs text-gray-400">High-roller cognac shot on the rocks</p>
                    <span className="text-xs font-black text-amber-400 mt-0.5 block">₦4,500</span>
                  </div>
                </div>
                <button
                  onClick={() => handleBuyDrink('Hennessy VIP Shot', 4500, '🥃')}
                  className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-black text-xs transition-all active:scale-95"
                >
                  Order
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-3 shrink-0">
          <div className="text-xs text-gray-400">
            Current Cash: <span className="text-emerald-400 font-extrabold">₦{naira.toLocaleString()}</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-xs text-white transition-colors"
          >
            Leave VIP Lounge
          </button>
        </div>

      </div>
    </div>
  );
}
