import fs from 'fs/promises';
import path from 'path';
import { IDatabase } from './adapter';
import { User, Mission, Reward, SystemLog, Item } from '../models/types';

const DB_PATH = path.join(process.cwd(), 'server', 'data', 'database.json');

// Initial Seed Data
const INITIAL_DATA = {
  users: {
    'demo-user': {
      id: 'demo-user',
      username: 'PlayerOne',
      level: 1,
      xp: 0,
      currency: 100,
      streak: 1,
      lastLogin: new Date().toISOString(),
      region: 'US',
      dailyXp: 0,
      lastDailyReset: new Date().toISOString(),
      inventory: []
    }
  },
  missions: {},
  items: [], // Will be populated by adapter logic
  config: {},
  logs: []
};

class JsonDatabase implements IDatabase {
  private data: any = INITIAL_DATA;
  private initialized = false;

  private async init() {
    if (this.initialized) return;
    try {
      await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
      try {
        const fileContent = await fs.readFile(DB_PATH, 'utf-8');
        this.data = JSON.parse(fileContent);
      } catch (e) {
        // File doesn't exist, write initial data
        // Note: The synchronous adapter handles the 'real' initial seed with items
        // This is just a fallback for the async wrapper
        await this.saveToFile();
      }
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }
  }

  private async saveToFile() {
    await fs.writeFile(DB_PATH, JSON.stringify(this.data, null, 2));
  }

  async getUser(id: string): Promise<User | null> {
    await this.init();
    return this.data.users[id] || null;
  }

  async saveUser(user: User): Promise<void> {
    await this.init();
    this.data.users[user.id] = user;
    await this.saveToFile();
  }

  async getMissions(userId: string): Promise<Mission[]> {
    await this.init();
    return this.data.missions[userId] || [];
  }

  async saveMission(mission: Mission): Promise<void> {
    await this.init();
    const userId = mission.userId; // Fixed property name
    if (!this.data.missions[userId]) {
      this.data.missions[userId] = [];
    }
    
    const missions = this.data.missions[userId];
    const index = missions.findIndex((m: Mission) => m.id === mission.id);
    
    if (index >= 0) {
      missions[index] = mission;
    } else {
      missions.push(mission);
    }
    
    await this.saveToFile();
  }
  
  // New Inventory Methods
  async getItems(): Promise<Item[]> {
      await this.init();
      return this.data.items || [];
  }
}

export const db = new JsonDatabase();
