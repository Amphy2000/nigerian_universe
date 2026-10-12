import { useState } from 'react';
import { useSimLife } from '@/sim/SimLifeContext';
import { X, Home, Zap, Tv, Moon, Radio, ArrowUpRight } from 'lucide-react';

interface ApartmentModalProps {
  onClose: () => void;
}

export function ApartmentModal({ onClose }: ApartmentModalProps) {
  const { sleepOrRest, adjustNeeds, earnNaira, spendNaira, showSimToast, naira } = useSimLife();

  const [generatorOn, setGeneratorOn] = useState(true);
  const [tvOn, setTvOn] = useState(false);
  const [propertyTier, setPropertyTier] = useState<'room' | 'flat' | 'duplex'>('room');

  const pullGeneratorCord = () => {
    setGeneratorOn(!generatorOn);
    if (!generatorOn) {
      showSimToast('Pull cord jerked! "I-Pass-My-Neighbor" generator roared to life! ⚡', '⚡', 'success');
      adjustNeeds({ fun: 10 });
    } else {
      showSimToast('Generator turned off to save fuel.', '⛽', 'info');
    }
  };

  const handleSleep = () => {
    sleepOrRest(50);
    showSimToast('Deep sleep on orthopaedic mattress. Energy fully restored (100%)!', '😴', 'success');
  };

  const toggleTV = () => {
    if (!generatorOn) {
      showSimToast('NEPA has taken light and generator is off! No electricity for TV.', '⚠️', 'warning');
      return;
    }
    setTvOn(!tvOn);
    if (!tvOn) {
      adjustNeeds({ fun: 25 });
      showSimToast('Watching Super Eagles vs Ghana AFCON match highlights!', '📺', 'success');
    }
  };

  const upgradeProperty = () => {
    if (propertyTier === 'room') {
      if (spendNaira(50000, 'Upgraded to 2-Bedroom Serviced Flat in Yaba')) {
        setPropertyTier('flat');
        adjustNeeds({ fun: 40, social: 30 });
      }
    } else if (propertyTier === 'flat') {
      if (spendNaira(150000, 'Upgraded to Luxury 4-Bedroom Duplex in Lekki')) {
        setPropertyTier('duplex');
        adjustNeeds({ fun: 60, social: 50 });
      }
    }
  };

  const propertyDetails = {
    room: { title: 'Studio Flat (Yaba Tech District)', status: 'Standard Citizen', icon: '🏠' },
    flat: { title: '2-Bedroom Serviced Apartment (Surulere)', status: 'Lagos Big Boy / Girl', icon: '🏢' },
    duplex: { title: 'Waterfront Penthouse Duplex (Lekki Phase 1)', status: 'Island Landlord (Odogwu)', icon: '🏰' },
  }[propertyTier];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-slate-900 via-gray-900 to-slate-950 border border-white/20 rounded-[36px] max-w-xl w-full p-6 shadow-2xl text-white relative flex flex-col">

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-2xl">
            {propertyDetails.icon}
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">My Lagos Residence</h2>
            <p className="text-xs text-amber-400 font-medium">{propertyDetails.title}</p>
          </div>
        </div>

        {/* Room Living Environment */}
        <div className={`rounded-3xl p-6 my-2 border transition-colors flex flex-col justify-between min-h-[220px] ${
          generatorOn ? 'bg-amber-950/20 border-amber-500/30 shadow-inner' : 'bg-black/90 border-gray-800'
        }`}>
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-gray-300">Power Supply:</span>
            <span className={`px-2.5 py-0.5 rounded-full font-black text-[11px] ${
              generatorOn ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-red-500/20 text-red-400'
            }`}>
              {generatorOn ? 'Tiger Gen (I-Pass-My-Neighbor) Running ⚡' : 'NEPA Light Out (Darkness) 🕯️'}
            </span>
          </div>

          {/* Living Room Interactive Actions */}
          <div className="grid grid-cols-2 gap-3 my-4">
            <button
              onClick={handleSleep}
              className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center gap-3 active:scale-95 transition-all group"
            >
              <Moon size={22} className="text-blue-400 shrink-0 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-xs font-bold text-white">Sleep in Bed</div>
                <div className="text-[10px] text-gray-400">Restores 100% Power</div>
              </div>
            </button>

            <button
              onClick={pullGeneratorCord}
              className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center gap-3 active:scale-95 transition-all group"
            >
              <Zap size={22} className="text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-xs font-bold text-white">{generatorOn ? 'Turn Off Gen' : 'Start Generator'}</div>
                <div className="text-[10px] text-gray-400">Pull cord startup</div>
              </div>
            </button>

            <button
              onClick={toggleTV}
              className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center gap-3 active:scale-95 transition-all group"
            >
              <Tv size={22} className="text-purple-400 shrink-0 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-xs font-bold text-white">{tvOn ? 'Turn Off TV' : 'Watch AFCON TV'}</div>
                <div className="text-[10px] text-gray-400">+25 Enjoyment</div>
              </div>
            </button>

            <button
              onClick={() => {
                adjustNeeds({ fun: 20 });
                showSimToast('Chilling with iced cold water and ceiling fan.', '🧊', 'info');
              }}
              className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center gap-3 active:scale-95 transition-all group"
            >
              <Radio size={22} className="text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-xs font-bold text-white">Chill on Couch</div>
                <div className="text-[10px] text-gray-400">Relax & meditate</div>
              </div>
            </button>
          </div>

          <div className="text-center text-[11px] text-gray-400">
            Property Status: <span className="font-bold text-amber-300">{propertyDetails.status}</span>
          </div>
        </div>

        {/* Real Estate Upgrade Button */}
        {propertyTier !== 'duplex' && (
          <div className="pt-2">
            <button
              onClick={upgradeProperty}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-black font-black text-xs flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-amber-500/20"
            >
              <ArrowUpRight size={16} />
              {propertyTier === 'room'
                ? 'Upgrade to 2-Bedroom Flat in Yaba (₦50,000)'
                : 'Acquire Lekki Phase 1 Waterfront Duplex (₦150,000)'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
