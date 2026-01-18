import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Package, Shield, Star, Zap, CheckCircle } from 'lucide-react';
import { useStore } from '../store';

interface InventoryItem {
  instanceId: string;
  acquiredAt: string;
  details: {
    id: string;
    name: string;
    description: string;
    type: 'badge' | 'cosmetic' | 'consumable';
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    icon: string;
  };
}

const RarityColors = {
  common: 'border-slate-600 bg-slate-800',
  uncommon: 'border-emerald-500/50 bg-emerald-900/20',
  rare: 'border-blue-500/50 bg-blue-900/20',
  epic: 'border-purple-500/50 bg-purple-900/20',
  legendary: 'border-amber-500/50 bg-amber-900/20',
};

export const Inventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const { user, fetchUser } = useStore();
  const [filter, setFilter] = useState<'all' | 'badge' | 'cosmetic'>('all');

  useEffect(() => {
    fetchInventory();
  }, [user]); // Re-fetch if user updates (e.g. level up)

  const fetchInventory = async () => {
    try {
      const res = await axios.get('/api/inventory');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEquip = async (instanceId: string) => {
    try {
      await axios.post(`/api/inventory/${instanceId}/equip`);
      await fetchUser(); // Update global user state
      alert('Badge Equipped!');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to equip');
    }
  };

  const filteredItems = items.filter(i => filter === 'all' || i.details.type === filter);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="mb-8 flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Package className="text-indigo-400" /> Collection
            </h1>
            <p className="text-slate-400">Manage your badges, cosmetics, and rewards.</p>
        </div>
        <div className="flex gap-2 bg-slate-800 p-1 rounded-lg">
            {(['all', 'badge', 'cosmetic'] as const).map(f => (
                <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                        filter === f ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                >
                    {f}
                </button>
            ))}
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <motion.div 
            key={item.instanceId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative p-4 rounded-xl border ${RarityColors[item.details.rarity]} hover:scale-[1.02] transition-transform`}
          >
            {user?.equippedBadgeId === item.details.id && (
                <div className="absolute top-2 right-2 text-emerald-400">
                    <CheckCircle size={16} />
                </div>
            )}
            
            <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-slate-950/50 flex items-center justify-center">
                    {/* Placeholder for dynamic icons based on string name */}
                    <Star className={`w-8 h-8 ${
                        item.details.rarity === 'legendary' ? 'text-amber-400' : 
                        item.details.rarity === 'epic' ? 'text-purple-400' : 'text-slate-400'
                    }`} />
                </div>
            </div>

            <h3 className="text-white font-semibold text-center mb-1">{item.details.name}</h3>
            <p className="text-xs text-slate-400 text-center mb-4 min-h-[2.5em]">{item.details.description}</p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                <span className={`text-[10px] uppercase font-bold tracking-wider ${
                    item.details.rarity === 'legendary' ? 'text-amber-400' : 'text-slate-500'
                }`}>
                    {item.details.rarity}
                </span>
                
                {item.details.type === 'badge' && (
                    <button 
                        onClick={() => handleEquip(item.instanceId)}
                        disabled={user?.equippedBadgeId === item.details.id}
                        className="text-xs bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-1 rounded"
                    >
                        {user?.equippedBadgeId === item.details.id ? 'Equipped' : 'Equip'}
                    </button>
                )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-20 text-slate-500">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No items found in this category.</p>
            <p className="text-sm mt-2">Level up to earn rewards!</p>
        </div>
      )}
    </div>
  );
};
