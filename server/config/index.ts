export const CONFIG = {
  DEFAULTS: {
    DAILY_XP_CAP: 1000,
    BASE_XP_MULTIPLIER: 1.0,
    REGION: 'US',
    CONTENT_RATING: 'PG-13'
  },
  LIMITS: {
    MAX_LOGS: 100,
    RATE_LIMIT_WINDOW: 60000, // 1 minute
    RATE_LIMIT_MAX: 100
  },
  PATHS: {
    DB: 'server/data/database.json'
  }
};
