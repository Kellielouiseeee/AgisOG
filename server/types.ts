export interface User {
  id: string;
  username: string;
  email: string;
  xp: number;
  level: number;
  currency: number; // Soft currency
  streak: number;
  lastLogin: string;
  dailyXpGain: number;
  lastDailyReset: string;
  inventory: string[]; // IDs of items/badges
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  currencyReward: number;
  status: 'available' | 'active' | 'completed';
  expiresAt?: string;
}

export interface ApiResponse&lt;T&gt; {
  success: boolean;
  data?: T;
  error?: string;
}
