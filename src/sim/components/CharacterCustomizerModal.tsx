import { useState } from 'react';
import { useSimLife } from '../SimLifeContext';
import { NIGERIAN_SKIN_TONES, ANKARA_OUTFIT_PRESETS, type CustomAvatarConfig } from '@/world/HumanCharacter';
import { X, Sparkles, User, Palette, Shirt, Check } from 'lucide-react';

interface CharacterCustomizerModalProps {
  onClose: () => void;
}

const NIGERIAN_STATES = [
  'Lagos State 🌆',
  'Abuja (FCT) 🏛️',
  'Enugu (042) ⛰️',
  'Kano City 🕌',
  'Rivers (Port Harcourt) ⛽',
  'Oyo (Ibadan) 🏰',
  'Delta State 🌴',
  'Anambra State 💼',
  'Edo (Benin Kingdom) 👑',
  'Kaduna State 🚂',
];

export function CharacterCustomizerModal({ onClose }: CharacterCustomizerModalProps) {
  const { showSimToast } = useSimLife();

  // Load current saved customizer config or defaults
  const [config, setConfig] = useState<CustomAvatarConfig>(() => {
    try {
      const saved = localStorage.getItem('naija_avatar_config');
      return saved ? JSON.parse(saved) : {
        gender: 'male',
        skinTone: NIGERIAN_SKIN_TONES[1].color,
        outfitTopColor: ANKARA_OUTFIT_PRESETS[0][0],
        outfitBottomColor: ANKARA_OUTFIT_PRESETS[0][1],
        footwearColor: '#1c1917',
        hairColor: '#0c0704',
        headwearColor: '#1e293b',
      };
    } catch {
      return {
        gender: 'male',
        skinTone: NIGERIAN_SKIN_TONES[1].color,
        outfitTopColor: ANKARA_OUTFIT_PRESETS[0][0],
        outfitBottomColor: ANKARA_OUTFIT_PRESETS[0][1],
        footwearColor: '#1c1917',
        hairColor: '#0c0704',
        headwearColor: '#1e293b',
      };
    }
  });

  const [citizenName, setCitizenName] = useState(() => localStorage.getItem('naija_citizen_name') ?? 'Adewale Adeleke');
  const [hometown, setHometown] = useState(() => localStorage.getItem('naija_citizen_state') ?? NIGERIAN_STATES[0]);
  const [activeTab, setActiveTab] = useState<'identity' | 'skin' | 'fashion'>('skin');

  const handleSave = () => {
    localStorage.setItem('naija_avatar_config', JSON.stringify(config));
    localStorage.setItem('naija_citizen_name', citizenName);
    localStorage.setItem('naija_citizen_state', hometown);
    showSimToast('Citizen appearance & drip saved successfully! Looking fresh!', '✨', 'success');
    // Dispatch storage event so live scenes re-render immediately
    window.dispatchEvent(new Event('storage'));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-slate-900 via-gray-900 to-slate-950 border border-white/20 rounded-[36px] max-w-xl w-full p-6 shadow-2xl text-white relative flex flex-col max-h-[90vh]">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-500 to-amber-500 text-black shadow-lg shadow-emerald-500/20">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white">Create-A-Sim (Naija Edition)</h2>
            <p className="text-xs text-emerald-400 font-medium">Customize your avatar's drip, skin tone & identity</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-5">
          <button
            onClick={() => setActiveTab('skin')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'skin' ? 'bg-amber-500 text-black shadow-md' : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Palette size={14} /> Melanin & Hair
          </button>
          <button
            onClick={() => setActiveTab('fashion')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'fashion' ? 'bg-amber-500 text-black shadow-md' : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Shirt size={14} /> Ankara & Outfits
          </button>
          <button
            onClick={() => setActiveTab('identity')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'identity' ? 'bg-amber-500 text-black shadow-md' : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <User size={14} /> Citizen Identity
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-5">

          {/* ─── TAB 1: MELANIN & HAIR ────────────────────────────────────── */}
          {activeTab === 'skin' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">
                  Nigerian Melanin Skin Tone
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {NIGERIAN_SKIN_TONES.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => setConfig({ ...config, skinTone: tone.color })}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                        config.skinTone === tone.color
                          ? 'border-amber-400 bg-amber-500/20 shadow-md ring-2 ring-amber-400/50'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-full shadow-inner border border-white/20 shrink-0"
                        style={{ backgroundColor: tone.color }}
                      />
                      <span className="text-xs font-semibold text-white">{tone.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender / Body Type */}
              <div className="pt-2">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">
                  Body Style / Silhouette
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setConfig({ ...config, gender: 'male' })}
                    className={`py-3 px-4 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      config.gender === 'male'
                        ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-600/30'
                        : 'bg-white/5 border-white/10 text-gray-300'
                    }`}
                  >
                    Masculine Drip 👔
                  </button>
                  <button
                    onClick={() => setConfig({ ...config, gender: 'female' })}
                    className={`py-3 px-4 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      config.gender === 'female'
                        ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-600/30'
                        : 'bg-white/5 border-white/10 text-gray-300'
                    }`}
                  >
                    Feminine Elegance 👗
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 2: ANKARA & FASHION ──────────────────────────────────── */}
          {activeTab === 'fashion' && (
            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1">
                Authentic Ankara & Traditional Outfits
              </label>

              <div className="grid grid-cols-1 gap-2.5">
                {ANKARA_OUTFIT_PRESETS.map(([top, bottom], idx) => {
                  const isSelected = config.outfitTopColor === top && config.outfitBottomColor === bottom;
                  return (
                    <button
                      key={idx}
                      onClick={() => setConfig({ ...config, outfitTopColor: top, outfitBottomColor: bottom })}
                      className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/20 shadow-md ring-2 ring-amber-400/50'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center -space-x-2">
                          <div
                            className="w-6 h-6 rounded-full border border-white/30 shadow-md"
                            style={{ backgroundColor: top }}
                          />
                          <div
                            className="w-6 h-6 rounded-full border border-white/30 shadow-md"
                            style={{ backgroundColor: bottom }}
                          />
                        </div>
                        <span className="text-xs font-bold text-white">
                          Ankara Ensemble #{idx + 1}
                        </span>
                      </div>
                      {isSelected && <Check size={16} className="text-amber-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── TAB 3: CITIZEN IDENTITY ─────────────────────────────────── */}
          {activeTab === 'identity' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Citizen Full Name
                </label>
                <input
                  type="text"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-white font-medium text-sm focus:outline-none focus:border-amber-400"
                  placeholder="e.g. Babatunde Fashola"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Home State of Origin
                </label>
                <select
                  value={hometown}
                  onChange={(e) => setHometown(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/15 text-white font-medium text-sm focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {NIGERIAN_STATES.map((state) => (
                    <option key={state} value={state} className="bg-slate-900 text-white">
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3 mt-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-xs text-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-black font-black text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform flex items-center gap-2"
          >
            <Check size={16} /> Save & Enter City
          </button>
        </div>

      </div>
    </div>
  );
}
