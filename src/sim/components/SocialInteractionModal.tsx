import { useState } from 'react';
import { useSimLife } from '../SimLifeContext';
import { type SimNPCProfile, type SocialOption } from '../types';
import { X, Heart, MessageCircle, Sparkles, DollarSign, Handshake } from 'lucide-react';

interface SocialInteractionModalProps {
  npc: SimNPCProfile;
  onClose: () => void;
}

const SOCIAL_OPTIONS: SocialOption[] = [
  {
    id: 'hail',
    label: 'Warm Nigerian Greeting',
    pidgin: 'How far na! Wetin dey sup?',
    category: 'friendly',
    effects: { social: 15, fun: 8, relationship: 10 },
    npcReplies: [
      'I dey fine my broda! We dey hustle as usual.',
      'Everything soft! You dey look fresh today o.',
      'We thank God o! How body and family?',
    ],
  },
  {
    id: 'chairman',
    label: 'Hailing Boss Level',
    pidgin: 'I hail o, Chairman! The money man!',
    category: 'friendly',
    effects: { social: 20, fun: 15, relationship: 15 },
    npcReplies: [
      'Haha, no whine me joor! We all dey try for this Lagos.',
      'Big man! Anything for the boys today?',
      'Leader of the squad! Respect always.',
    ],
  },
  {
    id: 'gist',
    label: 'Share Hot Street Gist',
    pidgin: 'You hear wetin happen for Island yesterday?',
    category: 'funny',
    effects: { social: 25, fun: 25, relationship: 12 },
    npcReplies: [
      'No tell me! That gist sweet die! Gbeborun is life.',
      'Chai! Lagos never ceases to amaze me honestly!',
      'Omo, no wonder everybody dey talk am for Twitter since morning!',
    ],
  },
  {
    id: 'respect',
    label: 'Respectful Elder Greeting',
    pidgin: 'E kaasan ma / sir. Good afternoon elder.',
    category: 'cultural',
    effects: { social: 20, fun: 10, relationship: 25 },
    npcReplies: [
      'God bless you my child! May your hustle prosper.',
      'Well brought up! This is true Naija home training.',
      'E se pele o. You shall go far in life.',
    ],
  },
  {
    id: 'spray',
    label: 'Spray Cash (Owambe Style)',
    pidgin: 'Spray ₦1,000 cash notes on them! 💸',
    category: 'hustle',
    cost: 1000,
    effects: { social: 35, fun: 30, relationship: 35 },
    npcReplies: [
      'E choke o! Odogwu silencer! Owo wole!',
      'Chief, you no go lack! More blessings upon your account!',
      'Gbe body e! The real MVP of the party!',
    ],
  },
  {
    id: 'collab',
    label: 'Discuss Hustle & Tech',
    pidgin: 'Make we collaborate on one sharp project na.',
    category: 'hustle',
    effects: { social: 15, fun: 12, relationship: 18 },
    npcReplies: [
      'O boy, send me the pitch deck! Silicon Lagoon is moving fast.',
      'Sounds like a solid bag! Let us link up at the co-working space.',
      'Smart move! Real entrepreneurs connect.',
    ],
  },
];

export function SocialInteractionModal({ npc, onClose }: SocialInteractionModalProps) {
  const { interactWithNPC, npcs } = useSimLife();
  const currentNpc = npcs[npc.id] ?? npc;
  const [latestReply, setLatestReply] = useState<string | null>(null);

  const handleSelect = (option: SocialOption) => {
    const reply = interactWithNPC(npc.id, option);
    setLatestReply(reply);
  };

  const relationshipLabel =
    currentNpc.relationship >= 60 ? 'Bestie / Confidant 🌟' :
    currentNpc.relationship >= 30 ? 'Padi / Solid Friend 🤝' :
    currentNpc.relationship >= 10 ? 'Friendly Acquaintance 👋' : 'New Citizen 🤔';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-slate-900 via-gray-900 to-slate-950 border border-white/20 rounded-3xl p-6 max-w-md w-full shadow-2xl text-white relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header: NPC Info & Relationship */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-3xl shadow-inner">
            🇳🇬
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-amber-200">{currentNpc.name}</h3>
            <p className="text-xs text-gray-400 font-medium">{currentNpc.role}</p>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <Heart size={13} className="text-pink-400 fill-pink-400" />
              <span className="text-pink-300 font-medium">{relationshipLabel}</span>
              <span className="text-[11px] text-gray-400">({currentNpc.relationship} pts)</span>
            </div>
          </div>
        </div>

        {/* Speech Bubble (when NPC replies) */}
        {latestReply && (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-100 text-sm flex items-start gap-2.5 animate-in slide-in-from-bottom-2 duration-300">
            <MessageCircle size={18} className="text-amber-400 shrink-0 mt-0.5" />
            <p className="italic font-medium">"{latestReply}"</p>
          </div>
        )}

        <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
          Choose Interaction (Sims Social Wheel)
        </div>

        {/* Interaction Options List */}
        <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1">
          {SOCIAL_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt)}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/50 transition-all text-left flex items-center justify-between group active:scale-[0.98]"
            >
              <div>
                <div className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  {opt.category === 'friendly' && <Sparkles size={14} className="text-emerald-400" />}
                  {opt.category === 'funny' && <MessageCircle size={14} className="text-purple-400" />}
                  {opt.category === 'cultural' && <Handshake size={14} className="text-blue-400" />}
                  {opt.category === 'hustle' && <DollarSign size={14} className="text-amber-400" />}
                  {opt.label}
                </div>
                <div className="text-xs text-gray-400 italic mt-0.5">"{opt.pidgin}"</div>
              </div>

              {opt.cost && (
                <span className="text-xs font-bold text-emerald-400 px-2 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                  -₦{opt.cost.toLocaleString()}
                </span>
              )}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
