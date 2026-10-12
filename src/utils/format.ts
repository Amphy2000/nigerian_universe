export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function formatCountdown(closesAt: string): string {
  const ms = new Date(closesAt).getTime() - Date.now();
  if (ms <= 0) return 'Verdict ready';
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function getTimeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const h = Math.floor(ms / 3600_000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function getVerdictPercentages(c: { votesFor: number; votesAgainst: number }) {
  const total = c.votesFor + c.votesAgainst;
  if (total === 0) return { forPct: 50, againstPct: 50, total: 0 };
  return {
    forPct: Math.round((c.votesFor / total) * 100),
    againstPct: Math.round((c.votesAgainst / total) * 100),
    total,
  };
}

export function getDividedLabel(forPct: number, againstPct: number): { label: string; emoji: string; text: string } | null {
  const diff = Math.abs(forPct - againstPct);
  if (diff > 20) return null;
  if (diff <= 3) return { label: 'DEADLOCK', emoji: '🔥', text: 'The Court is deadlocked.' };
  if (diff <= 8) return { label: 'COURT DIVIDED', emoji: '⚔️', text: 'The Court is divided.' };
  if (diff <= 15) return { label: 'CONTROVERSIAL', emoji: '👀', text: 'This matter is controversial.' };
  return { label: 'CHAOS IN THE COURT', emoji: '💀', text: 'Chaos in the Court.' };
}

export function getStatusBadge(status: string): { label: string; color: string; dot: string } {
  switch (status) {
    case 'new':
      return { label: 'NEW', color: 'text-forest-300 bg-forest-500/15 border-forest-500/30', dot: 'bg-forest-400' };
    case 'in_session':
      return { label: 'IN SESSION', color: 'text-crimson-300 bg-crimson-500/15 border-crimson-500/30', dot: 'bg-crimson-400' };
    case 'verdict_pending':
      return { label: 'VERDICT PENDING', color: 'text-gold-300 bg-gold-500/15 border-gold-500/30', dot: 'bg-gold-400' };
    case 'closed':
      return { label: 'CASE CLOSED', color: 'text-ink-300 bg-ink-700/50 border-white/10', dot: 'bg-ink-400' };
    default:
      return { label: 'NEW', color: 'text-forest-300 bg-forest-500/15 border-forest-500/30', dot: 'bg-forest-400' };
  }
}
