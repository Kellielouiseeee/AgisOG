export interface SystemConfig {
  dailyXpCap: number;
  baseXpMultiplier: number;
  maintenanceMode: boolean;
  regionRules: {
    [region: string]: {
      enabled: boolean;
      contentRating: string;
    }
  };
}

export interface SystemLog {
  id: string;
  timestamp: string;
  action: string;
  adminId: string;
  details: any;
}

export interface Season {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  themeTags: string[];
  modifiers: {
    xpMultiplier: number;
    currencyMultiplier: number;
  };
}
