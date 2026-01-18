import { UserRepository } from '../repositories/userRepository';
import { MissionRepository } from '../repositories/missionRepository';
import { Mission, Item } from '../models/types';
import { InventoryService } from './inventory';

export class ProgressionService {
  /**
   * Calculates XP required for next level
   * Formula: Base 100 * (Level ^ 1.5)
   */
  static getXpForNextLevel(currentLevel: number): number {
    return Math.floor(100 * Math.pow(currentLevel, 1.5));
  }

  static async addXp(userId: string, amount: number): Promise<{ leveledUp: boolean; newLevel: number; user: any; droppedItem?: Item | null }> {
    const user = await UserRepository.findById(userId);
    if (!user) throw new Error('User not found');

    // Update Daily XP
    await UserRepository.updateDailyStats(user); // Ensure reset if needed
    user.dailyXp += amount;
    user.xp += amount;

    let leveledUp = false;
    let xpNeeded = this.getXpForNextLevel(user.level);
    let droppedItem: Item | null = null;

    // Handle multi-level jumps
    while (user.xp >= xpNeeded) {
      user.xp -= xpNeeded;
      user.level += 1;
      leveledUp = true;
      xpNeeded = this.getXpForNextLevel(user.level);
    }

    await UserRepository.save(user);

    // Grant Reward on Level Up
    if (leveledUp) {
        droppedItem = await InventoryService.grantRandomItem(userId);
    }

    return { leveledUp, newLevel: user.level, user, droppedItem };
  }

  static async completeMission(userId: string, missionId: string): Promise<Mission> {
    const mission = await MissionRepository.findById(userId, missionId);
    if (!mission) throw new Error('Mission not found');
    if (mission.status === 'completed') throw new Error('Mission already completed');

    mission.status = 'completed';
    mission.completedAt = new Date().toISOString();
    
    await MissionRepository.save(mission);
    return mission;
  }
}
