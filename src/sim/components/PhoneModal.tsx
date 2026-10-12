import { useState } from 'react';
import { useSimLife } from '../SimLifeContext';
import { type InventoryItem } from '../types';
import { X, Smartphone, CreditCard, Radio, Briefcase, ShoppingBag, Music, Flame, ArrowUpRight } from 'lucide-react';

interface PhoneModalProps {
  onClose: () => void;
}

type PhoneApp = 'home' | 'bank' | 'gist' | 'food' | 'career' | 'music';

const FOOD_MENU: InventoryItem[] = [
  {
    id: 'jollof-party',
    name: 'Smoky Party Jollof & Plantain',
    category: 'food',
    icon: '🍛',
    price: 3500,
    description: 'Authentic firewood jollof with fried dodo. Refills Belle to 100%.',
    effects: { hunger: 45, fun: 20 },
  },
  {
    id: 'suya-platter',
    name: 'Alhaji Special Beef Suya',
    category: 'food',
    icon: '🥩',
    price: 2500,
    description: 'Hot beef skewers drenched in yaji pepper, fresh onions and cabbage.',
    effects: { hunger: 35, energy: 15, fun: 25 },
  },
  {
    id: 'pepper-soup',
    name: 'Spicy Catfish Pepper Soup',
    category: 'food',
    icon: '🍲',
    price: 4000,
    description: 'Steaming medicinal soup that wakes up every nerve in the body.',
    effects: { hunger: 30, energy: 35, fun: 15 },
  },
  {
    id: 'maltina-pack',
    name: 'Ice-Cold Maltina & Meat Pie',
    category: 'food',
    icon: '🥤',
    price: 1500,
    description: 'Classic quick street refreshment to keep moving.',
    effects: { hunger: 20, energy: 20, fun: 10 },
  },
];

const STREET_GISTS = [
  { id: '1', user: '@LagosTrafficBot', text: 'Third Mainland bridge moving smoothly! Miracles still happen on Mondays. 🚗✨', likes: '1.2k' },
  { id: '2', user: '@TechBro_Yaba', text: 'Just shipped another fullstack product from Silicon Lagoon. Remote work sweet die! 💻🚀', likes: '3.4k' },
  { id: '3', user: '@OwambeLover', text: 'If you attend wedding without party jollof and souvenir bucket, did you really attend? 😂', likes: '5.8k' },
  { id: '4', user: '@SuyaMasterMusa', text: 'Fresh batch of spicy tozo suya ready at the joint. Come early before it finishes! 🥩🔥', likes: '980' },
];

export function PhoneModal({ onClose }: PhoneModalProps) {
  const { naira, career, doHustleWork, buyItem, earnNaira, gameTime } = useSimLife();
  const [activeApp, setActiveApp] = useState<PhoneApp>('home');
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Smartphone Bezel */}
      <div className="w-[340px] h-[640px] bg-slate-950 border-4 border-slate-700 rounded-[48px] p-4 shadow-2xl flex flex-col relative text-white overflow-hidden shadow-emerald-500/10">

        {/* Dynamic Island / Notch */}
        <div className="w-24 h-5 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 px-3 mb-3">
          <span>{`${gameTime.hour.toString().padStart(2, '0')}:${gameTime.minute.toString().padStart(2, '0')}`}</span>
          <div className="flex items-center gap-1.5">
            <span>5G 📶</span>
            <span>98% 🔋</span>
          </div>
        </div>

        {/* Main Phone Screen Content */}
        <div className="flex-1 overflow-y-auto px-1 py-1">

          {/* ─── HOME SCREEN ────────────────────────────────────────────── */}
          {activeApp === 'home' && (
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="text-center my-4">
                  <div className="text-3xl font-extrabold tracking-tight text-white">NaijaPhone</div>
                  <div className="text-xs text-emerald-400 font-medium">Lagos Central Network</div>
                </div>

                {/* Quick Wallet Widget */}
                <div className="bg-gradient-to-r from-emerald-900/60 to-slate-900 border border-emerald-500/30 rounded-2xl p-3 mb-5 shadow-lg">
                  <div className="text-[11px] text-gray-400">Total Account Balance</div>
                  <div className="text-xl font-black text-emerald-300 mt-0.5">₦{naira.toLocaleString()}</div>
                  <div className="text-[10px] text-emerald-400/80 mt-1 flex items-center gap-1">
                    <span>OPay / Kuda Virtual Account Active</span>
                  </div>
                </div>

                {/* Grid of Apps */}
                <div className="grid grid-cols-3 gap-4 px-2">
                  <AppIcon
                    icon={<CreditCard size={22} className="text-emerald-300" />}
                    label="OPay / Bank"
                    bg="bg-emerald-600/30 border-emerald-500/40"
                    onClick={() => setActiveApp('bank')}
                  />
                  <AppIcon
                    icon={<ShoppingBag size={22} className="text-orange-300" />}
                    label="Chowdeck"
                    bg="bg-orange-600/30 border-orange-500/40"
                    onClick={() => setActiveApp('food')}
                  />
                  <AppIcon
                    icon={<Flame size={22} className="text-pink-300" />}
                    label="Street Gist"
                    bg="bg-pink-600/30 border-pink-500/40"
                    onClick={() => setActiveApp('gist')}
                  />
                  <AppIcon
                    icon={<Briefcase size={22} className="text-purple-300" />}
                    label="Hustle Hub"
                    bg="bg-purple-600/30 border-purple-500/40"
                    onClick={() => setActiveApp('career')}
                  />
                  <AppIcon
                    icon={<Music size={22} className="text-amber-300" />}
                    label="Afrobeats"
                    bg="bg-amber-600/30 border-amber-500/40"
                    onClick={() => setActiveApp('music')}
                  />
                </div>
              </div>

              {/* Bottom Home Hint */}
              <div className="text-center text-[11px] text-gray-500 pb-2">
                Tap app to explore • Naija Universe OS 1.0
              </div>
            </div>
          )}

          {/* ─── BANK APP ──────────────────────────────────────────────── */}
          {activeApp === 'bank' && (
            <div className="space-y-4">
              <AppHeader title="OPay / Kuda Bank" onBack={() => setActiveApp('home')} />
              <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-2xl p-4 text-center">
                <div className="text-xs text-gray-300">Available Naira Balance</div>
                <div className="text-3xl font-black text-emerald-400 mt-1">₦{naira.toLocaleString()}</div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => earnNaira(5000, 'Daily citizen allowance from Federal Reserves')}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-sm text-black flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <ArrowUpRight size={16} />
                  Claim Daily Allowance (+₦5,000)
                </button>
              </div>

              <div className="text-xs text-gray-400 pt-2">
                <div className="font-semibold uppercase tracking-wider mb-2">Recent Transactions</div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="p-2 rounded-lg bg-white/5 flex justify-between">
                    <span>Citizen Welfare Fund</span>
                    <span className="text-emerald-400 font-mono">+₦5,000</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 flex justify-between">
                    <span>Mama Bisi Buka</span>
                    <span className="text-red-400 font-mono">-₦2,500</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── CHOWDECK FOOD DELIVERY ────────────────────────────────── */}
          {activeApp === 'food' && (
            <div className="space-y-3">
              <AppHeader title="Chowdeck Lagos" onBack={() => setActiveApp('home')} />
              <div className="text-xs text-gray-400">Order hot food delivered straight to your bag:</div>

              <div className="space-y-2">
                {FOOD_MENU.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-white">{item.name}</div>
                        <div className="text-[10px] text-gray-400">{item.description}</div>
                        <div className="text-xs font-bold text-amber-400 mt-0.5">₦{item.price.toLocaleString()}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => buyItem(item)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shrink-0 active:scale-95 transition-transform"
                    >
                      Buy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── STREET GIST FEED ──────────────────────────────────────── */}
          {activeApp === 'gist' && (
            <div className="space-y-3">
              <AppHeader title="Street Gist (Twitter)" onBack={() => setActiveApp('home')} />
              <div className="space-y-2.5">
                {STREET_GISTS.map((g) => (
                  <div key={g.id} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
                    <div className="font-bold text-blue-400 mb-1">{g.user}</div>
                    <div className="text-gray-200">{g.text}</div>
                    <div className="text-[10px] text-gray-500 mt-2 flex items-center gap-1">
                      <span>❤️ {g.likes} likes</span>
                      <span>• 🔄 340 retweets</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── CAREER & HUSTLE ────────────────────────────────────────── */}
          {activeApp === 'career' && (
            <div className="space-y-4">
              <AppHeader title="Hustle & Career" onBack={() => setActiveApp('home')} />
              <div className="p-4 rounded-2xl bg-purple-950/60 border border-purple-500/30">
                <div className="text-xs text-purple-300 font-semibold">{career.field}</div>
                <div className="text-lg font-black text-white mt-0.5">{career.title}</div>
                <div className="text-xs text-gray-300 mt-1">{career.description}</div>
                <div className="text-xs font-bold text-emerald-400 mt-2">Daily Salary: ₦{career.salary.toLocaleString()}</div>
              </div>

              <button
                onClick={() => doHustleWork()}
                className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-sm text-white flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-purple-600/30"
              >
                <Briefcase size={16} />
                Work Daily Shift (+₦{career.salary.toLocaleString()})
              </button>
            </div>
          )}

          {/* ─── AFROBEATS MUSIC PLAYER ─────────────────────────────────── */}
          {activeApp === 'music' && (
            <div className="space-y-4 text-center py-6">
              <AppHeader title="Afrobeats FM" onBack={() => setActiveApp('home')} />
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-amber-600 to-purple-600 mx-auto flex items-center justify-center text-5xl shadow-xl shadow-amber-500/20">
                📻
              </div>
              <div>
                <div className="font-bold text-base text-white">Lagos Sunshine Grooves</div>
                <div className="text-xs text-amber-300">Burna, Wizkid & Asake Vibe Station</div>
              </div>

              <button
                onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                className={`py-3 px-8 rounded-full font-bold text-sm transition-transform active:scale-95 ${
                  isPlayingMusic ? 'bg-red-500 text-white' : 'bg-emerald-500 text-black'
                }`}
              >
                {isPlayingMusic ? 'Pause Music ⏸️' : 'Play Afrobeats ▶️'}
              </button>
            </div>
          )}

        </div>

        {/* Home Indicator Bar / Exit Modal */}
        <div className="pt-2 pb-1 flex justify-center">
          <button
            onClick={onClose}
            className="w-32 h-1 bg-white/40 hover:bg-white rounded-full transition-colors cursor-pointer"
            title="Close Phone"
          />
        </div>

      </div>
    </div>
  );
}

function AppIcon({ icon, label, bg, onClick }: { icon: React.ReactNode; label: string; bg: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:scale-105 active:scale-95 transition-all text-center group"
    >
      <div className={`w-14 h-14 rounded-2xl ${bg} border flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}>
        {icon}
      </div>
      <span className="text-[11px] font-medium text-gray-300 leading-tight">{label}</span>
    </button>
  );
}

function AppHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
      <button onClick={onBack} className="text-xs text-amber-400 font-semibold hover:underline">
        ← Home
      </button>
      <span className="text-xs font-bold text-white">{title}</span>
      <div className="w-8" />
    </div>
  );
}
