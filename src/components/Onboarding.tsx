import { useState } from 'react';
import { Scale, ArrowRight, MessageCircle, Gavel, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getCaseOfDay } from '@/data/cases';

export function Onboarding() {
  const { completeOnboarding, openCase } = useApp();
  const [step, setStep] = useState(0);

  const caseOfDay = getCaseOfDay();

  const steps = [
    {
      icon: <Scale className="w-12 h-12 text-gold-400" />,
      title: 'WELCOME TO NIGERIAN COURT',
      subtitle: 'Everyone has an opinion. Now Nigeria gets to hear yours.',
      cta: 'How it works',
    },
    {
      icon: null,
      title: 'HOW IT WORKS',
      steps: [
        { icon: '📝', text: 'Someone brings a matter.' },
        { icon: '⚖️', text: 'The Court hears both sides.' },
        { icon: '🗳️', text: 'Nigerians deliver their verdict.' },
        { icon: '📢', text: 'The people decide.' },
      ],
      cta: 'Enter the Court',
    },
  ];

  const current = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      completeOnboarding();
      openCase(caseOfDay.id);
    }
  };

  return (
    <div className="fixed inset-0 z-[95] bg-ink-950/95 backdrop-blur-xl flex items-center justify-center p-6 animate-fadeIn">
      <div className="w-full max-w-sm text-center animate-scaleIn">
        {step === 0 && (
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-3xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center">
              <Scale className="w-10 h-10 text-gold-400" />
            </div>
          </div>
        )}

        <h1 className="font-display text-2xl font-extrabold mb-3">{current.title}</h1>
        <p className="font-serif text-base text-ink-200 italic mb-6">{current.subtitle}</p>

        {step === 1 && (
          <div className="space-y-3 mb-8 text-left">
            {current.steps?.map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 animate-slideUp" style={{ animationDelay: `${i * 100}ms` }}>
                <span className="text-2xl">{s.icon}</span>
                <span className="text-sm text-ink-100 font-medium">{s.text}</span>
              </div>
            ))}
          </div>
        )}

        <button onClick={handleNext} className="btn-primary w-full text-base py-4">
          {current.cta} <ArrowRight className="w-4 h-4" />
        </button>

        {step === 0 && (
          <button onClick={() => { completeOnboarding(); }} className="text-sm text-ink-400 hover:text-ink-200 transition-colors mt-4">
            Skip intro
          </button>
        )}
      </div>
    </div>
  );
}
