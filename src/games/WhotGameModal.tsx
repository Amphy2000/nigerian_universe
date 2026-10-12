import { useState } from 'react';
import { useSimLife } from '@/sim/SimLifeContext';
import { X, Sparkles, Trophy, RotateCcw } from 'lucide-react';

interface WhotGameModalProps {
  onClose: () => void;
}

type Shape = 'circle' | 'triangle' | 'cross' | 'square' | 'star' | 'whot';

interface Card {
  id: string;
  shape: Shape;
  number: number;
}

const SHAPES: Shape[] = ['circle', 'triangle', 'cross', 'square', 'star'];

function generateDeck(): Card[] {
  const deck: Card[] = [];
  let id = 1;

  // Standard numbers for each shape
  const numbers = [1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14];
  SHAPES.forEach((shape) => {
    numbers.forEach((num) => {
      deck.push({ id: `c-${id++}`, shape, number: num });
    });
  });

  // 4 Whot 20 wild cards
  for (let i = 0; i < 4; i++) {
    deck.push({ id: `w-${id++}`, shape: 'whot', number: 20 });
  }

  // Shuffle
  return deck.sort(() => Math.random() - 0.5);
}

export function WhotGameModal({ onClose }: WhotGameModalProps) {
  const { earnNaira, spendNaira, adjustNeeds, showSimToast } = useSimLife();

  const [deck, setDeck] = useState<Card[]>(() => generateDeck());
  const [playerHand, setPlayerHand] = useState<Card[]>(() => {
    const d = generateDeck();
    return d.slice(0, 5);
  });
  const [npcHand, setNpcHand] = useState<Card[]>(() => {
    const d = generateDeck();
    return d.slice(5, 10);
  });
  const [topCard, setTopCard] = useState<Card>({ id: 'top-1', shape: 'circle', number: 7 });
  const [calledShape, setCalledShape] = useState<Shape | null>(null);
  const [gameStatus, setGameStatus] = useState<'playing' | 'player_won' | 'npc_won'>('playing');
  const [turn, setTurn] = useState<'player' | 'npc'>('player');

  const BET_AMOUNT = 3000;

  const isValidPlay = (card: Card): boolean => {
    if (card.number === 20) return true; // Whot 20 is always playable
    const targetShape = calledShape ?? topCard.shape;
    return card.shape === targetShape || card.number === topCard.number;
  };

  const playCard = (card: Card) => {
    if (turn !== 'player' || gameStatus !== 'playing') return;
    if (!isValidPlay(card)) {
      showSimToast('Invalid play! Must match shape or number (or play Whot 20)', '⚠️', 'warning');
      return;
    }

    // Play card
    const newHand = playerHand.filter((c) => c.id !== card.id);
    setPlayerHand(newHand);
    setTopCard(card);
    setCalledShape(null);

    // Check Win
    if (newHand.length === 0) {
      setGameStatus('player_won');
      earnNaira(BET_AMOUNT * 2, 'Won 1v1 Whot Card Match against Chairman Femi');
      adjustNeeds({ fun: 45, social: 30 });
      showSimToast('CHECK! You won the Whot match! Collected ₦6,000!', '🏆', 'success');
      return;
    }

    if (newHand.length === 1) {
      showSimToast('LAST CARD! Watch out!', '⚡', 'warning');
    }

    // Special card actions
    if (card.number === 1) {
      // Hold on: player plays again
      showSimToast('Hold On! Play again!', '🔄', 'info');
      return;
    }

    if (card.number === 2) {
      // Pick two for NPC
      showSimToast('Pick Two! Opponent draws 2 cards!', '🃏', 'success');
      drawCardsForNPC(2);
      return;
    }

    if (card.number === 14) {
      // General Market: both draw 1 card
      drawPlayerCard();
      drawCardsForNPC(1);
      showSimToast('General Market! Everyone draws a card!', '🛒', 'info');
      setTurn('npc');
      setTimeout(npcTurn, 1200);
      return;
    }

    // Normal handoff to NPC
    setTurn('npc');
    setTimeout(npcTurn, 1200);
  };

  const drawPlayerCard = () => {
    if (turn !== 'player' || gameStatus !== 'playing') return;
    const drawn = deck[0] ?? { id: `d-${Date.now()}`, shape: 'triangle', number: 3 };
    setDeck((prev) => prev.slice(1));
    setPlayerHand((prev) => [...prev, drawn]);
    setTurn('npc');
    setTimeout(npcTurn, 1200);
  };

  const drawCardsForNPC = (count: number) => {
    const drawn = deck.slice(0, count);
    setDeck((prev) => prev.slice(count));
    setNpcHand((prev) => [...prev, ...drawn]);
    setTurn('player');
  };

  const npcTurn = () => {
    setNpcHand((prevHand) => {
      const playable = prevHand.find((c) => isValidPlay(c));
      if (playable) {
        const remaining = prevHand.filter((c) => c.id !== playable.id);
        setTopCard(playable);
        setCalledShape(null);

        if (remaining.length === 0) {
          setGameStatus('npc_won');
          showSimToast('Opponent checked! Better luck next round!', '😢', 'warning');
        } else if (remaining.length === 1) {
          showSimToast('Opponent shouted: "LAST CARD!"', '🚨', 'warning');
        }
        setTurn('player');
        return remaining;
      } else {
        // NPC draws from market
        const drawn = deck[0] ?? { id: `d-${Date.now()}`, shape: 'star', number: 7 };
        setDeck((prev) => prev.slice(1));
        showSimToast('Opponent went to market (drew a card)', '🛒', 'info');
        setTurn('player');
        return [...prevHand, drawn];
      }
    });
  };

  const restartGame = () => {
    const d = generateDeck();
    setDeck(d.slice(10));
    setPlayerHand(d.slice(0, 5));
    setNpcHand(d.slice(5, 10));
    setTopCard(d[10]);
    setGameStatus('playing');
    setTurn('player');
  };

  const getShapeIcon = (shape: Shape) => {
    switch (shape) {
      case 'circle': return '⭕';
      case 'triangle': return '🔺';
      case 'cross': return '➕';
      case 'square': return '⬛';
      case 'star': return '⭐';
      case 'whot': return '👑';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 border-2 border-emerald-500/40 rounded-[36px] max-w-xl w-full p-6 shadow-2xl text-white relative flex flex-col">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-2xl">
            🃏
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Whot! The National Card Game</h2>
            <p className="text-xs text-emerald-400">Playing vs. Chairman Femi • Pot: ₦6,000</p>
          </div>
        </div>

        {/* Game Arena Table */}
        <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-3xl p-5 my-2 flex flex-col items-center justify-between min-h-[300px]">

          {/* Opponent Hand (Face Down) */}
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs font-bold text-gray-300 mr-2">Chairman Femi:</span>
            {npcHand.map((_, i) => (
              <div
                key={i}
                className="w-8 h-12 rounded-lg bg-red-800 border border-white/20 shadow-md flex items-center justify-center text-xs font-bold"
              >
                🂠
              </div>
            ))}
          </div>

          {/* Table Center: Market Deck & Top Card */}
          <div className="flex items-center gap-6 my-4">
            {/* Market Pile */}
            <button
              onClick={drawPlayerCard}
              disabled={turn !== 'player' || gameStatus !== 'playing'}
              className="w-20 h-28 rounded-2xl bg-gradient-to-b from-blue-700 to-blue-900 border-2 border-white/30 shadow-xl flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-transform"
            >
              <span className="text-2xl">🂠</span>
              <span className="text-[10px] font-bold text-white mt-1">MARKET</span>
            </button>

            {/* Active Discard Pile / Top Card */}
            <div className="w-24 h-32 rounded-2xl bg-white text-black border-4 border-amber-400 shadow-2xl flex flex-col items-center justify-between p-2 font-black">
              <div className="text-sm self-start">{topCard.number}</div>
              <div className="text-4xl">{getShapeIcon(topCard.shape)}</div>
              <div className="text-sm self-end">{topCard.number}</div>
            </div>
          </div>

          {/* Game Outcome Overlay */}
          {gameStatus !== 'playing' && (
            <div className="text-center py-2 animate-in zoom-in-95 duration-200">
              {gameStatus === 'player_won' ? (
                <div className="text-emerald-400 font-black text-xl flex items-center justify-center gap-2">
                  <Trophy size={22} /> YOU WON! CHECK! (+₦6,000)
                </div>
              ) : (
                <div className="text-red-400 font-black text-xl">
                  Chairman Femi Checked! Better Luck Next Time!
                </div>
              )}
              <button
                onClick={restartGame}
                className="mt-3 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-2 mx-auto"
              >
                <RotateCcw size={14} /> Play Another Round
              </button>
            </div>
          )}

          {/* Player Hand (Face Up) */}
          <div className="w-full mt-2">
            <div className="text-xs font-bold text-emerald-300 mb-1 flex items-center justify-between">
              <span>Your Hand ({playerHand.length} cards)</span>
              <span>{turn === 'player' ? 'Your Turn to Play 🟢' : 'Opponent Thinking... ⏳'}</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              {playerHand.map((card) => {
                const playable = isValidPlay(card);
                return (
                  <button
                    key={card.id}
                    onClick={() => playCard(card)}
                    disabled={turn !== 'player' || gameStatus !== 'playing' || !playable}
                    className={`w-16 h-24 rounded-2xl p-1.5 flex flex-col items-center justify-between shrink-0 shadow-lg font-black transition-all ${
                      playable
                        ? 'bg-white text-black hover:-translate-y-2 hover:shadow-emerald-400/50 ring-2 ring-emerald-400 cursor-pointer'
                        : 'bg-gray-700 text-gray-400 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-xs self-start">{card.number}</div>
                    <div className="text-2xl">{getShapeIcon(card.shape)}</div>
                    <div className="text-xs self-end">{card.number}</div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
