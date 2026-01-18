import { db } from '../db/adapter';
import { Item } from '../models/types';

export const ItemRepository = {
  getAll: (): Item[] => {
    return db.get('items');
  },

  findById: (id: string): Item | undefined => {
    const items = db.get('items');
    return items.find(i => i.id === id);
  },

  // Helper to get random item based on rarity weights
  getRandomItem: (): Item => {
    const items = db.get('items');
    const rand = Math.random();
    
    // Simple weighted rarity
    let rarity = 'common';
    if (rand > 0.95) rarity = 'legendary';
    else if (rand > 0.85) rarity = 'epic';
    else if (rand > 0.70) rarity = 'rare';
    else if (rand > 0.50) rarity = 'uncommon';

    const pool = items.filter(i => i.rarity === rarity);
    
    // Fallback to common if pool is empty
    const finalPool = pool.length > 0 ? pool : items.filter(i => i.rarity === 'common');
    
    return finalPool[Math.floor(Math.random() * finalPool.length)];
  }
};
