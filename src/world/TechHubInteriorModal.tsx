import { useState } from 'react';
import { useSimLife } from '@/sim/SimLifeContext';
import { X, Code, Sparkles, DollarSign, Coffee, Laptop, Wifi, CheckCircle2, Award, Briefcase } from 'lucide-react';

interface TechHubInteriorModalProps {
  onClose: () => void;
}

export function TechHubInteriorModal({ onClose }: TechHubInteriorModalProps) {
  const { adjustNeeds, spendNaira, earnNaira, showSimToast, naira } = useSimLife();

  const [activeTab, setActiveTab] = useState<'work' | 'pitch' | 'coffee'>('work');
  const [workingShift, setWorkingShift] = useState<string | null>(null);
  const [pitchResult, setPitchResult] = useState<string | null>(null);

  const handleWorkGig = (gigName: string, reward: number, energyCost: number) => {
    setWorkingShift(gigName);
    setTimeout(() => {
      earnNaira(reward, `Completed: ${gigName}`);
      adjustNeeds({ energy: -energyCost, fun: 10, social: 15 });
      showSimToast(`Shipped code! Earned ₦${reward.toLocaleString()}!`, '💻', 'success');
      setWorkingShift(null);
    }, 1200);
  };

  const handlePitchStartup = (idea: 'okada' | 'solar' | 'jollof') => {
    if (idea === 'okada') {
      earnNaira(60000, 'Seed Grant: PayOkada QR Payments');
      adjustNeeds({ fun: 35, social: 30, energy: -15 });
      setPitchResult(
        "🎉 The Angel Investors LOVED PayOkada! 'Fintech for informal transit is huge in Lagos!' You were awarded a ₦60,000 seed grant!"
      );
      showSimToast('Seed Grant Secured: ₦60,000!', '🚀', 'success');
    } else if (idea === 'solar') {
      earnNaira(75000, 'Green Energy Grant: SolarBox Mini-Generators');
      adjustNeeds({ fun: 40, social: 35, energy: -15 });
      setPitchResult(
        "☀️ Massive applause from the investors! 'Eliminating noise pollution from I-pass-my-neighbor generators is the future!' Received ₦75,000 grant!"
      );
      showSimToast('Green Energy Grant Secured: ₦75,000!', '⚡', 'success');
    } else if (idea === 'jollof') {
      earnNaira(50000, 'FoodTech Grant: JollofAI Kitchens');
      adjustNeeds({ fun: 30, social: 25, energy: -10 });
      setPitchResult(
        "🍲 The investors were eating the pitch deck! 'Smart cloud kitchens delivering steaming amala and jollof in 12 mins!' Seed check of ₦50,000 awarded!"
      );
      showSimToast('FoodTech Grant Secured: ₦50,000!', '🍲', 'success');
    }
  };

  const handleCoffee = (type: 'espresso' | 'redbull') => {
    if (type === 'espresso') {
      if (!spendNaira(1200, 'Double-Shot Espresso')) return;
      adjustNeeds({ energy: 45, fun: 10 });
      showSimToast('Downed bitter piping-hot double espresso! Brain operating at 200% speed.', '☕', 'success');
    } else {
      if (!spendNaira(1500, 'Chilled Red Bull')) return;
      adjustNeeds({ energy: 50, fun: 15 });
      showSimToast('Cracked open an ice-cold energy drink! Pure focus.', '⚡', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-slate-900 via-gray-900 to-black border border-cyan-500/40 rounded-[36px] max-w-2xl w-full p-5 sm:p-7 shadow-2xl text-white relative flex flex-col max-h-[92vh] overflow-hidden">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5 shrink-0">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/20">
            💻
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black tracking-tight text-cyan-200">Silicon Lagoon Tech Hub</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                <Wifi size={10} /> STARLINK 500 MBPS
              </span>
            </div>
            <p className="text-xs text-cyan-300 font-medium">Yaba & Lekki Tech Ecosystem • Coding Shifts & Startup Incubator</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-5 shrink-0">
          <button
            onClick={() => setActiveTab('work')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'work' ? 'bg-cyan-500 text-black shadow-md' : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Briefcase size={14} /> Dev Workstation
          </button>
          <button
            onClick={() => setActiveTab('pitch')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'pitch' ? 'bg-cyan-500 text-black shadow-md' : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Award size={14} /> Pitch Angel Investors
          </button>
          <button
            onClick={() => setActiveTab('coffee')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'coffee' ? 'bg-cyan-500 text-black shadow-md' : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Coffee size={14} /> Barista Fuel
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">

          {/* ─── TAB 1: DEV WORKSTATION CONTRACTS ──────────────────────── */}
          {activeTab === 'work' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-300">
                Sit down at an ergonomic workstation with dual 4K monitors and complete real dev gigs to earn Naira:
              </p>

              {/* Gig 1 */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/40 transition-all flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-cyan-950 flex items-center justify-center text-2xl border border-cyan-800">
                    🎨
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-white">Fix CSS & Responsive UI for Fintech App</h5>
                    <p className="text-xs text-gray-400">Tweak buttons and mobile layout for a payment dashboard</p>
                    <span className="text-xs font-black text-emerald-400 mt-0.5 block">+₦12,000 • -15 Energy</span>
                  </div>
                </div>
                <button
                  disabled={workingShift !== null}
                  onClick={() => handleWorkGig('Fix CSS for Fintech App', 12000, 15)}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs transition-all active:scale-95 disabled:opacity-50"
                >
                  {workingShift === 'Fix CSS for Fintech App' ? 'Coding...' : 'Work Shift'}
                </button>
              </div>

              {/* Gig 2 */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/40 transition-all flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-950 flex items-center justify-center text-2xl border border-blue-800">
                    💳
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-white">Integrate Paystack & Webhooks</h5>
                    <p className="text-xs text-gray-400">Implement recurring billing and secure webhooks for e-commerce</p>
                    <span className="text-xs font-black text-emerald-400 mt-0.5 block">+₦25,000 • -25 Energy</span>
                  </div>
                </div>
                <button
                  disabled={workingShift !== null}
                  onClick={() => handleWorkGig('Paystack Integration', 25000, 25)}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs transition-all active:scale-95 disabled:opacity-50"
                >
                  {workingShift === 'Paystack Integration' ? 'Coding...' : 'Work Shift'}
                </button>
              </div>

              {/* Gig 3 */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/40 transition-all flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-purple-950 flex items-center justify-center text-2xl border border-purple-800">
                    🤖
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-white">Build AI Agent for Lagos Traffic Navigation</h5>
                    <p className="text-xs text-gray-400">Train neural model to bypass Third Mainland Bridge go-slow</p>
                    <span className="text-xs font-black text-emerald-400 mt-0.5 block">+₦45,000 • -35 Energy</span>
                  </div>
                </div>
                <button
                  disabled={workingShift !== null}
                  onClick={() => handleWorkGig('AI Traffic Agent', 45000, 35)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-black text-xs transition-all active:scale-95 disabled:opacity-50"
                >
                  {workingShift === 'AI Traffic Agent' ? 'Training...' : 'Work Shift'}
                </button>
              </div>
            </div>
          )}

          {/* ─── TAB 2: STARTUP PITCH ROOM ─────────────────────────────── */}
          {activeTab === 'pitch' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/70 to-blue-950/70 border border-cyan-500/30">
                <h4 className="font-black text-sm text-cyan-300 mb-1">Angel Investor Demo Day</h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Step into the glass boardroom. Pitch your high-potential Nigerian startup to local and diaspora angel investors for non-dilutive seed grants!
                </p>
              </div>

              {pitchResult && (
                <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm font-medium animate-in fade-in duration-200">
                  {pitchResult}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => handlePitchStartup('okada')}
                  className="p-4 rounded-2xl bg-stone-900 border border-white/10 hover:border-cyan-400 hover:bg-cyan-950/40 text-left transition-all group"
                >
                  <span className="text-2xl mb-1.5 block">🛵</span>
                  <h5 className="font-extrabold text-sm text-cyan-200 group-hover:text-cyan-300">
                    PayOkada
                  </h5>
                  <p className="text-xs text-gray-400 mt-1">QR micro-payments for 200,000 Okada riders</p>
                  <span className="text-[11px] font-bold text-emerald-400 mt-2 block">Grant: ₦60,000</span>
                </button>

                <button
                  onClick={() => handlePitchStartup('solar')}
                  className="p-4 rounded-2xl bg-stone-900 border border-white/10 hover:border-cyan-400 hover:bg-cyan-950/40 text-left transition-all group"
                >
                  <span className="text-2xl mb-1.5 block">☀️</span>
                  <h5 className="font-extrabold text-sm text-cyan-200 group-hover:text-cyan-300">
                    SolarBox
                  </h5>
                  <p className="text-xs text-gray-400 mt-1">Rent-to-own solar packs replacing noisy generators</p>
                  <span className="text-[11px] font-bold text-emerald-400 mt-2 block">Grant: ₦75,000</span>
                </button>

                <button
                  onClick={() => handlePitchStartup('jollof')}
                  className="p-4 rounded-2xl bg-stone-900 border border-white/10 hover:border-cyan-400 hover:bg-cyan-950/40 text-left transition-all group"
                >
                  <span className="text-2xl mb-1.5 block">🍲</span>
                  <h5 className="font-extrabold text-sm text-cyan-200 group-hover:text-cyan-300">
                    JollofAI
                  </h5>
                  <p className="text-xs text-gray-400 mt-1">Hyper-local cloud kitchens with predictive orders</p>
                  <span className="text-[11px] font-bold text-emerald-400 mt-2 block">Grant: ₦50,000</span>
                </button>
              </div>
            </div>
          )}

          {/* ─── TAB 3: BARISTA FUEL ───────────────────────────────────── */}
          {activeTab === 'coffee' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-stone-900 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-950 flex items-center justify-center text-2xl border border-amber-800">
                    ☕
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-white">Double-Shot Artisan Espresso</h5>
                    <p className="text-xs text-gray-400">Freshly ground Ethiopian beans for intense coding focus</p>
                    <span className="text-xs font-black text-amber-400 mt-0.5 block">₦1,200 • +45 Energy</span>
                  </div>
                </div>
                <button
                  onClick={() => handleCoffee('espresso')}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs transition-all active:scale-95"
                >
                  Drink
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-stone-900 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-950 flex items-center justify-center text-2xl border border-blue-800">
                    ⚡
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-white">Ice-Cold Red Bull Energy Can</h5>
                    <p className="text-xs text-gray-400">Maximum taurine and caffeine for all-night hackathons</p>
                    <span className="text-xs font-black text-amber-400 mt-0.5 block">₦1,500 • +50 Energy</span>
                  </div>
                </div>
                <button
                  onClick={() => handleCoffee('redbull')}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs transition-all active:scale-95"
                >
                  Drink
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
            Exit Coworking Space
          </button>
        </div>

      </div>
    </div>
  );
}
