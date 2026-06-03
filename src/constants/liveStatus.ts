/**
 * Live status constants for different sports APIs
 * Based on API-Sports documentation
 */

export const LIVE_STATUS = {
  FOOTBALL: ['1H', 'HT', '2H', 'ET', 'BT', 'P', 'INT'] as const,
  BASKETBALL: ['Q1', 'Q2', 'Q3', 'Q4', 'HT', 'OT', 'BT'] as const,
  HOCKEY: ['P1', 'P2', 'P3', 'OT', 'PT', 'BT'] as const,
  VOLLEYBALL: ['S1', 'S2', 'S3', 'S4', 'S5'] as const,
  BASEBALL: ['IN1', 'IN2', 'IN3', 'IN4', 'IN5', 'IN6', 'IN7', 'IN8', 'IN9'] as const,
  MMA: ['IN', 'PF', 'LIVE', 'EOR', 'WO'] as const,
} as const;

export type FootballLiveStatus = (typeof LIVE_STATUS.FOOTBALL)[number];
export type BasketballLiveStatus = (typeof LIVE_STATUS.BASKETBALL)[number];
export type HockeyLiveStatus = (typeof LIVE_STATUS.HOCKEY)[number];
export type VolleyballLiveStatus = (typeof LIVE_STATUS.VOLLEYBALL)[number];
export type BaseballLiveStatus = (typeof LIVE_STATUS.BASEBALL)[number];
export type MmaLiveStatus = (typeof LIVE_STATUS.MMA)[number];

/**
 * Check if a status indicates a live game
 */
export const isLiveStatus = {
  football: (status: string): status is FootballLiveStatus =>
    LIVE_STATUS.FOOTBALL.includes(status as FootballLiveStatus),
  basketball: (status: string): status is BasketballLiveStatus =>
    LIVE_STATUS.BASKETBALL.includes(status as BasketballLiveStatus),
  hockey: (status: string): status is HockeyLiveStatus =>
    LIVE_STATUS.HOCKEY.includes(status as HockeyLiveStatus),
  volleyball: (status: string): status is VolleyballLiveStatus =>
    LIVE_STATUS.VOLLEYBALL.includes(status as VolleyballLiveStatus),
  baseball: (status: string): status is BaseballLiveStatus =>
    LIVE_STATUS.BASEBALL.includes(status as BaseballLiveStatus),
  mma: (status: string): status is MmaLiveStatus =>
    LIVE_STATUS.MMA.includes(status as MmaLiveStatus),
};

/**
 * API endpoint configuration for each sport
 */
export const LIVE_API_CONFIG = {
  FOOTBALL: {
    endpoint: '/fixtures',
    supportsLiveParam: true,
    liveParam: {live: 'all'},
    dateParam: (date: string) => ({date}),
  },
  BASKETBALL: {
    endpoint: '/games',
    supportsLiveParam: false,
    dateParam: (date: string) => ({date}),
  },
  HOCKEY: {
    endpoint: '/games',
    supportsLiveParam: false,
    dateParam: (date: string) => ({date}),
  },
  VOLLEYBALL: {
    endpoint: '/games',
    supportsLiveParam: false,
    dateParam: (date: string) => ({date}),
  },
  BASEBALL: {
    endpoint: '/games',
    supportsLiveParam: false,
    dateParam: (date: string) => ({date}),
  },
  MMA: {
    endpoint: '/fights',
    supportsLiveParam: false,
    dateParam: (date: string) => ({date}),
  },
} as const;
