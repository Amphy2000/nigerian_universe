import { useState } from 'react';
import { Flame, Eye, Swords, Laugh, Zap, Dice5, Search, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CaseCard } from '@/components/CaseCard';
import { getMostDividedCase, searchCases } from '@/data/cases';
import { CATEGORIES } from '@/data/categories';
import { formatNumber, getVerdictPercentages, getDividedLabel } from '@/utils/format';

type SortTab = 'hot' | 'new' | 'viewed' | 'controversial' | 'funniest';

export function TrendingPage() {
  const { cases, openCase, openRandomCase } = useApp();
  const [tab, setTab] = useState<SortTab>('hot');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const divided = getMostDividedCase();
  const dividedPct = getVerdictPercentages(divided);
  const dividedLabel = getDividedLabel(dividedPct.forPct, dividedPct.againstPct);

  const tabs: { id: SortTab; label: string; icon: typeof Flame }[] = [
    { id: 'hot', label: 'Hot Now', icon: Flame },
    { id: 'new', label: 'New', icon: Zap },
    { id: 'viewed', label: 'Most Viewed', icon: Eye },
    { id: 'controversial', label: 'Most Controversial', icon: Swords },
    { id: 'funniest', label: 'Funniest', icon: Laugh },
  ];

  const filterChips = CATEGORIES.slice(0, 8).map((c) => ({ id: c.id, label: `${c.emoji} ${c.label.replace(' Court', '')}` }));
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const searchResults = searchQuery.trim() ? searchCases(searchQuery) : [];

  const sorted = (() => {
    let list = [...cases];
    if (activeFilter) list = list.filter((c) => c.category === activeFilter);
    switch (tab) {
      case 'hot': return list.sort((a, b) => (b.votesFor + b.votesAgainst) - (a.votesFor + a.votesAgainst));
      case 'new': return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'viewed': return list.sort((a, b) => b.views - a.views);
      case 'controversial': return list.sort((a, b) => b.controversialScore - a.controversialScore);
      case 'funniest': return list.filter((c) => c.funny).concat(list.filter((c) => !c.funny));
    }
  })();

  return (
    <div className="pb-28 md:pb-12">
      <div className="mb-6 pt-4">
        <div className="flex items-center justify-between mb-1">
          <h1 className="font-display text-2xl font-extrabold flex items-center gap-2">
            <Flame className="w-6 h-6 text-gold-400" /> Matters Trending
          </h1>
          <button onClick={() => setShowSearch(!showSearch)} className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
            <Search className="w-4 h-4 text-ink-300" />
          </button>
        </div>
        <p className="text-sm text-ink-400">What Nigeria is judging right now</p>
      </div>

      {/* Search */}
      {showSearch && (
        <div className="mb-4 animate-slideDown">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are Nigerians judging?"
              className="input pl-11"
              autoFocus
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {searchQuery && (
            <div className="mt-3">
              <p className="text-xs text-ink-400 mb-2">{searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}</p>
              {searchResults.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {searchResults.map((c) => <CaseCard key={c.id} caseData={c} />)}
                </div>
              ) : (
                <div className="card p-8 text-center">
                  <p className="text-ink-300 mb-1">No matters found.</p>
                  <p className="text-sm text-ink-400">Try a different search or bring your own matter.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Random matter */}
      <button
        onClick={openRandomCase}
        className="w-full card p-4 mb-4 hover:border-gold-500/30 transition-all group flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
          <Dice5 className="w-5 h-5 text-gold-400" />
        </div>
        <div className="text-left">
          <p className="text-sm font-bold">Judge a Random Matter</p>
          <p className="text-xs text-ink-400">What are Nigerians arguing about?</p>
        </div>
      </button>

      {/* Most Divided */}
      {dividedLabel && (
        <div className="card p-5 mb-6 bg-crimson-500/5 border-crimson-500/15">
          <div className="flex items-center gap-2 mb-3">
            <span className="chip bg-crimson-500/15 text-crimson-300 border border-crimson-500/20">{dividedLabel.emoji} {dividedLabel.label}</span>
            <span className="text-xs text-ink-400 ml-auto">{Math.abs(dividedPct.forPct - dividedPct.againstPct)}% separates the Court</span>
          </div>
          <p className="font-serif text-lg text-ink-50 mb-3">"{divided.title}"</p>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-6 rounded-l-xl bg-forest-500 flex items-center justify-end px-2 text-xs font-bold text-white">{dividedPct.forPct}%</div>
            <div className="flex-1 h-6 rounded-r-xl bg-crimson-500 flex items-center justify-start px-2 text-xs font-bold text-white">{dividedPct.againstPct}%</div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-400">{formatNumber(divided.votesFor + divided.votesAgainst)} votes</span>
            <button onClick={() => openCase(divided.id)} className="text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors">Join the argument →</button>
          </div>
        </div>
      )}

      {/* Category filter chips */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
        <button onClick={() => setActiveFilter(null)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${!activeFilter ? 'bg-gold-500/15 text-gold-300 border border-gold-500/30' : 'bg-white/5 text-ink-300 border border-transparent'}`}>
          All
        </button>
        {filterChips.map((f) => (
          <button key={f.id} onClick={() => setActiveFilter(f.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${activeFilter === f.id ? 'bg-gold-500/15 text-gold-300 border border-gold-500/30' : 'bg-white/5 text-ink-300 border border-transparent'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Sort tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === t.id ? 'bg-gold-500/15 text-gold-300 border border-gold-500/30' : 'bg-white/5 text-ink-300 border border-transparent'
              }`}>
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Case list */}
      <div className="grid sm:grid-cols-2 gap-3">
        {sorted.map((c) => <CaseCard key={c.id} caseData={c} />)}
      </div>
      {sorted.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-ink-300 mb-2">No matters here yet.</p>
          <p className="text-sm text-ink-400">Be the first person to bring a matter.</p>
        </div>
      )}
    </div>
  );
}
