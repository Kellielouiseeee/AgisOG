import { Request, Response, NextFunction } from 'express';
import { CONFIG } from '../config';

const rateLimits: Record<string, { tokens: number; lastRefill: number }> = {};

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || 'unknown';
  const now = Date.now();

  if (!rateLimits[ip]) {
    rateLimits[ip] = { tokens: CONFIG.LIMITS.RATE_LIMIT_MAX, lastRefill: now };
  }

  const bucket = rateLimits[ip];
  const elapsed = now - bucket.lastRefill;
  const newTokens = Math.floor(elapsed / 1000); // 1 token per second refill

  if (newTokens > 0) {
    bucket.tokens = Math.min(CONFIG.LIMITS.RATE_LIMIT_MAX, bucket.tokens + newTokens);
    bucket.lastRefill = now;
  }

  if (bucket.tokens > 0) {
    bucket.tokens--;
    next();
  } else {
    res.status(429).json({ error: 'Too many requests. Please slow down.' });
  }
};
