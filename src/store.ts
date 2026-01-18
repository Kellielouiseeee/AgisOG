import { create } from 'zustand';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  level: number;
  xp: number;
  currency: number;
  dailyStats: {
    xpEarned: number;
  };
  equippedBadgeId?: string;
}

interface StoreState {
  user: User | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
  completeMission: (id: string) => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  user: null,
  loading: false,
  fetchUser: async () => {
    try {
      const res = await axios.get('/api/users/me');
      set({ user: res.data });
    } catch (e) {
      console.error(e);
    }
  },
  completeMission: async (id: string) => {
    try {
      const res = await axios.post(`/api/missions/${id}/complete`);
      
      // Check for item drops
      if (res.data.rewards.item) {
          alert(`🎉 You found a ${res.data.rewards.item.name}! Check your collection.`);
      }
      
      // Refresh user data to get new stats
      get().fetchUser();
    } catch (e: any) {
      console.error("Mission failed or capped", e);
      alert("Mission Failed: " + (e.response?.data?.error || "Unknown error"));
    }
  }
}));
