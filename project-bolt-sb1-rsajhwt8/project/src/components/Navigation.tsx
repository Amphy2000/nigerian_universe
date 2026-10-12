import { Globe, Home, Compass, Trophy, Gamepad2, Scale, Bell, User, Flame, Plus, Archive } from 'lucide-react';
import { useApp, type Page } from '@/context/AppContext';
import { useEffect, useState } from 'react';

const PLATFORM_NAV: { page: Page; label: string; icon: typeof Home }[] = [
  { page: 'home', label: 'Home', icon: Home },
  { page: 'explore', label: 'Explore', icon: Compass },
  { page: 'football', label: 'Football', icon: Trophy },
  { page: 'games', label: 'Games', icon: Gamepad2 },
];

const COURT_NAV: { page: Page; label: string; icon: typeof Scale }[] = [
  { page: 'court', label: 'Court', icon: Scale },
  { page: 'trending', label: 'Trending', icon: Flame },
  { page: 'submit', label: 'Bring Matter', icon: Plus },
  { page: 'activity', label: 'Activity', icon: Bell },
  { page: 'profile', label: 'Profile', icon: User },
  { page: 'archive', label: 'Archives', icon: Archive },
];

const ALL_NAV = [...PLATFORM_NAV, ...COURT_NAV];

export function BottomNav() {
  const { page, navigate } = useApp();
  const isCourtSection = ['court', 'trending', 'submit', 'activity', 'profile', 'archive'].includes(page);

  const mainItems = isCourtSection ? COURT_NAV.slice(0, 4) : PLATFORM_NAV;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-ink-900/90 backdrop-blur-xl border-t border-white/10 px-2 py-2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {mainItems.map((item) => {
            const active = page === item.page;
            const Icon = item.icon;
            return (
              <button key={item.page} onClick={() => navigate(item.page)} className="flex flex-col items-center gap-1 py-1 px-2 transition-all">
                <Icon className={`w-5 h-5 transition-all ${active ? 'text-gold-400' : 'text-ink-400'}`} strokeWidth={active ? 2.5 : 2} />
                <span className={`text-[10px] font-semibold ${active ? 'text-gold-400' : 'text-ink-400'}`}>{item.label}</span>
                {active && <div className="w-1 h-1 rounded-full bg-gold-400 -mt-0.5" />}
              </button>
            );
          })}
          <button onClick={() => navigate(isCourtSection ? 'home' : 'court')} className="flex flex-col items-center gap-0.5">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center -mt-4 bg-gold-500/90 active:scale-95 transition-all shadow-lg shadow-gold-500/20">
              {isCourtSection ? <Home className="w-5 h-5 text-ink-950" strokeWidth={2.5} /> : <Scale className="w-5 h-5 text-ink-950" strokeWidth={2.5} />}
            </div>
            <span className="text-[10px] font-semibold text-ink-400">{isCourtSection ? 'Universe' : 'Court'}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export function Sidebar() {
  const { page, navigate, peopleInCourt } = useApp();
  const [liveCount, setLiveCount] = useState(peopleInCourt);
  useEffect(() => { setLiveCount(peopleInCourt); }, [peopleInCourt]);

  const isCourtSection = ['court', 'trending', 'submit', 'activity', 'profile', 'archive'].includes(page);

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-white/10 bg-ink-900/40 backdrop-blur-sm p-5">
      <button onClick={() => navigate('home')} className="flex items-center gap-2.5 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
          <Globe className="w-5 h-5 text-ink-950" strokeWidth={2.5} />
        </div>
        <div className="text-left">
          <div className="font-display font-extrabold text-sm leading-tight tracking-wide">NIGERIAN</div>
          <div className="font-display font-extrabold text-sm leading-tight text-gold-400 tracking-wide">UNIVERSE</div>
        </div>
      </button>

      <div className="text-[10px] font-bold text-ink-500 uppercase tracking-widest px-4 mb-2">Platform</div>
      <nav className="flex flex-col gap-1 mb-4">
        {PLATFORM_NAV.map((item) => <NavButton key={item.page} item={item} active={page === item.page} onClick={() => navigate(item.page)} />)}
      </nav>

      <div className="text-[10px] font-bold text-ink-500 uppercase tracking-widest px-4 mb-2">Nigerian Court</div>
      <nav className="flex flex-col gap-1">
        {COURT_NAV.map((item) => <NavButton key={item.page} item={item} active={page === item.page} onClick={() => navigate(item.page)} />)}
      </nav>

      <div className="mt-auto card p-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-forest-400" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-forest-400 animate-pulseRing" />
          </div>
          <span className="text-xs font-semibold text-forest-300">LIVE</span>
        </div>
        <p className="text-xs text-ink-400">{liveCount.toLocaleString()} people in court</p>
      </div>
    </aside>
  );
}

function NavButton({ item, active, onClick }: { item: { page: Page; label: string; icon: typeof Home }; active: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <button onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium text-sm ${
        active ? 'bg-gold-500/10 text-gold-300 border border-gold-500/20' : 'text-ink-300 hover:bg-white/5 hover:text-ink-100 border border-transparent'
      }`}>
      <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
      {item.label}
    </button>
  );
}
