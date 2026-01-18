import { User, Mission, Reward } from './types';

// Simulating a database with in-memory storage
class GameStore {
  users: Map&lt;string, User&gt; = new Map();
  missions: Map&lt;string, Mission&gt; = new Map();
  rewards: Map&lt;string, Reward&gt; = new Map();

  constructor() {
    // Seed initial data
    this.seed();
  }

  private seed() {
    // Demo User
    this.users.set('demo-user', {
      id: 'demo-user',
      username: 'PlayerOne',
      region: 'US',
      age: 25,
      level: 1,
      xp: 0,
      currency: 100,
      streak: 1,
      lastLogin: new Date().toISOString(),
      inventory: [],
      dailyStats: {
        date: new Date().toISOString().split('T')[0],
        xpEarned: 0,
        missionsCompleted: 0
      }
    });

    // Seed Rewards
    this.rewards.set('badge_novice', { id: 'badge_novice', name: 'Novice Explorer', type: 'badge', value: 0, rarity: 'common' });
  }

  getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  updateUser(user: User): void {
    this.users.set(user.id, user);
  }
}

export const db = new GameStore();
