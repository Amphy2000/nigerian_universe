import { useState } from 'react';
import { Scale, Mic, AlertTriangle, CheckCircle2, ArrowLeft, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CATEGORIES } from '@/data/categories';
import { submitCaseToDB } from '@/lib/dataAccess';

export function SubmitPage() {
  const { setSubmittedCase, navigate, showToast } = useApp();
  const [step, setStep] = useState<'form' | 'voice' | 'confirm'>('form');
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    story: '',
    question: '',
    evidence: '',
    anonymous: true,
  });
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.category || !formData.story.trim()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      const caseNumber = await submitCaseToDB({
        category: formData.category,
        title: formData.title.trim(),
        story: formData.story.trim(),
        question: formData.question.trim() || formData.title.trim(),
        anonymous: formData.anonymous,
      });
      setSubmittedCase({
        caseNumber,
        category: formData.category,
        title: formData.title,
        story: formData.story,
        question: formData.question || formData.title,
        anonymous: formData.anonymous,
      });
      setStep('confirm');
    } catch (error) {
      console.error('Failed to submit case', error);
      showToast('Could not submit your matter. Please try again.', 'error');
    }
  };

  const startVoiceRecording = () => {
    setVoiceRecording(true);
    setVoiceTranscript('');
    const phrases = [
      'Guy, see what happened between me and my babe...',
      'So she came to my house and started cooking without asking...',
      'Then she said I should buy her a new phone because her screen broke...',
      'I said no, and now she\'s giving me attitude. Was I wrong?',
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i >= phrases.length) {
        clearInterval(interval);
        setVoiceRecording(false);
        return;
      }
      setVoiceTranscript((prev) => prev + (i === 0 ? '' : ' ') + phrases[i]);
      i++;
    }, 1200);
  };

  const transformVoice = () => {
    setFormData({
      title: 'Was he wrong for cancelling their plans without telling her?',
      category: 'relationship',
      story: voiceTranscript,
      question: 'Was he wrong for cancelling their plans without telling her?',
      evidence: '',
      anonymous: true,
    });
    setStep('form');
    showToast('AI has cleaned up your story into a court case', 'success');
  };

  if (step === 'confirm') {
    return <ConfirmationScreen onBack={() => { setStep('form'); navigate('court'); }} />;
  }

  return (
    <div className="pb-28 md:pb-12 max-w-2xl mx-auto">
      <div className="mb-6 text-center pt-4">
        <h1 className="font-display text-3xl font-extrabold mb-2">Got a Matter?</h1>
        <p className="font-serif text-lg text-ink-200 italic">Bring it before the people.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setStep('form')}
          className={`flex-1 btn py-3 text-sm ${step === 'form' ? 'bg-gold-500/15 text-gold-300 border border-gold-500/30' : 'bg-white/5 text-ink-300 border border-transparent'}`}
        >
          <Scale className="w-4 h-4" /> Write It
        </button>
        <button
          onClick={() => setStep('voice')}
          className={`flex-1 btn py-3 text-sm ${step === 'voice' ? 'bg-gold-500/15 text-gold-300 border border-gold-500/30' : 'bg-white/5 text-ink-300 border border-transparent'}`}
        >
          <Mic className="w-4 h-4" /> Call the Court
        </button>
      </div>

      {step === 'form' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Warning */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-crimson-500/10 border border-crimson-500/20">
            <AlertTriangle className="w-4.5 h-4.5 text-crimson-400 shrink-0 mt-0.5" />
            <p className="text-xs text-crimson-200 leading-relaxed">
              Do not post someone's phone number, address, private messages, passwords, or other sensitive personal information.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-200 mb-2">Your matter <span className="text-crimson-400">*</span></label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Give your matter a short title"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-200 mb-2">Category <span className="text-crimson-400">*</span></label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFormData({ ...formData, category: cat.id })}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    formData.category === cat.id
                      ? 'bg-gold-500/15 text-gold-300 border border-gold-500/30'
                      : 'bg-white/5 text-ink-300 border border-transparent hover:bg-white/10'
                  } ${cat.needsModeration ? 'opacity-70' : ''}`}
                >
                  <span>{cat.emoji}</span> {cat.label.replace(' Court', '')}
                </button>
              ))}
            </div>
            {formData.category === 'celebrity' && (
              <p className="text-xs text-gold-400/70 mt-2">Celebrity/public-figure cases require moderation before appearing in court.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-200 mb-2">What happened? <span className="text-crimson-400">*</span></label>
            <textarea
              value={formData.story}
              onChange={(e) => setFormData({ ...formData, story: e.target.value })}
              placeholder="Tell the court the full story..."
              className="input resize-none"
              rows={5}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-200 mb-2">What do you want Nigerians to decide?</label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="e.g. Am I wrong for this?"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-200 mb-2">Optional evidence</label>
            <textarea
              value={formData.evidence}
              onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
              placeholder="Any additional context, timelines, or links..."
              className="input resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-200 mb-2">Visibility</label>
            <div className="flex gap-2">
              <button
                onClick={() => setFormData({ ...formData, anonymous: true })}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                  formData.anonymous ? 'bg-white/10 text-ink-100 border border-white/20' : 'bg-white/5 text-ink-400 border border-transparent'
                }`}
              >
                Anonymous
              </button>
              <button
                onClick={() => setFormData({ ...formData, anonymous: false })}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                  !formData.anonymous ? 'bg-white/10 text-ink-100 border border-white/20' : 'bg-white/5 text-ink-400 border border-transparent'
                }`}
              >
                Public (show username)
              </button>
            </div>
          </div>

          <button onClick={handleSubmit} className="btn-primary w-full text-base py-4">
            <Scale className="w-5 h-5" /> Submit to the Court
          </button>

          <p className="text-xs text-ink-500 text-center leading-relaxed">
            Nigerian Court provides public opinion, not professional legal, medical, financial, or other expert advice.
          </p>
        </div>
      )}

      {step === 'voice' && (
        <div className="animate-fadeIn">
          <div className="card p-6 text-center mb-4">
            <p className="text-sm text-ink-300 mb-1">Don't know how to write your matter?</p>
            <p className="font-serif text-lg text-ink-100 italic mb-6">"Just tell the Court what happened."</p>

            {!voiceRecording && !voiceTranscript && (
              <button
                onClick={startVoiceRecording}
                className="w-24 h-24 rounded-full bg-gold-500/15 border-2 border-gold-500/30 flex items-center justify-center mx-auto hover:bg-gold-500/25 transition-all active:scale-95"
              >
                <Mic className="w-10 h-10 text-gold-400" />
              </button>
            )}

            {voiceRecording && (
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-24 h-24 flex items-center justify-center mx-auto">
                  <div className="absolute inset-0 rounded-full bg-crimson-500/20 animate-pulseRing" />
                  <div className="absolute inset-0 rounded-full bg-crimson-500/10 animate-pulseRing" style={{ animationDelay: '0.5s' }} />
                  <div className="w-20 h-20 rounded-full bg-crimson-500 flex items-center justify-center">
                    <Mic className="w-8 h-8 text-white" />
                  </div>
                </div>
                <p className="text-sm text-crimson-300 font-semibold animate-pulse">Listening...</p>
              </div>
            )}

            {voiceTranscript && (
              <div className="mt-6 text-left">
                <div className="bg-ink-900/50 rounded-2xl p-4 border border-white/5 mb-4">
                  <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-2">You said:</p>
                  <p className="text-sm text-ink-200 italic leading-relaxed">"{voiceTranscript}"</p>
                </div>
                {!voiceRecording && (
                  <div className="bg-gold-500/10 rounded-2xl p-4 border border-gold-500/20">
                    <p className="text-xs font-semibold text-gold-400 uppercase tracking-wide mb-2">AI has prepared:</p>
                    <p className="text-sm font-serif text-ink-50 mb-1">Was he wrong for cancelling their plans without telling her?</p>
                    <p className="text-xs text-ink-400">Relationship Court · Case ready for review</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {voiceTranscript && !voiceRecording && (
            <div className="flex gap-2">
              <button onClick={() => { setVoiceTranscript(''); }} className="btn-ghost flex-1 text-sm">
                <X className="w-4 h-4" /> Redo
              </button>
              <button onClick={transformVoice} className="btn-primary flex-1 text-sm">
                <CheckCircle2 className="w-4 h-4" /> Use This Case
              </button>
            </div>
          )}

          <p className="text-xs text-ink-500 text-center mt-4 leading-relaxed">
            The Court's AI will turn your messy story into a clean courtroom case. Future feature — simulated for this prototype.
          </p>
        </div>
      )}
    </div>
  );
}

function ConfirmationScreen({ onBack }: { onBack: () => void }) {
  const { submittedCase, showToast } = useApp();
  if (!submittedCase) return null;

  const shareText = `I just brought a matter to Nigerian Court. ${submittedCase.caseNumber} — "${submittedCase.question}" See what Nigeria decides.`;
  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'Nigerian Court', text: shareText }); } catch {}
    } else {
      navigator.clipboard.writeText(shareText);
      showToast('Link copied to clipboard', 'success');
    }
  };

  return (
    <div className="pb-28 md:pb-12 max-w-md mx-auto text-center pt-8 animate-scaleIn">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-3xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center animate-gavel">
          <Scale className="w-10 h-10 text-gold-400" />
        </div>
      </div>
      <h1 className="font-display text-2xl font-extrabold mb-2">Matter Received</h1>
      <p className="font-serif text-lg text-ink-200 italic mb-6">"Your matter has entered the court queue."</p>

      <div className="card p-5 text-left mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-sm font-bold text-gold-400">{submittedCase.caseNumber}</span>
          <span className="chip bg-gold-500/15 text-gold-300 border border-gold-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400" /> Awaiting Review
          </span>
        </div>
        <p className="text-sm text-ink-100 font-medium mb-1">{submittedCase.title}</p>
        <p className="text-xs text-ink-400">{submittedCase.anonymous ? 'Anonymous submission' : 'Public submission'}</p>
      </div>

      <div className="space-y-2 mb-6 text-left">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
          <CheckCircle2 className="w-4 h-4 text-forest-400 shrink-0" />
          <span className="text-sm text-ink-200">Matter submitted to court queue</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
          <div className="w-4 h-4 rounded-full border-2 border-gold-400/40 shrink-0" />
          <span className="text-sm text-ink-300">Awaiting moderation review</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 opacity-50">
          <div className="w-4 h-4 rounded-full border-2 border-ink-600 shrink-0" />
          <span className="text-sm text-ink-400">Case opens for voting</span>
        </div>
      </div>

      <button onClick={handleShare} className="btn-ghost w-full text-sm mb-3">
        Share My Case
      </button>
      <button onClick={onBack} className="btn-primary w-full text-sm">
        Back to Court
      </button>
    </div>
  );
}
