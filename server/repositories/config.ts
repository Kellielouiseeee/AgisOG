import { db } from '../db/adapter';
import { SystemConfig, SystemLog } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

export const ConfigRepository = {
  get: (): SystemConfig => {
    return db.get('config');
  },

  update: (updates: Partial<SystemConfig>, adminId: string): SystemConfig => {
    const oldConfig = db.get('config');
    const newConfig = db.updateConfig(updates);
    
    // Audit Log
    const logs = db.get('logs');
    const logEntry: SystemLog = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      action: 'UPDATE_CONFIG',
      adminId,
      details: { old: oldConfig, updates }
    };
    logs.push(logEntry);
    db.set('logs', logs);

    return newConfig;
  }
};
