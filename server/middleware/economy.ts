import { Request, Response, NextFunction } from 'express';
import { db } from '../db';

// SAFETY LAYER: Economy Controls

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 20; // 20 requests per minute
const MAX_DAILY_XP = 1000; // Cap progression speed

const requestCounts = new Map&lt;string, { count: number; start: number }&gt;();

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  
  const record = requestCounts.get(ip) || { count: 0, start: now };
  
  if (now - record.start > RATE_LIMIT_WINDOW) {
    record.count = 0;
    record.start = now;
  }
  
  record.count++;
  requestCounts.set(ip, record);

  if (record.count > MAX_REQUESTS) {
    res.status(429).json({ success: false, error: 'Rate limit exceeded. Slow down.' });
    return;
  }
  
  next();
};

export const checkXpCap = (req: Request, res: Response, next: NextFunction) => {
  // This middleware is applied to routes that grant XP
  const userId = req.headers['x-user-id'] as string;
  if (!userId) return next();

  const user = db.getUser(userId);
  if (!user) return next();

  db.checkDailyReset(user);

  if (user.dailyXpGain >= MAX_DAILY_XP) {
     res.status(403).json({ 
      success: false, 
      error: 'Daily XP cap reached. Come back tomorrow for more progress!' 
    });
    return;
  }

  next();
};
