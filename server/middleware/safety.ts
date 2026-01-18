import { Request, Response, NextFunction } from 'express';

// Rate Limiter (Token Bucket simplified)
const requestLog: Map&lt;string, number[]&gt; = new Map();

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxReqs = 60; // 60 requests per minute

  const timestamps = requestLog.get(ip) || [];
  const validTimestamps = timestamps.filter(t => now - t &lt; windowMs);

  if (validTimestamps.length >= maxReqs) {
    res.status(429).json({ error: 'Too many requests. Slow down.' });
    return;
  }

  validTimestamps.push(now);
  requestLog.set(ip, validTimestamps);
  next();
};

// Region/Compliance Guard
export const regionGuard = (req: Request, res: Response, next: NextFunction) => {
  // In a real app, this would check JWT claims or IP geo-location
  // For now, we pass through, but this is where we'd block features for certain regions
  // e.g., "Loot boxes disabled in Belgium"
  next();
};
