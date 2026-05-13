import type {SportKey} from '../../config/sports';

export type MatchStatus =
  | 'scheduled'
  | 'live'
  | 'halftime'
  | 'finished'
  | 'postponed'
  | 'cancelled'
  | 'unknown';

export type MatchScore = {
  home: string;
  away: string;
};

export type Match = {
  id: string;
  sport: SportKey;
  competition: string;
  league: {id: string; name: string; logo?: string | null};
  home: {id: string; name: string; logo?: string | null};
  away: {id: string; name: string; logo?: string | null};
  score: MatchScore;
  status: MatchStatus;
  clock?: string;
  startsAtMs: number;
  hasMedia: boolean;
};
