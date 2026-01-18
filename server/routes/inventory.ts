import { Router } from 'express';
import { InventoryService } from '../services/inventory';
import { UserRepository, ItemRepository } from '../repositories';

const router = Router();

// Get Inventory (enriched with metadata)
router.get('/', async (req, res) => {
    const userId = 'demo-user';
    const user = await UserRepository.findById(userId);
    if (!user) {
        res.status(404).json({error: 'User not found'});
        return;
    }

    const enrichedInventory = user.inventory.map(invItem => {
        const details = ItemRepository.findById(invItem.itemId);
        return { ...invItem, details };
    });

    res.json(enrichedInventory);
});

// Equip Item
router.post('/:instanceId/equip', async (req, res) => {
    const userId = 'demo-user';
    try {
        await InventoryService.equipItem(userId, req.params.instanceId);
        res.json({ success: true });
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
});

export default router;
