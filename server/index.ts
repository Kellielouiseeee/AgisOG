import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { db } from './db';
import { rateLimiter, checkXpCap } from './middleware/economy';
import { generateMissionsForUser } from './services/meta';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(rateLimiter); // Apply global rate limit

// --- ROUTES ---

// 1. Auth (Mock)
app.post('/api/auth/login', (req, res) => {
  // In a real app, verify password. Here we just return the first user found or create one.
  const user = Array.from(db.users.values())[0]; 
  if (user) {
    res.json({ success: true, data: user });
  } else {
    // Fallback create if empty
    const newUser = db.createUser('demo', 'demo@agis.gg', 'pw');
    res.json({ success: true, data: newUser });
  }
});

// 2. User Profile
app.get('/api/users/:id', (req, res) => {
  const user = db.getUser(req.params.id);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });
  res.json({ success: true, data: user });
});

// 3. Missions (Meta Layer Integration)
app.get('/api/missions', (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const user = db.getUser(userId);
  
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

  // Get or Generate missions
  let missions = db.missions.get(userId);
  if (!missions || missions.length === 0) {
    missions = generateMissionsForUser(user);
    db.missions.set(userId, missions);
  }

  res.json({ success: true, data: missions });
});

app.post('/api/missions/:missionId/complete', checkXpCap, (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const { missionId } = req.params;
  
  const user = db.getUser(userId);
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

  const missions = db.missions.get(userId) || [];
  const mission = missions.find(m => m.id === missionId);

  if (!mission) return res.status(404).json({ success: false, error: 'Mission not found' });
  if (mission.status === 'completed') return res.status(400).json({ success: false, error: 'Already completed' });

  // Update State
  mission.status = 'completed';
  
  // Grant Rewards
  user.xp += mission.xpReward;
  user.dailyXpGain += mission.xpReward;
  user.currency += mission.currencyReward;

  // Level Up Logic
  const xpNeeded = user.level * 1000;
  let leveledUp = false;
  if (user.xp >= xpNeeded) {
    user.level++;
    user.xp -= xpNeeded;
    leveledUp = true;
  }

  res.json({ 
    success: true, 
    data: { 
      mission, 
      user,
      leveledUp 
    } 
  });
});

// 4. System Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.listen(PORT, () => {
  console.log(`AGIS Backend running on http://localhost:${PORT}`);
});
