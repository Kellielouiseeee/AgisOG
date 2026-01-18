import { Router } from 'express';
import { UserRepository } from '../repositories/userRepository';

const router = Router();

router.get('/me', async (req, res) =&gt; {
  try {
    const userId = 'demo-user'; // Mock auth
    const user = await UserRepository.findById(userId);
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
