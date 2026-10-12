import { useState } from 'react';
import { Archive, Swords, Laugh, Eye, Trophy, ArrowLeft } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CaseCard } from '@/components/CaseCard';
import { getClosedCases } from '@/data/cases';
import { formatNumber } from '@/utils/format';

type ArchiveSort = 'debated' | 'controversial' | 'voted' | 'funniest' | 'divided' | 'upset';

export function ArchivePage() {
  const { navigate } = useApp();
  const closed = getClosedCases();
  const [sort, setSort] = useState<ArchiveSort>('debated');

  const sorts: { id: ArchiveSort; label: string; icon: typeof Archive }[] = [
    { id: 'debated', label: 'Most Debated', icon: Archive },
    { id: 'voted', label: 'Most Voted', icon: Trophy },
    { id: 'controversial', label: 'Most Controversial', icon: Swords },
    { id: 'divided', label: 'Most Divided', icon: Swords },
    { id: 'funniest', label: 'Funniest', icon: Laugh },
    { id: 'upset', label: 'Biggest Upset', icon: Eye },
  ];

  const sorted = (() => {
    const list = [...closed];
    switch (sort) {
      case 'debated': return list.sort((a, b) => b.argumentsCount - a.argumentsCount);
      case 'voted': return list.sort((a, b) => (b.votesFor + b.votesAgainst) - (a.votesFor + a.votesAgainst));
      case 'controversial': return list.sort((a, b) => b.controversialScore - a.controversialScore);
      case 'divided': return list.sort((a, b) => Math.abs(a.votesFor - a.votesAgainst) - Math.abs(b.votesFor - b.votesAgainst));
      case 'funniest': return list.filter((c) => c.funny).concat(list.filter((c) => !c.funny));
      case 'upset': return list.sort((a, b) => b.controversialScore - a.controversialScore);
    }
  })();

  return (
    <div className="pb-28 md:pb-12">
      <div className="mb-6 pt-4">
        <button onClick={() => navigate('court')} className="flex items-center gap-2 text-sm text-ink-300 hover:text-white transition-colors mb-3">
          <ArrowLeft className="w-4 h-4" /> Back to Court
        </button>
        <h1 className="font-display text-2xl font-extrabold flex items-center gap-2">
          <Archive className="w-6 h-6 text-gold-400" /> Court Archives
        </h1>
        <p className="text-sm text-ink-400 mt-1">Browse closed cases and past verdicts</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        {sorts.map((s) => {
          const Icon = s.icon;
          return (
            <button key={s.id} onClick={() => setSort(s.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                sort === s.id ? 'bg-gold-500/15 text-gold-300 border border-gold-500/30' : 'bg-white/5 text-ink-300 border border-transparent'
              }`}>
              <Icon className="w-3.5 h-3.5" /> {s.label}
            </button>
          );
        })}
      </div>

      {sorted.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {sorted.map((c) => <CaseCard key={c.id} caseData={c} />)}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <p className="text-ink-300 mb-2">No closed cases yet.</p>
          <p className="text-sm text-ink-400">The archives will fill as matters reach their verdict.</p>
        </div>
      )}
    </div>
  );
}
