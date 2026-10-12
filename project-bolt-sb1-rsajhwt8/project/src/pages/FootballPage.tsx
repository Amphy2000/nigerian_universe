import { Trophy, ArrowLeft, Hammer, Users, Goal } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function FootballPage() {
  const { navigate } = useApp();

  return (
    <div className="pb-28 md:pb-12 max-w-2xl mx-auto">
      <button onClick={() => navigate('home')} className="flex items-center gap-2 text-sm text-ink-300 hover:text-white transition-colors mb-6 mt-4">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <div className="card p-8 text-center relative overflow-hidden mb-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-forest-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-forest-500/15 border border-forest-500/30 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-forest-300" />
          </div>
          <h1 className="font-display text-2xl font-extrabold mb-2">Football Arena</h1>
          <p className="font-serif text-lg text-ink-200 italic mb-4">The pitch is being built.</p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 mb-6">
            <Hammer className="w-4 h-4 text-gold-400" />
            <span className="text-sm font-semibold text-gold-300">In Development</span>
          </div>

          <p className="text-ink-200 leading-relaxed max-w-md mx-auto mb-8">
            A multiplayer football experience built for Nigerian streets and pitches.
            Gather your friends, pick your teams, and play in real-time matches.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        <FeatureCard icon={<Users className="w-5 h-5" />} title="Multiplayer" desc="Play with friends online" />
        <FeatureCard icon={<Goal className="w-5 h-5" />} title="Real Matches" desc="Competitive gameplay" />
        <FeatureCard icon={<Trophy className="w-5 h-5" />} title="Tournaments" desc="Climb the rankings" />
      </div>

      <div className="card p-6 text-center">
        <p className="text-sm text-ink-300 mb-1">Want to be notified when the arena opens?</p>
        <p className="text-xs text-ink-400">Stay tuned — the pitch will be ready soon.</p>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="card p-4 text-center">
      <div className="flex justify-center text-forest-300 mb-2">{icon}</div>
      <p className="text-sm font-semibold text-ink-100">{title}</p>
      <p className="text-xs text-ink-400 mt-0.5">{desc}</p>
    </div>
  );
}
