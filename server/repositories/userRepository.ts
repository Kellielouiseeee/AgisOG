import { db } from '../db/json-adapter';
import { User } from '../models/types';

export class UserRepository {
  static async findById(id: string): Promise&lt;User | null&gt; {
    return db.getUser(id);
  }

  static async save(user: User): Promise&lt;void&gt; {
    return db.saveUser(user);
  }

  static async updateDailyStats(user: User): Promise&lt;User&gt; {
    const now = new Date();
    const lastReset = new Date(user.lastDailyReset);
    
    // Check if it's a new day (simple check)
    if (now.getDate() !== lastReset.getDate() || now.getMonth() !== lastReset.getMonth()) {
      user.dailyXp = 0;
      user.lastDailyReset = now.toISOString();
      await this.save(user);
    }
    
    return user;
  }
}
