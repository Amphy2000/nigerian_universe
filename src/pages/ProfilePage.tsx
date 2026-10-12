import { useState } from 'react';
import { Scale, Gavel, MessageCircle, Award, Lock, Share2, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { USER_PROFILE } from '@/data/mockData';
import { CaseCard } from '@/components/CaseCard';
import { formatNumber } from '@/utils/format';

export function ProfilePage() {
  const { cases, showToast, voteHistory } = useApp();
  const user = USER_PROFILE;
  const myCases = cases.slice(0, 3);
  const [showShareCard, setShowShareCard] = useState(false);

  const majorityPct = user.majorityAlignment;
  const disagreementPct = 100 - majorityPct;

  const handleShareCard = async () => {
    const text = `⚖️ NIGERIAN COURT\nI have delivered ${user.verdictsDelivered} verdicts.\nI agree with Nigeria: ${majorityPct}%\nMy most controversial verdict: ${user.mostControversialVerdict}\nWould you survive Nigerian Court?\nJOIN THE COURT`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Nigerian Court', text }); } catch {}
    } else {
      navigator.clipboard.writeText(text);
      showToast('Card copied to clipboard', 'success');
    }
  };

  return (
    <div className="pb-28 md:pb-12 max-w-2xl mx-auto">
      {/* Profile header */}
      <div className="card p-6 mb-6 mt-4 text-center">
        <div className="w-20 h-20 rounded-3xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🧑🏾‍⚖️</span>
        </div>
        <h1 className="font-display text-xl font-bold">{user.username}</h1>
        <p className="text-sm text-ink-400">Senior Juror · Member of the Court</p>

        <div className="grid grid-cols-3 gap-2 mt-6">
          <Stat icon={<Scale className="w-4 h-4" />} label="Cases Brought" value={user.casesBrought} />
          <Stat icon={<Gavel className="w-4 h-4" />} label="Verdicts Delivered" value={user.verdictsDelivered} />
          <Stat icon={<MessageCircle className="w-4 h-4" />} label="Arguments" value={user.arguments} />
        </div>

        <button onClick={() => setShowShareCard(true)} className="btn-ghost w-full text-sm mt-4">
          <Share2 className="w-4 h-4" /> Share My Court Card
        </button>
      </div>

      {/* You vs Nigeria */}
      <div className="card p-5 mb-6">
        <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
          🇳🇬 You vs Nigeria
        </h2>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 text-center">
            <p className="font-display text-2xl font-bold text-forest-300">{majorityPct}%</p>
            <p className="text-[10px] text-ink-400">Agreed with the Court</p>
          </div>
          <div className="w-px h-12 bg-white/10" />
          <div className="flex-1 text-center">
            <p className="font-display text-2xl font-bold text-gold-300">{disagreementPct}%</p>
            <p className="text-[10px] text-ink-400">Disagreed with the Court</p>
          </div>
        </div>
        <div className="flex h-3 rounded-full overflow-hidden bg-ink-900 mb-4">
          <div className="bg-forest-500 transition-all duration-1000" style={{ width: `${majorityPct}%` }} />
          <div className="bg-gold-500 transition-all duration-1000" style={{ width: `${disagreementPct}%` }} />
        </div>
        <p className="text-xs text-ink-400 leading-relaxed">
          {majorityPct}% of your verdicts matched the final public verdict. Your most controversial verdict: <span className="font-semibold text-gold-300">{user.mostControversialVerdict}</span>
        </p>
      </div>

      {/* Badges */}
      <div className="mb-6">
        <h2 className="font-display text-lg font-bold flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-gold-400" /> Badges
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {user.badges.map((badge) => (
            <div key={badge.id} className={`card p-4 text-center transition-all ${badge.earned ? 'border-gold-500/20' : 'opacity-40'}`}>
              <div className="text-3xl mb-2">{badge.emoji}</div>
              <p className="text-sm font-semibold text-ink-100">{badge.label}</p>
              <p className="text-xs text-ink-400 mt-0.5">{badge.description}</p>
              {!badge.earned && (
                <div className="flex items-center justify-center gap-1 mt-2 text-xs text-ink-500">
                  <Lock className="w-3 h-3" /> Locked
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* My Cases */}
      <div className="mb-6">
        <h2 className="font-display text-lg font-bold mb-4">My Cases</h2>
        {myCases.length > 0 ? (
          <div className="space-y-2.5">
            {myCases.map((c) => <CaseCard key={c.id} caseData={c} variant="compact" />)}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <p className="text-ink-300 mb-1">No cases brought yet.</p>
            <p className="text-sm text-ink-400">Bring your first matter to the court.</p>
          </div>
        )}
      </div>

      {/* My Verdicts */}
      <div className="mb-6">
        <h2 className="font-display text-lg font-bold mb-4">My Verdicts</h2>
        {voteHistory.length > 0 ? (
          <div className="space-y-2.5">
            {voteHistory.slice(0, 5).map((v) => {
              const c = cases.find((cs) => cs.id === v.caseId);
              if (!c) return null;
              return <CaseCard key={v.caseId} caseData={c} variant="compact" />;
            })}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <p className="text-ink-300 mb-1">No verdicts delivered yet.</p>
            <p className="text-sm text-ink-400">Deliver your first verdict.</p>
          </div>
        )}
      </div>

      {/* My Arguments */}
      <div className="mb-6">
        <h2 className="font-display text-lg font-bold mb-4">My Arguments</h2>
        <div className="card p-8 text-center">
          <p className="text-ink-300 mb-1">Your arguments will appear here.</p>
          <button onClick={() => showToast('Opening a case for you...', 'info')} className="text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors mt-2">
            Go argue a case →
          </button>
        </div>
      </div>

      {/* Gamification progress */}
      <div className="card p-5">
        <h3 className="font-display text-sm font-bold mb-3">Juror Progress</h3>
        <div className="space-y-3">
          <ProgressRow label="Senior Juror" current={user.verdictsDelivered} target={200} />
          <ProgressRow label="Chief Juror" current={user.verdictsDelivered} target={500} />
        </div>
      </div>

      {/* Shareable personal card */}
      {showShareCard && (
        <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" onClick={() => setShowShareCard(false)}>
          <div className="w-full max-w-sm animate-scaleIn" onClick={(e) => e.stopPropagation()}>
            <div className="card p-8 text-center bg-gradient-to-b from-ink-800 to-ink-900 border-gold-500/20">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center">
                  <span className="text-2xl">🧑🏾‍⚖️</span>
                </div>
              </div>
              <p className="font-display text-sm font-bold tracking-widest text-gold-400 mb-1">NIGERIAN COURT</p>
              <p className="font-serif text-base italic text-ink-100 mb-4">I have delivered {user.verdictsDelivered} verdicts.</p>
              <p className="text-sm text-ink-200 mb-1">I agree with Nigeria:</p>
              <p className="font-display text-3xl font-extrabold text-gradient-gold mb-2">{majorityPct}%</p>
              <p className="text-sm text-ink-400 mb-4">My most controversial verdict: {user.mostControversialVerdict}</p>
              <p className="font-display text-sm font-bold text-gold-300 mb-6">Would you survive Nigerian Court?</p>
              <button onClick={handleShareCard} className="btn-primary w-full text-sm mb-2">
                <Share2 className="w-4 h-4" /> Share My Card
              </button>
              <button onClick={() => setShowShareCard(false)} className="text-sm text-ink-400 hover:text-ink-200 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-white/5 rounded-2xl p-3 text-center">
      <div className="flex justify-center mb-1 text-gold-400">{icon}</div>
      <p className="font-display text-xl font-bold">{value}</p>
      <p className="text-[10px] text-ink-400 font-medium">{label}</p>
    </div>
  );
}

function ProgressRow({ label, current, target }: { label: string; current: number; target: number }) {
  const pct = Math.min(100, (current / target) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-ink-200 font-medium">{label}</span>
        <span className="text-ink-400">{current} / {target}</span>
      </div>
      <div className="h-2 rounded-full bg-ink-900 overflow-hidden">
        <div className="h-full bg-gold-500 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
