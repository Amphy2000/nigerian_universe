import { Scale, Flame, MessageCircle, Clock, Eye, Users } from 'lucide-react';
import type { CourtCase } from '@/types';
import { getCategory } from '@/data/categories';
import { formatNumber, formatCountdown, getStatusBadge, getVerdictPercentages } from '@/utils/format';
import { useApp } from '@/context/AppContext';

interface Props {
  caseData: CourtCase;
  variant?: 'default' | 'featured' | 'compact' | 'live';
}

export function CaseCard({ caseData, variant = 'default' }: Props) {
  const { openCase, hasVoted, liveViewers } = useApp();
  const cat = getCategory(caseData.category);
  const badge = getStatusBadge(caseData.status);
  const voted = hasVoted(caseData.id);
  const { forPct, againstPct, total } = getVerdictPercentages(caseData);
  const viewers = liveViewers[caseData.id] || 0;

  if (variant === 'live') {
    return (
      <div
        onClick={() => openCase(caseData.id)}
        className="card p-4 cursor-pointer hover:border-crimson-500/30 transition-all group"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gold-400 font-semibold">{caseData.caseNumber}</span>
            <span className="text-sm">{cat?.emoji}</span>
            <span className="text-xs text-ink-400">{cat?.label.replace(' Court', '')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="relative">
              <div className="w-1.5 h-1.5 rounded-full bg-crimson-400" />
              <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-crimson-400 animate-pulseRing" />
            </div>
            <span className="text-[10px] font-bold text-crimson-400">{viewers} judging</span>
          </div>
        </div>
        <p className="font-serif text-sm leading-snug text-ink-50 group-hover:text-white transition-colors mb-2">
          "{caseData.hook || caseData.story.slice(0, 100)}..."
        </p>
        <div className="flex items-center gap-3 text-xs text-ink-300">
          <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-gold-400" /> {formatNumber(total)}</span>
          <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {formatNumber(caseData.argumentsCount)}</span>
          {caseData.status !== 'closed' && (
            <span className="flex items-center gap-1 ml-auto"><Clock className="w-3 h-3 text-gold-400" /> {formatCountdown(caseData.closesAt)}</span>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div
        onClick={() => openCase(caseData.id)}
        className="card p-5 sm:p-6 cursor-pointer hover:border-gold-500/30 transition-all duration-300 group relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/5 rounded-full blur-3xl -translate-y-20 translate-x-20" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gold-400 font-semibold">{caseData.caseNumber}</span>
              <span className="text-lg">{cat?.emoji}</span>
              <span className="text-xs font-semibold text-ink-300">{cat?.label}</span>
            </div>
            <span className={`chip border ${badge.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${badge.dot} ${caseData.status === 'in_session' ? 'animate-pulse' : ''}`} />
              {badge.label}
            </span>
          </div>

          {caseData.hook && (
            <p className="font-display text-sm font-bold uppercase tracking-wide text-gold-300 mb-2">
              {caseData.hook}
            </p>
          )}

          <p className="font-serif text-lg sm:text-xl leading-snug mb-4 text-ink-50">
            "{caseData.story.slice(0, 160)}{caseData.story.length > 160 ? '...' : ''}"
          </p>

          {caseData.twist && (
            <div className="flex items-center gap-2 mb-3 text-xs text-gold-400/80">
              <span>⚠️ There's more to this story</span>
            </div>
          )}

          {voted && (
            <div className="mb-4 animate-scaleIn">
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-forest-300">{caseData.forLabel} {forPct}%</span>
                <span className="text-crimson-300">{againstPct}% {caseData.againstLabel}</span>
              </div>
              <div className="flex h-3 rounded-full overflow-hidden bg-ink-900">
                <div className="bg-forest-500 transition-all duration-1000" style={{ width: `${forPct}%` }} />
                <div className="bg-crimson-500 transition-all duration-1000" style={{ width: `${againstPct}%` }} />
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 text-xs text-ink-300 mb-4">
            <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-gold-400" /> {formatNumber(total)} verdicts</span>
            <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {formatNumber(caseData.argumentsCount)}</span>
            {caseData.status !== 'closed' && (
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {formatCountdown(caseData.closesAt)}</span>
            )}
          </div>

          <button className="btn-primary w-full sm:w-auto text-sm">
            Enter Court →
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        onClick={() => openCase(caseData.id)}
        className="card p-4 cursor-pointer hover:border-white/15 transition-all flex items-start gap-3"
      >
        <span className="text-2xl shrink-0">{cat?.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-mono text-gold-400 mb-0.5">{caseData.caseNumber}</p>
          <p className="text-sm font-medium text-ink-100 truncate">{caseData.title}</p>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-ink-400">
            <span className="flex items-center gap-1"><Flame className="w-3 h-3" /> {formatNumber(caseData.votesFor + caseData.votesAgainst)}</span>
            <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {formatNumber(caseData.argumentsCount)}</span>
          </div>
        </div>
        <span className={`chip border shrink-0 ${badge.color} text-[10px]`}>{badge.label}</span>
      </div>
    );
  }

  return (
    <div
      onClick={() => openCase(caseData.id)}
      className="card p-5 cursor-pointer hover:border-white/15 hover:shadow-xl hover:shadow-black/30 transition-all duration-300 group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gold-400 font-semibold">{caseData.caseNumber}</span>
          <span className="text-sm">{cat?.emoji}</span>
        </div>
        <span className={`chip border ${badge.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot} ${caseData.status === 'in_session' ? 'animate-pulse' : ''}`} />
          {badge.label}
        </span>
      </div>

      {caseData.hook && (
        <p className="font-display text-xs font-bold uppercase tracking-wide text-gold-300/80 mb-2">
          {caseData.hook}
        </p>
      )}

      <p className="font-serif text-base leading-snug mb-3 text-ink-50 group-hover:text-white transition-colors">
        "{caseData.story.slice(0, 120)}{caseData.story.length > 120 ? '...' : ''}"
      </p>

      {caseData.twist && (
        <div className="flex items-center gap-1.5 mb-2 text-[11px] text-gold-400/70">
          <span>⚠️ There's more to this story</span>
        </div>
      )}

      {voted && (
        <div className="mb-3">
          <div className="flex h-2 rounded-full overflow-hidden bg-ink-900">
            <div className="bg-forest-500 transition-all duration-1000" style={{ width: `${forPct}%` }} />
            <div className="bg-crimson-500 transition-all duration-1000" style={{ width: `${againstPct}%` }} />
          </div>
          <div className="flex items-center justify-between text-[10px] font-semibold mt-1 text-ink-400">
            <span>{forPct}%</span>
            <span>{againstPct}%</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-ink-300">
        <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-gold-400" /> {formatNumber(caseData.votesFor + caseData.votesAgainst)}</span>
        <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {formatNumber(caseData.argumentsCount)}</span>
        <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {formatNumber(caseData.views)}</span>
        {caseData.status !== 'closed' && (
          <span className="flex items-center gap-1 ml-auto"><Clock className="w-3.5 h-3.5 text-gold-400" /> {formatCountdown(caseData.closesAt)}</span>
        )}
      </div>
    </div>
  );
}
