import { Mission, User } from '../types';

// META LAYER: Adaptive Difficulty
// Generates missions based on user level

export const generateMissionsForUser = (user: User): Mission[] => {
  const baseXP = 50 * user.level;
  const baseCurrency = 10 * user.level;
  
  // Logic to scale difficulty
  const missions: Mission[] = [
    {
      id: 'm_' + Math.random().toString(36).substr(2, 9),
      title: `Daily Drill: Level ${user.level}`,
      description: 'Complete your daily login and warm-up exercise.',
      difficulty: 'easy',
      xpReward: Math.floor(baseXP * 0.8),
      currencyReward: Math.floor(baseCurrency * 0.5),
      status: 'available'
    },
    {
      id: 'm_' + Math.random().toString(36).substr(2, 9),
      title: 'Core Challenge',
      description: 'Finish a module with >80% accuracy.',
      difficulty: 'medium',
      xpReward: baseXP,
      currencyReward: baseCurrency,
      status: 'available'
    },
    {
      id: 'm_' + Math.random().toString(36).substr(2, 9),
      title: 'Mastery Quest',
      description: 'Complete a timed challenge without errors.',
      difficulty: 'hard',
      xpReward: Math.floor(baseXP * 2),
      currencyReward: Math.floor(baseCurrency * 2.5),
      status: 'available'
    }
  ];

  return missions;
};
