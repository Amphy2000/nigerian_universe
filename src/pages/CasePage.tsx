import { useEffect, useState } from 'react';
import {
  ArrowLeft, Scale, Flame, MessageCircle, Clock, Eye, CheckCircle2,
  ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, Heart, CornerDownRight,
  FolderOpen, Share2, Flag, Gavel, AlertTriangle, Trophy, Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getCategory } from '@/data/categories';
import { getArgumentOfDay } from '@/data/mockData';
import { REPORT_REASONS } from '@/data/mockData';
import { getQuoteForContext } from '@/data/chiefJudge';
import { formatNumber, formatCountdown, getStatusBadge, getVerdictPercentages, getDividedLabel } from '@/utils/format';
import { ChiefJudgeBanner } from '@/components/ChiefJudgeBanner';
import type { Comment } from '@/types';

export function CasePage() {
  const { currentCase, closeCase, hasVoted, getVote, castVote, comments, addComment, likeComment, agreeComment, showToast, liveViewers } = useApp();
  const [verdictRevealed, setVerdictRevealed] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);
  const [showTwist, setShowTwist] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentSide, setCommentSide] = useState<'prosecution' | 'defence' | 'neutral'>('neutral');
  const [commentFilter, setCommentFilter] = useState<'top' | 'new' | 'prosecution' | 'defence'>('top');
  const [showReport, setShowReport] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);

  const c = currentCase;
  const voted = c ? hasVoted(c.id) : false;
  const userVote = c ? getVote(c.id) : null;

  useEffect(() => {
    setVerdictRevealed(false);
    setShowTwist(false);
  }, [c?.id]);

  if (!c) return null;

  const cat = getCategory(c.category);
  const badge = getStatusBadge(c.status);
  const { forPct, againstPct, total } = getVerdictPercentages(c);
  const caseComments = comments.filter((cm) => cm.caseId === c.id);
  const argOfDay = getArgumentOfDay(c.id);
  const viewers = liveViewers[c.id] || 0;
  const dividedLabel = getDividedLabel(forPct, againstPct);

  const showVerdict = voted || c.status === 'closed' || verdictRevealed;
  const winnerSide = forPct > againstPct ? 'for' : 'against';
  const userInMajority = userVote ? (userVote === winnerSide) : null;

  const handleVote = (side: 'for' | 'against') => {
    if (voted) return;
    castVote(c.id, side);
    setTimeout(() => setVerdictRevealed(true), 300);
  };

  const handleShareWhatsApp = () => {
    const text = `⚖️ NIGERIAN COURT\n${c.caseNumber}\n${c.hook}\n${c.forLabel.toUpperCase()} or ${c.againstLabel.toUpperCase()}?\nNigerians are currently judging this matter.\n👇 ENTER THE COURT`;
    if (navigator.share) {
      navigator.share({ title: 'Nigerian Court', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      showToast('Share message copied to clipboard', 'success');
    }
  };

  const handleShareVerdict = async () => {
    const winner = forPct > againstPct ? c.forLabel : c.againstLabel;
    const winnerPct = Math.max(forPct, againstPct);
    const text = `⚖️ NIGERIAN COURT — ${c.caseNumber}\nTHE PEOPLE HAVE SPOKEN.\n${winnerPct}% say: ${winner.toUpperCase()}\n${formatNumber(total)} Nigerians voted.\nCASE CLOSED.`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Nigerian Court', text }); } catch {}
    } else {
      navigator.clipboard.writeText(text);
      showToast('Verdict copied to clipboard', 'success');
    }
  };

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    addComment(c.id, commentText.trim(), commentSide);
    setCommentText('');
    showToast('Your argument has been submitted to the court', 'success');
  };

  const filteredComments = (() => {
    let list = [...caseComments];
    if (commentFilter === 'top') list.sort((a, b) => b.likes - a.likes);
    else if (commentFilter === 'new') list.sort((a, b) => (a.createdAt === 'just now' ? -1 : 0));
    else if (commentFilter === 'prosecution') list = list.filter((cm) => cm.side === 'prosecution');
    else if (commentFilter === 'defence') list = list.filter((cm) => cm.side === 'defence');
    return list;
  })();

  return (
    <div className="pb-28 md:pb-12 animate-fadeIn">
      {/* Back bar */}
      <div className="sticky top-0 z-30 bg-ink-950/80 backdrop-blur-xl border-b border-white/5 -mx-4 px-4 py-3 sm:-mx-6 sm:px-6 mb-4 flex items-center justify-between">
        <button onClick={closeCase} className="flex items-center gap-2 text-sm text-ink-300 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Court
        </button>
        <div className="flex items-center gap-3">
          <button onClick={handleShareWhatsApp} className="text-ink-400 hover:text-gold-400 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          <button onClick={() => setShowReport(true)} className="text-ink-400 hover:text-crimson-400 transition-colors">
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Case header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-9 h-9 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
            <Scale className="w-4.5 h-4.5 text-gold-400" />
          </div>
          <div>
            <p className="font-mono text-sm font-bold text-gold-400">{c.caseNumber}</p>
            <p className="text-xs text-ink-400">{cat?.emoji} {cat?.label}</p>
          </div>
        </div>
        <span className={`chip border ${badge.color} mb-3 inline-flex`}>
          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot} ${c.status === 'in_session' ? 'animate-pulse' : ''}`} />
          {badge.label}
        </span>
        {c.hook && (
          <p className="font-display text-sm font-bold uppercase tracking-wide text-gold-300 mb-2">{c.hook}</p>
        )}
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-ink-50 leading-tight mb-3">
          "{c.title}"
        </h1>
        <div className="flex items-center gap-4 text-xs text-ink-400 flex-wrap">
          <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-gold-400" /> {formatNumber(total)} verdicts</span>
          <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {formatNumber(c.argumentsCount)} arguments</span>
          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {formatNumber(c.views)}</span>
          {c.status !== 'closed' && viewers > 0 && (
            <span className="flex items-center gap-1 text-crimson-300">
              <div className="relative"><div className="w-1.5 h-1.5 rounded-full bg-crimson-400" /><div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-crimson-400 animate-pulseRing" /></div>
              {viewers} judging now
            </span>
          )}
          {c.status !== 'closed' && (
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gold-400" /> {formatCountdown(c.closesAt)}</span>
          )}
        </div>
      </div>

      {/* Chief Judge on case open */}
      <div className="mb-4">
        <ChiefJudgeBanner quote={getQuoteForContext('caseOpen', c.id.charCodeAt(2))} />
      </div>

      {/* Story */}
      <div className="card p-5 mb-4">
        <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-3">The Matter</p>
        <p className="text-ink-100 leading-relaxed">{c.story}</p>
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
          <span className="text-xs text-ink-400">Submitted by</span>
          <span className="text-sm font-medium text-ink-200">{c.authorAnon ? 'Anonymous' : c.authorName}</span>
        </div>
      </div>

      {/* The Twist */}
      {c.twist && (
        <div className="card mb-4 overflow-hidden border-gold-500/15">
          <button
            onClick={() => setShowTwist(!showTwist)}
            className="w-full p-4 flex items-center justify-between hover:bg-gold-500/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-gold-400" />
              <span className="text-sm font-semibold text-gold-300">{c.twist.label}</span>
            </div>
            {showTwist ? <ChevronUp className="w-4 h-4 text-gold-400" /> : <ChevronDown className="w-4 h-4 text-gold-400" />}
          </button>
          {showTwist && (
            <div className="px-4 pb-4 animate-slideDown">
              <p className="text-sm text-ink-200 italic leading-relaxed">{c.twist.content}</p>
            </div>
          )}
        </div>
      )}

      {/* The Verdict */}
      <div className="card p-6 mb-4 relative overflow-hidden">
        {!showVerdict ? (
          <div className="text-center">
            <p className="text-xs font-semibold text-gold-400 uppercase tracking-widest mb-1">Deliver Your Verdict</p>
            <p className="font-serif text-xl text-ink-50 mb-1">{c.question}</p>
            <p className="text-xs text-ink-500 mb-6">Vote first. See what Nigeria thinks after.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <button
                onClick={() => handleVote('for')}
                className="flex-1 btn bg-forest-500 hover:bg-forest-400 text-white py-5 text-base shadow-lg shadow-forest-500/20 active:scale-95 transition-all"
              >
                <Scale className="w-5 h-5" /> {c.forLabel}
              </button>
              <button
                onClick={() => handleVote('against')}
                className="flex-1 btn bg-crimson-500 hover:bg-crimson-400 text-white py-5 text-base shadow-lg shadow-crimson-500/20 active:scale-95 transition-all"
              >
                <Scale className="w-5 h-5" /> {c.againstLabel}
              </button>
            </div>
          </div>
        ) : (
          <VerdictReveal
            forLabel={c.forLabel}
            againstLabel={c.againstLabel}
            forPct={forPct}
            againstPct={againstPct}
            total={total}
            userVote={userVote}
            userInMajority={userInMajority}
            dividedLabel={dividedLabel}
            onShare={() => setShowShareCard(true)}
            closed={c.status === 'closed'}
          />
        )}
      </div>

      {/* Divided label */}
      {showVerdict && dividedLabel && (
        <div className="mb-4">
          <ChiefJudgeBanner quote={dividedLabel.text} />
        </div>
      )}

      {/* Courtroom Timeline */}
      <div className="card p-5 mb-4">
        <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-4">Case Timeline</p>
        <div className="space-y-3">
          {c.timeline.map((event) => (
            <div key={event.id} className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                event.done ? 'bg-forest-500/20 border border-forest-500/30'
                  : event.current ? 'bg-gold-500/20 border border-gold-500/40'
                  : 'bg-ink-700/50 border border-white/10'
              }`}>
                {event.done ? <CheckCircle2 className="w-3.5 h-3.5 text-forest-400" />
                  : event.current ? <div className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                  : <div className="w-2 h-2 rounded-full bg-ink-500" />}
              </div>
              <span className={`text-sm ${event.done ? 'text-ink-200' : event.current ? 'text-gold-300 font-medium' : 'text-ink-500'}`}>{event.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence */}
      <div className="card mb-4 overflow-hidden">
        <button onClick={() => setShowEvidence(!showEvidence)} className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4.5 h-4.5 text-gold-400" />
            <span className="text-sm font-semibold">Evidence</span>
            <span className="chip bg-white/5 text-ink-300 text-[10px]">{c.evidence.length} items</span>
          </div>
          {showEvidence ? <ChevronUp className="w-4 h-4 text-ink-400" /> : <ChevronDown className="w-4 h-4 text-ink-400" />}
        </button>
        {showEvidence && (
          <div className="px-5 pb-5 space-y-3 animate-slideDown">
            <p className="text-sm text-ink-400 italic mb-3">Have more context? The court is listening.</p>
            {c.evidence.map((e) => (
              <div key={e.id} className="bg-ink-900/50 rounded-2xl p-4 border border-white/5">
                <p className="text-xs font-semibold text-gold-400 uppercase tracking-wide mb-1">{e.label}</p>
                <p className="text-sm text-ink-200">{e.content}</p>
                {e.type === 'screenshot' && (
                  <div className="mt-3 h-32 rounded-xl bg-ink-800 border border-dashed border-white/10 flex items-center justify-center">
                    <span className="text-xs text-ink-500">Screenshot placeholder</span>
                  </div>
                )}
              </div>
            ))}
            <button onClick={() => showToast('Evidence request sent to the submitter', 'info')} className="btn-ghost w-full text-sm">Request More Evidence</button>
          </div>
        )}
      </div>

      {/* Argument of the Day */}
      {argOfDay && showVerdict && (
        <div className="card p-5 mb-4 bg-gold-500/5 border-gold-500/15">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-gold-400" />
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">Argument of the Day</span>
          </div>
          <p className="font-serif text-base text-ink-50 italic leading-relaxed mb-3">"{argOfDay.text}"</p>
          <div className="flex items-center gap-3 text-xs">
            <span className="font-semibold text-ink-200">{argOfDay.author}</span>
            <span className={`chip ${argOfDay.side === 'prosecution' ? 'bg-crimson-500/15 text-crimson-300' : 'bg-forest-500/15 text-forest-300'}`}>
              {argOfDay.side === 'prosecution' ? '⚔️ PROSECUTION' : '🛡️ DEFENCE'}
            </span>
            <span className="flex items-center gap-1 text-ink-400 ml-auto"><Heart className="w-3 h-3" /> {formatNumber(argOfDay.likes)}</span>
          </div>
        </div>
      )}

      {/* Courtroom Arguments */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-5 h-5 text-gold-400" />
          <h2 className="font-display text-xl font-bold">Courtroom Arguments</h2>
          <span className="chip bg-white/5 text-ink-300 text-xs">{formatNumber(caseComments.length)}</span>
        </div>

        {/* Comment tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
          {([
            { id: 'top', label: '🔥 Top' },
            { id: 'new', label: '🆕 Newest' },
            { id: 'prosecution', label: '⚔️ Prosecution' },
            { id: 'defence', label: '🛡️ Defence' },
          ] as const).map((tab) => (
            <button key={tab.id} onClick={() => setCommentFilter(tab.id)}
              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                commentFilter === tab.id ? 'bg-gold-500/15 text-gold-300 border border-gold-500/30' : 'bg-white/5 text-ink-300 border border-transparent'
              }`}>{tab.label}</button>
          ))}
        </div>

        {/* Add comment */}
        <div className="card p-4 mb-4">
          <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-3">What's your argument?</p>
          <div className="flex gap-2 mb-3">
            {([
              { id: 'defence' as const, label: '🛡️ Defence' },
              { id: 'prosecution' as const, label: '⚔️ Prosecution' },
            ]).map((s) => (
              <button key={s.id} onClick={() => setCommentSide(s.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                  commentSide === s.id
                    ? s.id === 'prosecution' ? 'bg-crimson-500/20 text-crimson-300 border border-crimson-500/30'
                      : 'bg-forest-500/20 text-forest-300 border border-forest-500/30'
                    : 'text-ink-400 border border-transparent'
                }`}>{s.label}</button>
            ))}
          </div>
          <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)}
            placeholder="Make your argument before the court..." className="input resize-none" rows={3} />
          <div className="flex justify-end mt-3">
            <button onClick={handleSubmitComment} disabled={!commentText.trim()} className="btn-primary text-sm">
              <Gavel className="w-4 h-4" /> Submit Argument
            </button>
          </div>
        </div>

        {/* Comment list */}
        <div className="space-y-3">
          {filteredComments.length > 0 ? (
            filteredComments.map((cm) => (<CommentItem key={cm.id} comment={cm} onLike={() => likeComment(cm.id)} onAgree={() => agreeComment(cm.id)} />))
          ) : (
            <div className="card p-8 text-center">
              <p className="text-ink-300 mb-1">No arguments here yet.</p>
              <p className="text-sm text-ink-400">Be the first to argue before the court.</p>
            </div>
          )}
        </div>
      </div>

      {/* Report modal */}
      {showReport && <ReportModal onClose={() => setShowReport(false)} onReport={() => { setShowReport(false); showToast('Report submitted. Thank you.', 'success'); }} />}

      {/* Share card */}
      {showShareCard && (
        <ShareCard caseNumber={c.caseNumber} winner={forPct > againstPct ? c.forLabel : c.againstLabel}
          winnerPct={Math.max(forPct, againstPct)} total={total} onShare={handleShareVerdict} onClose={() => setShowShareCard(false)} />
      )}
    </div>
  );
}

function VerdictReveal({ forLabel, againstLabel, forPct, againstPct, total, userVote, userInMajority, dividedLabel, onShare, closed }: {
  forLabel: string; againstLabel: string; forPct: number; againstPct: number;
  total: number; userVote: 'for' | 'against' | null; userInMajority: boolean | null;
  dividedLabel: ReturnType<typeof getDividedLabel> | null; onShare: () => void; closed: boolean;
}) {
  const winner = forPct > againstPct ? forLabel : againstLabel;
  const winnerPct = Math.max(forPct, againstPct);
  const loserPct = Math.min(forPct, againstPct);
  const winnerIsFor = forPct > againstPct;
  const userPct = userVote === 'for' ? forPct : userVote === 'against' ? againstPct : null;

  return (
    <div className="text-center animate-scaleIn">
      <p className="text-xs font-semibold text-gold-400 uppercase tracking-widest mb-4">The People's Verdict</p>
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-3xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center animate-gavel">
          <Gavel className="w-8 h-8 text-gold-400" />
        </div>
      </div>
      <p className="font-display text-3xl font-extrabold mb-1">{winnerPct}%</p>
      <p className="font-serif text-lg text-ink-100 mb-1">say {winner}</p>
      <p className="text-sm text-ink-400 mb-6">{loserPct}% say {winnerIsFor ? againstLabel : forLabel}</p>

      <div className="flex h-4 rounded-full overflow-hidden bg-ink-900 mb-6 max-w-md mx-auto">
        <div className={`${winnerIsFor ? 'bg-forest-500' : 'bg-crimson-500'} transition-all duration-[1200ms] ease-out`} style={{ width: `${winnerPct}%` }} />
        <div className={`${winnerIsFor ? 'bg-crimson-500' : 'bg-forest-500'} transition-all duration-[1200ms] ease-out`} style={{ width: `${loserPct}%` }} />
      </div>

      <p className="text-xs text-ink-400 mb-1">{formatNumber(total)} total verdicts</p>
      {userVote && userPct !== null && (
        <p className={`text-sm mb-4 ${userInMajority ? 'text-forest-300' : 'text-gold-300'}`}>
          {userInMajority ? `You voted with ${userPct}% of the Court.` : `👀 You and ${userPct}% of the Court disagree.`}
        </p>
      )}

      <p className="font-serif text-xl text-gold-300 italic mb-6">{closed ? "Case Closed." : "The People Have Spoken."}</p>
      <button onClick={onShare} className="btn-primary text-sm mx-auto">
        <Share2 className="w-4 h-4" /> Share the Verdict
      </button>
    </div>
  );
}

function CommentItem({ comment, onLike, onAgree }: { comment: Comment; onLike: () => void; onAgree: () => void; }) {
  const [showReplies, setShowReplies] = useState(false);
  const sideColor = comment.side === 'prosecution' ? 'border-l-crimson-500/40' : comment.side === 'defence' ? 'border-l-forest-500/40' : 'border-l-white/10';
  const sideLabel = comment.side === 'prosecution' ? '⚔️ PROSECUTION' : comment.side === 'defence' ? '🛡️ DEFENCE' : '';

  return (
    <div className={`card p-4 border-l-2 ${sideColor}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{comment.avatar}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-sm font-semibold text-ink-100">{comment.author}</span>
            {comment.top && <span className="chip bg-gold-500/10 text-gold-400 text-[10px]">🔥 TOP</span>}
            {sideLabel && <span className={`chip text-[10px] ${comment.side === 'prosecution' ? 'bg-crimson-500/10 text-crimson-300' : 'bg-forest-500/10 text-forest-300'}`}>{sideLabel}</span>}
            <span className="text-xs text-ink-500 ml-auto">{comment.createdAt}</span>
          </div>
          <p className="text-sm text-ink-200 leading-relaxed mb-3">{comment.text}</p>
          <div className="flex items-center gap-4 text-xs flex-wrap">
            <button onClick={onLike} className="flex items-center gap-1 text-ink-400 hover:text-crimson-400 transition-colors"><Heart className="w-3.5 h-3.5" /> {comment.likes}</button>
            <button onClick={onAgree} className="flex items-center gap-1 text-ink-400 hover:text-forest-400 transition-colors"><ThumbsUp className="w-3.5 h-3.5" /> Agree {comment.agrees}</button>
            <button className="flex items-center gap-1 text-ink-400 hover:text-crimson-400 transition-colors"><ThumbsDown className="w-3.5 h-3.5" /> {comment.disagrees}</button>
            {comment.replies > 0 && (
              <button onClick={() => setShowReplies(!showReplies)} className="flex items-center gap-1 text-ink-400 hover:text-ink-200 transition-colors ml-auto">
                <CornerDownRight className="w-3.5 h-3.5" /> {comment.replies} {comment.replies === 1 ? 'reply' : 'replies'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportModal({ onClose, onReport }: { onClose: () => void; onReport: () => void; }) {
  const [reason, setReason] = useState<string | null>(null);
  return (
    <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div className="card p-5 w-full max-w-sm animate-slideUp" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display text-lg font-bold mb-1">Report this matter</h3>
        <p className="text-sm text-ink-400 mb-4">Help keep the court fair and safe.</p>
        <div className="space-y-2 mb-4">
          {REPORT_REASONS.map((r) => (
            <button key={r} onClick={() => setReason(r)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                reason === r ? 'bg-crimson-500/15 text-crimson-200 border border-crimson-500/30' : 'bg-white/5 text-ink-200 border border-transparent hover:bg-white/10'
              }`}>{r}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="btn-ghost flex-1 text-sm">Cancel</button>
          <button onClick={onReport} disabled={!reason} className="btn bg-crimson-500 hover:bg-crimson-400 text-white flex-1 text-sm">Submit Report</button>
        </div>
      </div>
    </div>
  );
}

function ShareCard({ caseNumber, winner, winnerPct, total, onShare, onClose }: {
  caseNumber: string; winner: string; winnerPct: number; total: number; onShare: () => void; onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div className="w-full max-w-sm animate-scaleIn" onClick={(e) => e.stopPropagation()}>
        <div className="card p-8 text-center bg-gradient-to-b from-ink-800 to-ink-900 border-gold-500/20">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center"><Scale className="w-7 h-7 text-gold-400" /></div>
          </div>
          <p className="font-display text-sm font-bold tracking-widest text-gold-400 mb-1">NIGERIAN COURT</p>
          <p className="font-mono text-xs text-ink-400 mb-4">{caseNumber}</p>
          <p className="font-serif text-lg italic text-ink-100 mb-4">The People Have Spoken.</p>
          <p className="font-display text-4xl font-extrabold text-gradient-gold mb-1">{winnerPct}%</p>
          <p className="font-serif text-lg text-ink-100 mb-4">say {winner}</p>
          <p className="text-sm text-ink-400 mb-6">{formatNumber(total)} Nigerians voted.</p>
          <p className="font-display text-sm font-bold text-gold-300 tracking-widest mb-6">CASE CLOSED.</p>
          <button onClick={onShare} className="btn-primary w-full text-sm"><Share2 className="w-4 h-4" /> Share the Verdict</button>
          <button onClick={onClose} className="text-sm text-ink-400 hover:text-ink-200 transition-colors mt-3">Close</button>
        </div>
      </div>
    </div>
  );
}
