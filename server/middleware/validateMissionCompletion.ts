import { Request, Response, NextFunction } from 'express';
import { MissionRepository } from '../repositories/missionRepository';

export const validateMissionCompletion = async (req: Request, res: Response, next: NextFunction) => {
  const userId = 'demo-user'; // Mock auth
  const missionId = req.params.id;

  try {
    const mission = await MissionRepository.findById(userId, missionId);
    
    if (!mission) {
      res.status(404).json({ error: 'Mission not found' });
      return;
    }

    if (mission.status === 'completed') {
      res.status(400).json({ error: 'Mission already completed' });
      return;
    }

    if (new Date(mission.expiresAt) < new Date()) {
      res.status(400).json({ error: 'Mission expired' });
      return;
    }

    // Attach mission to request for downstream use
    (req as any).mission = mission;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Validation failed' });
  }
};
