import { useSimLife } from '../SimLifeContext';
import { type InventoryItem } from '../types';
import { X, Backpack, Utensils } from 'lucide-react';

interface InventoryModalProps {
  onClose: () => void;
}

export function InventoryModal({ onClose }: InventoryModalProps) {
  const { inventory, eatFood } = useSimLife();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-slate-900 via-gray-900 to-slate-950 border border-white/20 rounded-3xl p-6 max-w-md w-full shadow-2xl text-white relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-300">
            <Backpack size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-amber-200">My Bag & Items</h3>
            <p className="text-xs text-gray-400">Inventory collected around Lagos</p>
          </div>
        </div>

        {inventory.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            <div className="text-4xl mb-2">🎒</div>
            Your bag is empty! Visit Mama Put or use Chowdeck on your phone to buy delicious chow.
          </div>
        ) : (
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {inventory.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <div className="text-sm font-bold text-white">{item.name}</div>
                    <div className="text-xs text-gray-400">{item.description}</div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-emerald-400">
                      {item.effects.hunger && <span>+{item.effects.hunger} Belle</span>}
                      {item.effects.energy && <span>+{item.effects.energy} Power</span>}
                      {item.effects.fun && <span>+{item.effects.fun} Enjoyment</span>}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    eatFood(item);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1 shrink-0 active:scale-95 transition-transform"
                >
                  <Utensils size={13} />
                  Consume
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
