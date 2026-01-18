export interface InventoryItem {
  instanceId: string;
  itemId: string;
  acquiredAt: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: 'badge' | 'cosmetic' | 'consumable';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  icon: string; // Lucide icon name
}
