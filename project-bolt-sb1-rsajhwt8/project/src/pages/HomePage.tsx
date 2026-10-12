import { Compass, Trophy, Gamepad2, Scale, ArrowRight, Coffee, Armchair, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function HomePage() {
  const { navigate } = useApp();

  const experiences = [
    {
      id: 'explore',
      title: 'Social Hub',
      subtitle: 'Explore the 3D World',
      description: 'Walk around a virtual plaza, interact with objects, and discover experiences.',
      icon: Compass,
      gradient: 'from-forest-500/20 to-forest-700/20',
      border: 'border-forest-500/20',
      iconBg: 'bg-forest-500/15 border-forest-500/30',
      iconColor: 'text-forest-300',
      status: 'LIVE',
      onClick: () => navigate('explore'),
    },
    {
      id: 'football',
      title: 'Football Arena',
      subtitle: 'Coming Soon',
      description: 'A multiplayer football experience built for Nigerian streets and pitches.',
      icon: Trophy,
      gradient: 'from-gold-500/20 to-gold-700/20',
      border: 'border-gold-500/20',
      iconBg: 'bg-gold-500/15 border-gold-500/30',
      iconColor: 'text-gold-300',
      status: 'IN DEVELOPMENT',
      onClick: () => navigate('football'),
    },
    {
      id: 'games',
      title: 'Gaming Lounge',
      subtitle: 'Snooker, Chess, Whot',
      description: 'Classic Nigerian game room favourites. Some available now, more on the way.',
      icon: Gamepad2,
      gradient: 'from-crimson-500/20 to-crimson-700/20',
      border: 'border-crimson-500/20',
      iconBg: 'bg-crimson-500/15 border-crimson-500/30',
      iconColor: 'text-crimson-300',
      status: 'COMING SOON',
      onClick: () => navigate('games'),
    },
    {
      id: 'court',
      title: 'Nigerian Court',
      subtitle: 'The People Decide',
      description: 'Submit everyday dilemmas, argue cases, vote, and see public verdicts.',
      icon: Scale,
      gradient: 'from-ink-600/30 to-ink-800/30',
      border: 'border-white/10',
      iconBg: 'bg-gold-500/15 border-gold-500/30',
      iconColor: 'text-gold-400',
      status: 'LIVE',
      onClick: () => navigate('court'),
    },
  ];

  const worldFeatures = [
    { icon: Compass, label: 'Click-to-move navigation' },
    { icon: Armchair, label: 'Interact with benches & objects' },
    { icon: Coffee, label: 'Visit Universe Cafe' },
    { icon: Sparkles, label: 'Explore a detailed plaza' },
  ];

  return (
    <div className="pb-28 md:pb-12">
      {/* Hero */}
      <section className="relative pt-8 pb-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold-500/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-10 left-1/4 w-[300px] h-[200px] bg-forest-500/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-[300px] h-[200px] bg-crimson-500/6 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative text-center max-w-2xl mx-auto px-2">
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-xl shadow-gold-500/30">
              <Compass className="w-10 h-10 text-ink-950" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">
            NIGERIAN <span className="text-gradient-gold">UNIVERSE</span>
          </h1>
          <p className="font-serif text-lg sm:text-xl text-ink-200 italic mb-2">
            A virtual world where Nigerians connect, play, and decide.
          </p>
          <p className="text-sm text-ink-400 max-w-md mx-auto mb-7">
            Walk through a 3D social plaza. Enter the Nigerian Court. Challenge friends to games. All in one place.
          </p>
          <button onClick={() => navigate('explore')} className="btn-primary text-base px-8 py-4">
            <Compass className="w-5 h-5" /> Enter the Universe <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* World preview showcase */}
      <section className="mb-8">
        <div className="card p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-forest-500/8 rounded-full blur-3xl -translate-y-20 translate-x-20 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <span className="chip bg-forest-500/15 text-forest-300 border border-forest-500/25 text-[10px] font-bold tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-forest-400 animate-pulse" /> INTERACTIVE
              </span>
            </div>
            <h2 className="font-display text-xl font-bold mb-2">The 3D Social Plaza</h2>
            <p className="text-sm text-ink-200 leading-relaxed mb-4">
              A walkable virtual environment with buildings, benches, a fountain, and entrances to every experience. Click or tap to move. Drag to look around.
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {worldFeatures.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.label} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5">
                    <Icon className="w-4 h-4 text-gold-400 shrink-0" />
                    <span className="text-xs text-ink-200">{f.label}</span>
                  </div>
                );
              })}
            </div>
            <button onClick={() => navigate('explore')} className="btn-ghost text-sm px-5 py-2.5">
              <Compass className="w-4 h-4" /> Enter 3D World
            </button>
          </div>
        </div>
      </section>

      {/* Experience cards */}
      <section>
        <h2 className="font-display text-xl font-bold mb-4 px-1">Experiences</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {experiences.map((exp) => {
            const Icon = exp.icon;
            return (
              <button
                key={exp.id}
                onClick={exp.onClick}
                className={`card p-6 text-left bg-gradient-to-br ${exp.gradient} ${exp.border} hover:border-gold-500/30 transition-all duration-300 group relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-16 translate-x-16" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl ${exp.iconBg} border flex items-center justify-center`}>
                      <Icon className={`w-7 h-7 ${exp.iconColor}`} strokeWidth={2} />
                    </div>
                    <span className={`chip text-[10px] font-bold tracking-widest ${
                      exp.status === 'LIVE' ? 'bg-forest-500/15 text-forest-300 border border-forest-500/25'
                        : 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                    }`}>
                      {exp.status === 'LIVE' && <span className="w-1.5 h-1.5 rounded-full bg-forest-400 animate-pulse" />}
                      {exp.status}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold mb-0.5">{exp.title}</h3>
                  <p className="text-xs text-ink-400 mb-2">{exp.subtitle}</p>
                  <p className="text-sm text-ink-200 leading-relaxed mb-4">{exp.description}</p>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-gold-400 group-hover:gap-3 transition-all">
                    Enter <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-10 pb-4 text-center border-t border-white/5 mt-8">
        <p className="font-serif italic text-ink-300 text-sm mb-2">
          One platform. Many worlds. Built for Nigerians.
        </p>
        <p className="text-xs text-ink-500">Nigerian Universe is in active development. More experiences coming soon.</p>
      </footer>
    </div>
  );
}
