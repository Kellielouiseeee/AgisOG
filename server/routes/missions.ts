import { Router } from 'express';
import { MetaService } from '../services/meta';
import { ProgressionService } from '../services/progression';
import { EconomyService } from '../services/economy';
import { checkXpCap } from '../middleware/economy';

const router = Router();

// Get missions (Adaptive)
router.get('/', async (req, res) => {
  try {
    const userId = 'demo-user';
    const missions = await MetaService.generateMissionsForUser(userId);
    res.json(missions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch missions' });
  }
});

// Complete mission (Protected by Safety Cap)
router.post('/:id/complete', checkXpCap, async (req, res) => {
  try {
    const userId = 'demo-user';
    const missionId = req.params.id;

    // 1. Mark mission complete
    const mission = await ProgressionService.completeMission(userId, missionId);

    // 2. Grant Rewards
    const progress = await ProgressionService.addXp(userId, mission.xpReward);
    const newBalance = await EconomyService.addCurrency(userId, mission.currencyReward);

    res.json({
      success: true,
      mission,
      rewards: {
        xp: mission.xpReward,
        currency: mission.currencyReward,
        droppedItem: progress.droppedItem // Return the item if one dropped
      },
      userState: {
        level: progress.newLevel,
        leveledUp: progress.leveledUp,
        currency: newBalance,
        xp: progress.user.xp,
        dailyXp: progress.user.dailyXp
      }
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to complete mission' });
  }
});

export default router;
