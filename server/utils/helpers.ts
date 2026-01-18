/**
 * Calculates XP required for the next level.
 * Formula: 100 * (Level ^ 1.5)
 */
export const calculateNextLevelXp = (currentLevel: number): number => {
  return Math.floor(100 * Math.pow(currentLevel, 1.5));
};

/**
 * Selects a random item from a list based on rarity weights.
 */
export const weightedRandomRarity = (): 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' => {
  const rand = Math.random();
  if (rand > 0.95) return 'legendary';
  if (rand > 0.85) return 'epic';
  if (rand > 0.70) return 'rare';
  if (rand > 0.50) return 'uncommon';
  return 'common';
};
