import { db } from '../db/adapter';
import { SystemLog } from '../models/types';

export const LogRepository = {
  getAll: (): SystemLog[] => {
    // Return most recent first
    return [...db.get('logs')].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }
};
