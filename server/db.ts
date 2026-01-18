import { User, Mission } from './types';

// Simulating a database in memory
class Database {
  users: Map&lt;string, User&gt; = new Map();
  missions: Map&lt;string, Mission[]&gt; = new Map(); // userId -> missions
  
  constructor() {
    // Seed a demo user
    this.createUser('demo', 'demo@agis.gg', 'password');
  }

  createUser(username: string, email: string, passwordHash: string): User {
    const id = 'user_' + Math.random().toString(36).substr(2, 9);
    const newUser: User = {
      id,
      username,
      email,
      xp: 0,
      level: 1,
      currency: 0,
      streak: 0,
      lastLogin: new Date().toISOString(),
      dailyXpGain: 0,
      lastDailyReset: new Date().toISOString(),
      inventory: []
    };
    this.users.set(id, newUser);
    return newUser;
  }

  getUser(id: string) {
    return this.users.get(id);
  }

  // Helper to simulate daily reset logic
  checkDailyReset(user: User) {
    const last = new Date(user.lastDailyReset).getDate();
    const now = new Date().getDate();
    if (last !== now) {
      user.dailyXpGain = 0;
      user.lastDailyReset = new Date().toISOString();
    }
  }
}

export const db = new Database();
