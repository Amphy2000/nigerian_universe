import { Gavel } from 'lucide-react';

interface Props {
  quote: string;
  className?: string;
}

export function ChiefJudgeBanner({ quote, className = '' }: Props) {
  return (
    <div className={`flex items-center gap-3 p-3.5 rounded-2xl bg-gold-500/8 border border-gold-500/15 ${className}`}>
      <div className="w-9 h-9 rounded-xl bg-gold-500/15 border border-gold-500/25 flex items-center justify-center shrink-0">
        <Gavel className="w-4.5 h-4.5 text-gold-400" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-gold-400 uppercase tracking-widest">The Chief Judge</p>
        <p className="text-sm text-ink-100 font-serif italic leading-snug">{quote}</p>
      </div>
    </div>
  );
}
