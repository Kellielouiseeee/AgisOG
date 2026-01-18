import fs from 'fs';
import path from 'path';
import { DatabaseSchema, SystemConfig, Item } from '../models/types';

const DB_PATH = path.join(__dirname, '../data/database.json');

const DEFAULT_CONFIG: SystemConfig = {
  dailyXpCap: 1000,
  baseXpMultiplier: 1.0,
  maintenanceMode: false,
  regionRules: {
    'US': { enabled: true, contentRating: 'PG-13' },
    'EU': { enabled: true, contentRating: 'PEGI-12' }
  }
};

const DEFAULT_ITEMS: Item[] = [
  {
    id: 'badge_novice',
    name: 'Novice Explorer',
    description: 'Awarded for beginning the journey.',
    type: 'badge',
    rarity: 'common',
    icon: 'Compass'
  },
  {
    id: 'badge_veteran',
    name: 'System Veteran',
    description: 'Survived the alpha testing phase.',
    type: 'badge',
    rarity: 'epic',
    icon: 'Shield'
  },
  {
    id: 'cosmetic_neon_frame',
    name: 'Neon Frame',
    description: 'A glowing border for your avatar.',
    type: 'cosmetic',
    rarity: 'rare',
    icon: 'Frame'
  },
  {
    id: 'badge_speedster',
    name: 'Speedster',
    description: 'Completed 5 missions in one day.',
    type: 'badge',
    rarity: 'uncommon',
    icon: 'Zap'
  },
  {
    id: 'item_xp_boost',
    name: 'XP Booster',
    description: 'Temporary XP gain increase.',
    type: 'consumable',
    rarity: 'common',
    icon: 'ArrowUpCircle'
  }
];

const DEFAULT_TEMPLATES = [
  {
    id: 'tpl_1',
    title: 'Daily Login',
    description: 'Check in to the system.',
    baseXp: 50,
    baseCurrency: 10,
    difficulty: 'easy',
    tags: ['daily']
  },
  {
    id: 'tpl_2',
    title: 'Complete Tutorial',
    description: 'Learn the basics of AGIS.',
    baseXp: 100,
    baseCurrency: 50,
    difficulty: 'easy',
    tags: ['onboarding']
  },
  {
    id: 'tpl_3',
    title: 'Master Challenge',
    description: 'Prove your skills in a difficult assessment.',
    baseXp: 500,
    baseCurrency: 200,
    difficulty: 'hard',
    tags: ['challenge']
  }
];

export class JsonDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    if (!fs.existsSync(DB_PATH)) {
      const initialData: DatabaseSchema = {
        users: {},
        missions: {},
        templates: DEFAULT_TEMPLATES as any,
        items: DEFAULT_ITEMS,
        config: DEFAULT_CONFIG,
        logs: []
      };
      this.save(initialData);
      return initialData;
    }
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    
    // Migration: Ensure items exist if loading old DB
    if (!data.items) {
        data.items = DEFAULT_ITEMS;
    }
    return data;
  }

  private save(data: DatabaseSchema) {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  }

  public get<K extends keyof DatabaseSchema>(collection: K): DatabaseSchema[K] {
    // Reload to get fresh data
    this.data = this.load();
    return this.data[collection];
  }

  public set<K extends keyof DatabaseSchema>(collection: K, value: DatabaseSchema[K]) {
    this.data[collection] = value;
    this.save(this.data);
  }
  
  public updateConfig(partial: Partial<SystemConfig>) {
    this.data.config = { ...this.data.config, ...partial };
    this.save(this.data);
    return this.data.config;
  }
}

export const db = new JsonDatabase();
