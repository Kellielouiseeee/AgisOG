import { Request, Response, NextFunction } from 'express';
import { db } from '../models/store';
import { EconomyService } from '../services/economy';

// Middleware to enforce daily caps BEFORE processing logic
export const checkXpCap = (req: Request, res: Response, next: NextFunction) => {
  const userId = 'demo-user'; // In real app: req.user.id
  const user = db.getUser(userId);
  
  // We assume the request body might contain 'potentialXp' if it's a dry-run check
  // Or we check strictly during the transaction. 
  // For this middleware, we just check if they are ALREADY capped.
  
  if (user && user.dailyStats.xpEarned >= EconomyService.CAPS.DAILY_XP) {
     res.status(403).json({ 
      error: 'Daily XP Cap Reached', 
      code: 'CAP_REACHED',
      resetIn: '24h' 
    });
    return;
  }

  next();
};
