import { useState } from 'react';
import { useSimLife } from '@/sim/SimLifeContext';
import { X, Trophy, Target, RotateCcw } from 'lucide-react';

interface FootballMinigameModalProps {
  onClose: () => void;
}

type ShotTarget = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

export function FootballMinigameModal({ onClose }: FootballMinigameModalProps) {
  const { earnNaira, adjustNeeds, showSimToast } = useSimLife();

  const [score, setScore] = useState(0);
  const [shotsTaken, setShotsTaken] = useState(0);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [keeperDive, setKeeperDive] = useState<ShotTarget | null>(null);

  const TARGETS: { id: ShotTarget; label: string }[] = [
    { id: 'top-left', label: 'Top Left Corner' },
    { id: 'top-right', label: 'Top Right Corner' },
    { id: 'bottom-left', label: 'Bottom Left Corner' },
    { id: 'bottom-right', label: 'Bottom Right Corner' },
    { id: 'center', label: 'Panenka Center' },
  ];

  const takeShot = (target: ShotTarget) => {
    if (shotsTaken >= 5) return;

    // Keeper randomly picks a direction
    const possibleDives: ShotTarget[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'];
    const dive = possibleDives[Math.floor(Math.random() * possibleDives.length)];
    setKeeperDive(dive);

    const isGoal = dive !== target;
    setShotsTaken((prev) => prev + 1);

    if (isGoal) {
      setScore((prev) => prev + 1);
      setLastResult('GOOOAAAL! Super Eagles style! ⚽🔥');
      adjustNeeds({ fun: 15 });
    } else {
      setLastResult('SAVED by the goalkeeper! What a stop!');
    }

    if (shotsTaken + 1 === 5) {
      const finalScore = isGoal ? score + 1 : score;
      if (finalScore >= 3) {
        earnNaira(5000, `Won Penalty Shootout (${finalScore}/5 Goals)`);
        adjustNeeds({ fun: 35, social: 20 });
        showSimToast(`Victory! You scored ${finalScore}/5 penalties! Won ₦5,000!`, '🏆', 'success');
      } else {
        showSimToast(`Finished with ${finalScore}/5 goals. Keep training!`, '⚽', 'info');
      }
    }
  };

  const restart = () => {
    setScore(0);
    setShotsTaken(0);
    setLastResult(null);
    setKeeperDive(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-green-950 via-slate-900 to-slate-950 border-2 border-green-500/40 rounded-[36px] max-w-lg w-full p-6 shadow-2xl text-white relative flex flex-col">

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-green-500/20 border border-green-400/40 text-green-300 text-2xl">
            ⚽
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Lagos Street Penalty Shootout</h2>
            <p className="text-xs text-green-400">Score at least 3 out of 5 to win ₦5,000</p>
          </div>
        </div>

        {/* Pitch & Goal Visual */}
        <div className="bg-green-900/40 border border-green-500/30 rounded-3xl p-6 my-2 text-center relative overflow-hidden min-h-[220px] flex flex-col items-center justify-between">
          <div className="flex items-center justify-between w-full text-xs font-bold px-2">
            <span>Score: <span className="text-amber-300 font-mono text-base">{score} / {shotsTaken}</span></span>
            <span>Shots Left: <span className="text-amber-300 font-mono text-base">{5 - shotsTaken}</span></span>
          </div>

          {/* Goal Post Frame */}
          <div className="w-56 h-28 border-4 border-white/80 border-b-0 rounded-t-xl relative my-3 flex items-center justify-center bg-white/5 shadow-inner">
            <span className="text-4xl animate-bounce">
              {shotsTaken >= 5 ? '🏁' : keeperDive ? '🧤' : '🧍'}
            </span>
          </div>

          {lastResult && (
            <div className="text-sm font-black text-amber-300 animate-in zoom-in-95">
              {lastResult}
            </div>
          )}
        </div>

        {/* Shot Target Selectors */}
        {shotsTaken < 5 ? (
          <div>
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 text-center">
              Pick Your Penalty Spot:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TARGETS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => takeShot(t.id)}
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-green-500 hover:text-black font-bold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Target size={14} /> {t.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center pt-2">
            <button
              onClick={restart}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs inline-flex items-center gap-2"
            >
              <RotateCcw size={15} /> Play Again
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
