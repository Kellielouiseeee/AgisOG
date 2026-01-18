import { InventoryItem } from './rewardModel';

export interface User {
  id: string;
  username: string;
  level: number;
  xp: number;
  currency: number;
  streak: number;
  lastLogin: string; // ISO date
  region: string;
  dailyXp: number;
  lastDailyReset: string;
  inventory: InventoryItem[];
  equippedBadgeId?: string;
}
