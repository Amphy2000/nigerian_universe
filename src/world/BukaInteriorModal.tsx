import { useState } from 'react';
import { useSimLife } from '@/sim/SimLifeContext';
import { X, Utensils, Sparkles, Coffee, Heart, DollarSign, MessageCircle, Check, Flame } from 'lucide-react';

interface BukaInteriorModalProps {
  onClose: () => void;
}

export function BukaInteriorModal({ onClose }: BukaInteriorModalProps) {
  const { adjustNeeds, spendNaira, showSimToast, naira } = useSimLife();

  const [activeTab, setActiveTab] = useState<'dine' | 'chat' | 'takeaway'>('dine');
  const [washedHands, setWashedHands] = useState(false);
  const [seatedTable, setSeatedTable] = useState<number | null>(1);
  const [mamaBisiDialogue, setMamaBisiDialogue] = useState<string>(
    "E kaasan my pikin! Welcome to Mama Bisi Buka. Have you washed your hand? What are we dishing for you today?"
  );

  const handleWashHands = () => {
    setWashedHands(true);
    adjustNeeds({ hygiene: 30, fun: 10 });
    showSimToast('Washed hands thoroughly in the warm water basin with Lifebuoy soap!', '🧼', 'success');
    setMamaBisiDialogue("Ehen! Good home training! Now your hands are sparkling clean. What will you eat?");
  };

  const handleEatFood = (type: 'amala' | 'jollof' | 'maltina' | 'pounded_yam', eatWith: 'hand' | 'spoon') => {
    if (!washedHands && eatWith === 'hand') {
      showSimToast('Ah ah! Wash your hand first before licking soup with fingers o!', '⚠️', 'info');
      return;
    }

    if (type === 'amala') {
      if (!spendNaira(3500, 'Hot Amala & Ewedu')) return;
      adjustNeeds({ hunger: 70, energy: 25, fun: 20 });
      showSimToast(
        eatWith === 'hand'
          ? 'Swallowed hot steaming Amala with hands & goat meat! Finger-licking goodness!'
          : 'Ate hot Amala and Ewedu with cutlery. Belle full!',
        '🍲',
        'success'
      );
      setMamaBisiDialogue("Enjoy your food o! The goat meat soft like butter today. If you need more stew, just shout!");
    } else if (type === 'jollof') {
      if (!spendNaira(2500, 'Party Jollof & Dodo')) return;
      adjustNeeds({ hunger: 50, fun: 25, energy: 15 });
      showSimToast('Chowed down firewood party jollof with fried plantain and peppered chicken!', '🍛', 'success');
      setMamaBisiDialogue("Firewood smoke jollof hits different! You go tell your friends about Mama Bisi!");
    } else if (type === 'pounded_yam') {
      if (!spendNaira(4000, 'Pounded Yam & Egusi')) return;
      adjustNeeds({ hunger: 80, energy: 30, fun: 20 });
      showSimToast('Smooth pounded yam with rich Egusi & stockfish! Maximum satisfaction!', '✨', 'success');
      setMamaBisiDialogue("Pounded yam from fresh Ilorin yam! Heavy fuel for your body!");
    } else if (type === 'maltina') {
      if (!spendNaira(800, 'Cold Glass Bottle Maltina')) return;
      adjustNeeds({ energy: 25, fun: 15 });
      showSimToast('Popped open ice-cold Maltina in traditional glass bottle! So refreshing!', '🥤', 'success');
      setMamaBisiDialogue("Cold Maltina washes down the pepper sharply! Enjoy!");
    }
  };

  const handleTipMama = (amount: number) => {
    if (!spendNaira(amount, 'Tip for Mama Bisi')) return;
    adjustNeeds({ social: 30, fun: 20 });
    showSimToast(`Tipped Mama Bisi ₦${amount.toLocaleString()}!`, '💖', 'success');
    setMamaBisiDialogue(
      "Olorun a bukun e my child! Your pocket will never run dry! Any door you knock will open for you in this Lagos!"
    );
  };

  const handleTalkMama = (topic: 'market' | 'recipe' | 'extra_meat') => {
    if (topic === 'extra_meat') {
      setMamaBisiDialogue(
        "Haha! See this fine boy/girl begging for extra meat! Because you have fine smile, I will add one small roundabout meat for you free!"
      );
      adjustNeeds({ fun: 15, hunger: 10 });
      showSimToast('Mama Bisi slipped extra meat into your bowl with a wink! 😉', '🥩', 'success');
    } else if (topic === 'market') {
      setMamaBisiDialogue(
        "Omo, Mile 12 market yesterday was war! Price of red pepper and tomatoes has double, but I cannot reduce my portion for my customers!"
      );
      adjustNeeds({ social: 15, fun: 10 });
    } else if (topic === 'recipe') {
      setMamaBisiDialogue(
        "The secret to authentic Lagos Jollof is the firewood smoke, fresh bay leaves, and frying your tomato paste till it turns sweet mahogany!"
      );
      adjustNeeds({ fun: 20, social: 15 });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-amber-950/90 via-stone-900 to-black border border-amber-500/30 rounded-[36px] max-w-2xl w-full p-5 sm:p-7 shadow-2xl text-white relative flex flex-col max-h-[92vh] overflow-hidden">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5 shrink-0">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20">
            🍲
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black tracking-tight text-amber-200">Mama Bisi Buka & Kitchen</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                OPEN & STEAMING
              </span>
            </div>
            <p className="text-xs text-amber-400 font-medium">Authentic Lagos Local Dining • Firewood Jollof & Hot Swallow</p>
          </div>
        </div>

        {/* Mama Bisi Dialogue Banner */}
        <div className="mb-5 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full bg-amber-600/30 border border-amber-400/40 flex items-center justify-center text-xl shrink-0">
            👩🏾‍🍳
          </div>
          <div className="flex-1 text-xs sm:text-sm">
            <span className="font-extrabold text-amber-300 block mb-0.5">Mama Bisi:</span>
            <p className="text-gray-200 italic leading-relaxed">"{mamaBisiDialogue}"</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-5 shrink-0">
          <button
            onClick={() => setActiveTab('dine')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'dine' ? 'bg-amber-500 text-black shadow-md' : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Utensils size={14} /> Dine In & Swallow
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'chat' ? 'bg-amber-500 text-black shadow-md' : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <MessageCircle size={14} /> Banter with Mama
          </button>
          <button
            onClick={() => setActiveTab('takeaway')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'takeaway' ? 'bg-amber-500 text-black shadow-md' : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Sparkles size={14} /> Table & Atmosphere
          </button>
        </div>

        {/* Main Tab Content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">

          {/* ─── TAB 1: DINE IN ─────────────────────────────────────────── */}
          {activeTab === 'dine' && (
            <div className="space-y-4">

              {/* Hand washing ritual */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xl">
                    🧼
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Hand Washing Station</h4>
                    <p className="text-xs text-gray-400">
                      {washedHands ? 'Hands clean & fragrant with Lifebuoy soap' : 'Wash hands before swallow!'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleWashHands}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    washedHands
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-cyan-500 text-black hover:bg-cyan-400 active:scale-95 shadow-md shadow-cyan-500/20'
                  }`}
                >
                  {washedHands ? <><Check size={14} /> Clean</> : 'Wash Hands'}
                </button>
              </div>

              {/* Food menu cards */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400">Fresh Pots of the Day</h4>

                {/* Hot Amala */}
                <div className="p-4 rounded-2xl bg-stone-900/90 border border-amber-500/20 hover:border-amber-500/40 transition-all flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-950 flex items-center justify-center text-2xl border border-amber-800">
                      🍲
                    </div>
                    <div>
                      <h5 className="font-extrabold text-sm text-white">Hot Amala, Ewedu & Goat Meat</h5>
                      <p className="text-xs text-gray-400">Steaming yam flour swallow with tender goat meat</p>
                      <span className="text-xs font-black text-amber-400 mt-0.5 block">₦3,500</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleEatFood('amala', 'hand')}
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-all shadow-md active:scale-95 flex items-center gap-1"
                    >
                      ✋ With Hand
                    </button>
                    <button
                      onClick={() => handleEatFood('amala', 'spoon')}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all active:scale-95"
                    >
                      🍴 Spoon
                    </button>
                  </div>
                </div>

                {/* Firewood Party Jollof */}
                <div className="p-4 rounded-2xl bg-stone-900/90 border border-amber-500/20 hover:border-amber-500/40 transition-all flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-950 flex items-center justify-center text-2xl border border-amber-800">
                      🍛
                    </div>
                    <div>
                      <h5 className="font-extrabold text-sm text-white">Firewood Party Jollof & Dodo</h5>
                      <p className="text-xs text-gray-400">Smoky rice, fried sweet plantain & peppered chicken</p>
                      <span className="text-xs font-black text-amber-400 mt-0.5 block">₦2,500</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEatFood('jollof', 'spoon')}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-all shadow-md active:scale-95 shrink-0"
                  >
                    Chop Now
                  </button>
                </div>

                {/* Pounded Yam */}
                <div className="p-4 rounded-2xl bg-stone-900/90 border border-amber-500/20 hover:border-amber-500/40 transition-all flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-950 flex items-center justify-center text-2xl border border-amber-800">
                      🥣
                    </div>
                    <div>
                      <h5 className="font-extrabold text-sm text-white">Ilorin Pounded Yam & Rich Egusi</h5>
                      <p className="text-xs text-gray-400">Fluffy pounded yam with stockfish & leafy greens</p>
                      <span className="text-xs font-black text-amber-400 mt-0.5 block">₦4,000</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEatFood('pounded_yam', 'hand')}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-all shadow-md active:scale-95 shrink-0"
                  >
                    ✋ Hand Swallow
                  </button>
                </div>

                {/* Ice-Cold Maltina */}
                <div className="p-4 rounded-2xl bg-stone-900/90 border border-amber-500/20 hover:border-amber-500/40 transition-all flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-950 flex items-center justify-center text-2xl border border-amber-800">
                      🥤
                    </div>
                    <div>
                      <h5 className="font-extrabold text-sm text-white">Ice-Cold Glass Bottle Maltina</h5>
                      <p className="text-xs text-gray-400">Crisp malt nourishment in the classic glass bottle</p>
                      <span className="text-xs font-black text-amber-400 mt-0.5 block">₦800</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEatFood('maltina', 'spoon')}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-all shadow-md active:scale-95 shrink-0"
                  >
                    Drink
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* ─── TAB 2: BANTER WITH MAMA BISI ──────────────────────────── */}
          {activeTab === 'chat' && (
            <div className="space-y-4">
              <p className="text-xs text-gray-300">
                Have a warm, authentic conversation with Mama Bisi. Hear real Lagos market gist, beg for extra meat, or shower her with tips!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => handleTalkMama('extra_meat')}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-amber-500/10 text-left transition-all group"
                >
                  <span className="text-xl mb-1 block">🍖</span>
                  <h5 className="font-extrabold text-sm text-amber-200 group-hover:text-amber-300">
                    "Mama, add small extra meat na!"
                  </h5>
                  <p className="text-xs text-gray-400 mt-1">Shoot your shot for free extra roundabout meat</p>
                </button>

                <button
                  onClick={() => handleTalkMama('market')}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-amber-500/10 text-left transition-all group"
                >
                  <span className="text-xl mb-1 block">🌶️</span>
                  <h5 className="font-extrabold text-sm text-amber-200 group-hover:text-amber-300">
                    "How market today, Mama?"
                  </h5>
                  <p className="text-xs text-gray-400 mt-1">Discuss pepper and food prices at Mile 12</p>
                </button>

                <button
                  onClick={() => handleTalkMama('recipe')}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-amber-500/10 text-left transition-all group"
                >
                  <span className="text-xl mb-1 block">🔥</span>
                  <h5 className="font-extrabold text-sm text-amber-200 group-hover:text-amber-300">
                    "What's the secret to firewood jollof?"
                  </h5>
                  <p className="text-xs text-gray-400 mt-1">Ask Mama for secret culinary wisdom</p>
                </button>

                <button
                  onClick={() => handleTipMama(500)}
                  className="p-4 rounded-2xl bg-gradient-to-tr from-emerald-950/40 to-stone-900 border border-emerald-500/30 hover:border-emerald-400 text-left transition-all group"
                >
                  <span className="text-xl mb-1 block">💸</span>
                  <h5 className="font-extrabold text-sm text-emerald-300 group-hover:text-emerald-200">
                    Tip Mama Bisi (₦500)
                  </h5>
                  <p className="text-xs text-gray-400 mt-1">Receive heartfelt Nigerian mother blessings (+Social)</p>
                </button>
              </div>
            </div>
          )}

          {/* ─── TAB 3: TABLE & ATMOSPHERE ─────────────────────────────── */}
          {activeTab === 'takeaway' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-stone-900/90 border border-white/10 space-y-3">
                <h4 className="font-extrabold text-sm text-amber-300">Choose Your Table & Vibe</h4>
                <div className="grid grid-cols-3 gap-2.5">
                  {[1, 2, 3].map((tableNum) => (
                    <button
                      key={tableNum}
                      onClick={() => setSeatedTable(tableNum)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        seatedTable === tableNum
                          ? 'border-amber-400 bg-amber-500/20 shadow-md ring-2 ring-amber-400/40 text-amber-200'
                          : 'border-white/10 bg-white/5 hover:bg-white/10 text-gray-400'
                      }`}
                    >
                      <span className="text-lg block mb-1">🪑</span>
                      <span className="text-xs font-bold block">Table #{tableNum}</span>
                      <span className="text-[10px] opacity-75">
                        {tableNum === 1 ? 'Near Fan' : tableNum === 2 ? 'By Corner' : 'Plaza View'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Music & Ambiance info */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-xl shrink-0">
                  🎶
                </div>
                <div>
                  <h5 className="font-bold text-xs text-white">Buka Ambiance & Radio</h5>
                  <p className="text-xs text-gray-400">
                    K1 De Ultimate & King Sunny Ade playing softly on the old transistor radio.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-3 shrink-0">
          <div className="text-xs text-gray-400">
            Current Cash: <span className="text-emerald-400 font-extrabold">₦{naira.toLocaleString()}</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-xs text-white transition-colors"
          >
            Step Back Outside to Plaza
          </button>
        </div>

      </div>
    </div>
  );
}
