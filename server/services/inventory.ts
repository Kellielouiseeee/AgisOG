import { UserRepository, ItemRepository } from '../repositories';
import { v4 as uuidv4 } from 'uuid';
import { InventoryItem, Item } from '../models/types';

export const InventoryService = {
  /**
   * Grants a random item to the user based on rarity weights.
   */
  async grantRandomItem(userId: string): Promise<Item | null> {
    const item = ItemRepository.getRandomItem();
    if (!item) return null;

    await this.addItemToUser(userId, item.id);
    return item;
  },

  /**
   * Adds a specific item to the user's inventory.
   */
  async addItemToUser(userId: string, itemId: string): Promise<void> {
    const user = await UserRepository.findById(userId);
    if (!user) throw new Error('User not found');

    const newItem: InventoryItem = {
      instanceId: uuidv4(),
      itemId,
      acquiredAt: new Date().toISOString()
    };

    user.inventory.push(newItem);
    await UserRepository.save(user);
  },

  /**
   * Equips an item (currently only badges supported).
   */
  async equipItem(userId: string, instanceId: string): Promise<void> {
    const user = await UserRepository.findById(userId);
    if (!user) throw new Error('User not found');

    const inventoryItem = user.inventory.find(i => i.instanceId === instanceId);
    if (!inventoryItem) throw new Error('Item not owned');

    const itemDef = ItemRepository.findById(inventoryItem.itemId);
    if (!itemDef) throw new Error('Item definition not found');
    
    if (itemDef.type !== 'badge') throw new Error('Only badges can be equipped currently');

    user.equippedBadgeId = itemDef.id;
    await UserRepository.save(user);
  }
};
