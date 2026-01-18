import { db } from '../db/adapter';
import { Season } from '../models/types';

export const SeasonRepository = {
  getAll: (): Season[] => {
    return db.get('seasons');
  },

  getActive: (): Season | undefined => {
    const seasons = db.get('seasons');
    const now = new Date().toISOString();
    return seasons.find(s => s.isActive && s.startDate <= now && s.endDate >= now);
  },

  toggle: (seasonId: string, isActive: boolean): Season | undefined => {
    const seasons = db.get('seasons');
    const season = seasons.find(s => s.id === seasonId);
    if (season) {
      // If activating, deactivate others to avoid conflict in this simple version
      if (isActive) {
        seasons.forEach(s => s.isActive = false);
      }
      season.isActive = isActive;
      db.set('seasons', seasons);
    }
    return season;
  }
};
