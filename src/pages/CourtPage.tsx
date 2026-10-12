import { useState } from 'react';
import { Scale, ArrowRight, Clock, Dice5, Archive, Trophy } from 'lucide-react';
import type { CourtCase } from '@/types';
import { useApp } from '@/context/AppContext';
import { CaseCard } from '@/components/CaseCard';
import { ChiefJudgeBanner } from '@/components/ChiefJudgeBanner';
import { Onboarding } from '@/components/Onboarding';
import {
  getCaseOfDay, getLiveCases, getDailyDocket, getMostDividedCase,
  getDividedCases, getCasesByCategory, getNowHearing, getUpNext, getComingToCourt,
} from '@/data/cases';
import { CATEGORIES } from '@/data/categories';
import { HALL_OF_FAME, getQuoteForContext } from '@/data/chiefJudge';
import { formatCountdown, formatNumber, getVerdictPercentages, getDividedLabel } from '@/utils/format';

export function CourtPage() {
  const { navigate, openCase, cases, peopleInCourt, liveViewers, openRandomCase, hasSeenOnboarding } = useApp();
  const caseOfDay = getCaseOfDay();
  const liveCases = getLiveCases().slice(0, 4);
  const docket = getDailyDocket();
  const divided = getMostDividedCase();
  const allDivided = getDividedCases();
  const nowHearing = getNowHearing();
  const upNext = getUpNext();
  const comingToCourt = getComingToCourt();
  const trending = cases.filter((c) => !c.featured).slice(0, 4);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categoryCases = selectedCategory ? getCasesByCategory(selectedCategory) : [];
  const cat = CATEGORIES.find((c) => c.id === selectedCategory);
  const dividedPct = getVerdictPercentages(divided);
  const dividedLabel = getDividedLabel(dividedPct.forPct, dividedPct.againstPct);

  if (!hasSeenOnboarding) {
    return <Onboarding />;
  }

  return (
    <div className="space-y-8 pb-28 md:pb-12">
      {/* Hero */}
      <section className="relative pt-6 pb-2">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold-500/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative text-center max-w-2xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-3xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
              <Scale className="w-8 h-8 text-gold-400" />
            </div>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            NIGERIAN <span className="text-gradient-gold">COURT</span>
          </h1>
          <p className="font-serif text-lg sm:text-xl text-ink-200 italic mb-4">
            The Court is in Session
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-500/10 border border-forest-500/20">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-forest-400" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-forest-400 animate-pulseRing" />
            </div>
            <span className="text-sm font-medium text-forest-300">
              {peopleInCourt.toLocaleString()} people are currently in court
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <button onClick={() => navigate('submit')} className="btn-primary">
              <Scale className="w-4 h-4" /> Bring Your Matter
            </button>
            <button onClick={() => openCase(caseOfDay.id)} className="btn-ghost">
              Enter the Court <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Chief Judge welcome */}
      <ChiefJudgeBanner quote={getQuoteForContext('caseOpen')} />

      {/* Case of the Day */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-5 h-5 text-gold-400" />
          <h2 className="font-display text-xl font-bold">Case of the Day</h2>
        </div>
        <CaseCard caseData={caseOfDay} variant="featured" />
      </section>

      {/* Live in Court */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-crimson-400" />
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-crimson-400 animate-pulseRing" />
          </div>
          <h2 className="font-display text-xl font-bold text-crimson-300">LIVE IN COURT</h2>
        </div>
        <p className="text-sm text-ink-400 mb-4">People are currently judging these matters.</p>
        <div className="space-y-2.5">
          {liveCases.map((c) => (
            <CaseCard key={c.id} caseData={c} variant="live" />
          ))}
        </div>
      </section>

      {/* Court is Currently Hearing */}
      <section>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Scale className="w-4 h-4 text-gold-400" />
            <h2 className="font-display text-lg font-bold">The Court is Currently Hearing</h2>
          </div>
          <div className="space-y-3">
            <HearingRow label="NOW HEARING" caseData={nowHearing} onClick={() => openCase(nowHearing.id)} active />
            {upNext && <HearingRow label="UP NEXT" caseData={upNext} onClick={() => openCase(upNext.id)} />}
            {comingToCourt && <HearingRow label="COMING TO COURT" caseData={comingToCourt} onClick={() => openCase(comingToCourt.id)} />}
          </div>
        </div>
      </section>

      {/* Today's Docket */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-4 h-4 text-gold-400" />
          <h2 className="font-display text-xl font-bold">Today's Docket</h2>
        </div>
        <p className="text-sm text-ink-400 mb-4">5 matters before the Court today.</p>
        <div className="space-y-2.5">
          {docket.map((c, i) => {
            const cat = CATEGORIES.find((ct) => ct.id === c.category);
            const statusIcon = c.status === 'in_session' ? '🟢' : c.status === 'verdict_pending' ? '🟡' : '⚫';
            return (
              <div
                key={c.id}
                onClick={() => openCase(c.id)}
                className="card p-4 cursor-pointer hover:border-white/15 transition-all flex items-center gap-4"
              >
                <div className="w-8 h-8 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-gold-400">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-ink-400">{c.caseNumber} · {cat?.label}</p>
                  <p className="text-sm font-medium text-ink-100 truncate">{c.title}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs">{statusIcon}</span>
                  <span className="text-xs text-ink-400">{c.status === 'in_session' ? 'IN SESSION' : c.status === 'verdict_pending' ? 'CLOSING SOON' : 'CLOSED'}</span>
                  {c.status !== 'closed' && <span className="text-xs text-gold-400 font-mono">{formatCountdown(c.closesAt)}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Random Matter */}
      <section>
        <button
          onClick={openRandomCase}
          className="w-full card p-5 hover:border-gold-500/30 transition-all group flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Dice5 className="w-6 h-6 text-gold-400" />
          </div>
          <div className="text-left">
            <p className="font-display text-base font-bold">Judge a Random Matter</p>
            <p className="text-xs text-ink-400">I wonder what Nigerians are arguing about right now...</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gold-400 ml-auto group-hover:translate-x-1 transition-transform" />
        </button>
      </section>

      {/* Court is Divided */}
      <section>
        <DividedSection
          caseData={divided}
          forPct={dividedPct.forPct}
          againstPct={dividedPct.againstPct}
          label={dividedLabel}
          onClick={() => openCase(divided.id)}
          allDivided={allDivided}
          onOpenCase={openCase}
        />
      </section>

      {/* Matters Trending */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-xl font-bold">Matters Trending</h2>
            <p className="text-sm text-ink-400 mt-0.5">What Nigeria is judging right now</p>
          </div>
          <button onClick={() => navigate('trending')} className="text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors">
            View all →
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {trending.map((c) => (
            <CaseCard key={c.id} caseData={c} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="font-display text-xl font-bold mb-4">Court Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {CATEGORIES.map((cat) => {
            const count = getCasesByCategory(cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="card p-4 text-left hover:border-gold-500/30 transition-all group"
              >
                <div className="text-2xl mb-1.5">{cat.emoji}</div>
                <p className="text-sm font-semibold text-ink-100 group-hover:text-white transition-colors">{cat.label}</p>
                <p className="text-xs text-ink-400 mt-0.5">{count} {count === 1 ? 'matter' : 'matters'}</p>
                {cat.needsModeration && (
                  <p className="text-[10px] text-gold-400/70 mt-1">Moderation required</p>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Category filter results */}
      {selectedCategory && cat && (
        <section className="animate-slideUp">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">{cat.emoji} {cat.label}</h2>
            <button onClick={() => setSelectedCategory(null)} className="text-sm text-ink-400 hover:text-ink-200 transition-colors">Close</button>
          </div>
          {categoryCases.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-3">
              {categoryCases.map((c) => (<CaseCard key={c.id} caseData={c} />))}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <p className="text-ink-300 mb-2">No matters here yet.</p>
              <p className="text-sm text-ink-400 mb-4">Be the first person to bring a matter to {cat.label}.</p>
              <button onClick={() => navigate('submit')} className="btn-primary text-sm">Bring Your Matter</button>
            </div>
          )}
        </section>
      )}

      {/* Hall of Fame */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-gold-400" />
          <h2 className="font-display text-xl font-bold">Hall of Fame</h2>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {HALL_OF_FAME.map((entry) => (
            <div
              key={entry.id}
              onClick={() => openCase(entry.caseId)}
              className="card p-4 cursor-pointer hover:border-gold-500/30 transition-all group"
            >
              <div className="text-2xl mb-1.5">{entry.emoji}</div>
              <p className="text-xs font-semibold text-gold-400 uppercase tracking-wide">{entry.label}</p>
              <p className="text-sm font-medium text-ink-100 mt-1 truncate group-hover:text-white transition-colors">{entry.title}</p>
              <p className="text-xs text-ink-400 mt-0.5">{entry.metric}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Archive link */}
      <section>
        <button onClick={() => navigate('archive')} className="w-full card p-5 hover:border-white/15 transition-all flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Archive className="w-6 h-6 text-ink-300" />
          </div>
          <div className="text-left">
            <p className="font-display text-base font-bold">Court Archives</p>
            <p className="text-xs text-ink-400">Browse closed cases and past verdicts</p>
          </div>
          <ArrowRight className="w-4 h-4 text-ink-400 ml-auto group-hover:translate-x-1 transition-transform" />
        </button>
      </section>

      {/* Footer */}
      <footer className="pt-8 pb-4 text-center border-t border-white/5">
        <p className="font-serif italic text-ink-300 text-sm mb-2">
          "We don't tell you what to think.<br />We show you what Nigerians think."
        </p>
        <p className="text-xs text-ink-500 max-w-md mx-auto">
          Nigerian Court provides public opinion, not professional legal, medical, financial, or other expert advice.
        </p>
      </footer>
    </div>
  );
}

function HearingRow({ label, caseData, onClick, active }: { label: string; caseData: { caseNumber: string; category: string; title: string }; onClick: () => void; active?: boolean }) {
  const cat = CATEGORIES.find((c) => c.id === caseData.category);
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left ${active ? 'bg-crimson-500/10 border border-crimson-500/20' : 'bg-white/5 border border-transparent hover:bg-white/10'}`}
    >
      <span className={`text-[10px] font-bold uppercase tracking-widest shrink-0 w-24 ${active ? 'text-crimson-300' : 'text-ink-400'}`}>{label}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-mono text-gold-400">{caseData.caseNumber}</p>
        <p className="text-sm text-ink-100 truncate">{cat?.emoji} {cat?.label.replace(' Court', '')}</p>
      </div>
      {active && (
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-crimson-400 animate-pulse" />
        </div>
      )}
    </button>
  );
}

function DividedSection({ caseData, forPct, againstPct, label, onClick, allDivided, onOpenCase }: {
  caseData: { id: string; caseNumber: string; title: string; votesFor: number; votesAgainst: number; forLabel: string; againstLabel: string };
  forPct: number; againstPct: number; label: ReturnType<typeof getDividedLabel>;
  onClick: () => void; allDivided: CourtCase[]; onOpenCase: (id: string) => void;
}) {
  if (!label) return null;
  return (
    <div className="card p-5 bg-crimson-500/5 border-crimson-500/15">
      <div className="flex items-center gap-2 mb-3">
        <span className="chip bg-crimson-500/15 text-crimson-300 border border-crimson-500/20">{label.emoji} {label.label}</span>
        <span className="text-xs text-ink-400 ml-auto">{Math.abs(forPct - againstPct)}% separates the Court</span>
      </div>
      <p className="font-serif text-lg text-ink-50 mb-3">"{caseData.title}"</p>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-6 rounded-l-xl bg-forest-500 flex items-center justify-end px-2 text-xs font-bold text-white">{forPct}%</div>
        <div className="flex-1 h-6 rounded-r-xl bg-crimson-500 flex items-center justify-start px-2 text-xs font-bold text-white">{againstPct}%</div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-ink-400">{formatNumber(caseData.votesFor + caseData.votesAgainst)} votes</span>
        <button onClick={onClick} className="text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors">
          Join the argument →
        </button>
      </div>
    </div>
  );
}
