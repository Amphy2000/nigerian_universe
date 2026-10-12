import { useSimLife } from '../SimLifeContext';
import { type CareerDef } from '../types';
import { X, Briefcase, TrendingUp, CheckCircle2, Award, Zap } from 'lucide-react';

interface CareerModalProps {
  onClose: () => void;
}

const AVAILABLE_CAREERS: CareerDef[] = [
  {
    id: 'tech-junior',
    title: 'Junior Frontend Tech Bro',
    level: 1,
    salary: 15000,
    field: 'Silicon Lagoon (Yaba)',
    description: 'Coding responsive interfaces with Afrobeats in your noise-canceling headphones.',
    nextPromotion: 'Senior Fullstack Heavyweight (₦45,000/day)',
  },
  {
    id: 'trader-market',
    title: 'Balogun Wholesale Merchant',
    level: 1,
    salary: 22000,
    field: 'Lagos Island Trade Center',
    description: 'Negotiating container shipments of fine lace, Ankara fabrics, and electronics.',
    nextPromotion: 'Import/Export Mogul (₦60,000/day)',
  },
  {
    id: 'music-producer',
    title: 'Afrobeats Beatmaker & Sound Engineer',
    level: 1,
    salary: 18000,
    field: 'Mainland Audio Studios',
    description: 'Cooking fire log drums and amapiano baselines for top Nigerian superstars.',
    nextPromotion: 'Grammy-Nominated Hit Producer (₦75,000/day)',
  },
  {
    id: 'legal-counsel',
    title: 'High Court Legal Practitioner',
    level: 1,
    salary: 28000,
    field: 'Federal Justice Chambers',
    description: 'Filing heavyweight motions, debating constitutional rights, and wearing the golden wig.',
    nextPromotion: 'Senior Advocate of Nigeria - SAN (₦100,000/day)',
  },
];

export function CareerModal({ onClose }: CareerModalProps) {
  const { career, doHustleWork, needs } = useSimLife();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-slate-900 via-gray-900 to-slate-950 border border-white/20 rounded-3xl p-6 max-w-lg w-full shadow-2xl text-white relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-300">
            <Briefcase size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-purple-200">Career & Daily Hustle</h3>
            <p className="text-xs text-gray-400">Manage your occupation and climb the Lagos ladder</p>
          </div>
        </div>

        {/* Current Active Career Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-slate-950 border border-purple-500/40 mb-5 shadow-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-purple-300 font-semibold uppercase tracking-wider">{career.field}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Level {career.level}
            </span>
          </div>

          <div className="text-2xl font-black text-white">{career.title}</div>
          <p className="text-xs text-gray-300 mt-1">{career.description}</p>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
            <div>
              <div className="text-[11px] text-gray-400">Daily Salary</div>
              <div className="text-lg font-black text-emerald-400">₦{career.salary.toLocaleString()} / shift</div>
            </div>

            <button
              onClick={() => doHustleWork()}
              disabled={needs.energy < 20}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-md ${
                needs.energy < 20
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20'
              }`}
            >
              <Zap size={14} />
              {needs.energy < 20 ? 'Too Tired to Work' : 'Work Daily Shift'}
            </button>
          </div>
        </div>

        {/* Career Opportunities in Lagos */}
        <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
          Other Opportunities in the City
        </div>

        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {AVAILABLE_CAREERS.map((c) => (
            <div
              key={c.id}
              className={`p-3 rounded-2xl border transition-colors ${
                c.id === career.id
                  ? 'bg-purple-900/20 border-purple-500/50'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    {c.title}
                    {c.id === career.id && <CheckCircle2 size={14} className="text-purple-400" />}
                  </div>
                  <div className="text-xs text-gray-400">{c.field} • ₦{c.salary.toLocaleString()}/day</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
