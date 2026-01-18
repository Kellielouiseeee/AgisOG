import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../repositories/userRepository';
import { ConfigRepository } from '../repositories/config';

export const checkXpCap = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.id || 'demo-user';
  
  try {
    const config = ConfigRepository.get();
    const user = await UserRepository.findById(userId);
    
    if (user) {
      await UserRepository.updateDailyStats(user);

      if (user.dailyXp >= config.dailyXpCap) {
        res.status(403).json({ 
          error: 'Daily XP Cap Exceeded', 
          message: 'You have reached the safety limit for today. Come back tomorrow!' 
        });
        return;
      }
    }
    next();
  } catch (err) {
    console.error('Error in checkXpCap:', err);
    next();
  }
};
