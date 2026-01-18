export interface Mission {
  id: string;
  userId: string;
  title: string;
  description: string;
  xpReward: number;
  currencyReward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'active' | 'completed' | 'failed';
  expiresAt: string;
  completedAt?: string;
  tags: string[];
  isSeasonal?: boolean;
}

export interface MissionTemplate {
  id: string;
  title: string;
  description: string;
  baseXp: number;
  baseCurrency: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}
