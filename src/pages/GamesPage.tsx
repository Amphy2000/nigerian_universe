import { Gamepad2, ArrowLeft, Circle, Crown, Layers, Lock } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function GamesPage() {
  const { navigate, showToast } = useApp();

  const games = [
    { id: 'snooker', name: 'Snooker', emoji: '🎱', icon: Circle, desc: 'Precision and strategy on the green table.', status: 'coming_soon' },
    { id: 'chess', name: 'Chess', emoji: '♟️', icon: Crown, desc: 'The classic battle of minds. Nigerian style.', status: 'coming_soon' },
    { id: 'whot', name: 'Whot', emoji: '🃏', icon: Layers, desc: 'The beloved Nigerian card game. Pick, play, win.', status: 'coming_soon' },
  ];

  return (
    <div className="pb-28 md:pb-12 max-w-2xl mx-auto">
      <button onClick={() => navigate('home')} className="flex items-center gap-2 text-sm text-ink-300 hover:text-white transition-colors mb-6 mt-4">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <div className="card p-8 text-center relative overflow-hidden mb-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-crimson-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-crimson-500/15 border border-crimson-500/30 flex items-center justify-center mx-auto mb-4">
            <Gamepad2 className="w-10 h-10 text-crimson-300" />
          </div>
          <h1 className="font-display text-2xl font-extrabold mb-2">Gaming Lounge</h1>
          <p className="font-serif text-lg text-ink-200 italic mb-4">The lounge is being furnished.</p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 mb-6">
            <Lock className="w-4 h-4 text-gold-400" />
            <span className="text-sm font-semibold text-gold-300">Coming Soon</span>
          </div>

          <p className="text-ink-200 leading-relaxed max-w-md mx-auto">
            Classic Nigerian game room favourites — snooker, chess, and Whot.
            Challenge your friends or match with strangers across the universe.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <div key={game.id} className="card p-5 text-center opacity-80">
              <div className="text-4xl mb-3">{game.emoji}</div>
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Icon className="w-4 h-4 text-crimson-300" />
                <p className="text-sm font-bold text-ink-100">{game.name}</p>
              </div>
              <p className="text-xs text-ink-400 leading-relaxed mb-3">{game.desc}</p>
              <span className="chip bg-gold-500/10 text-gold-400 text-[10px] border border-gold-500/20">
                <Lock className="w-3 h-3" /> Coming Soon
              </span>
            </div>
          );
        })}
      </div>

      <div className="card p-6 text-center">
        <p className="text-sm text-ink-300 mb-1">Games will be playable right here in your browser.</p>
        <button onClick={() => showToast('You will be notified when games go live.', 'info')} className="text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors mt-2">
          Notify me when available →
        </button>
      </div>
    </div>
  );
}
