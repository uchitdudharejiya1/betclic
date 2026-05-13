import type {SportKey} from '../../config/sports';
import type {League} from '../../types/domain/league';
import type {Match} from '../../types/domain/match';
import type {OddsBook} from '../../types/domain/odds';

export interface SportAdapter {
  key: SportKey;
  available: boolean;
  liveMatches: (signal?: AbortSignal) => Promise<Match[]>;
  matchesByDate: (date: string, signal?: AbortSignal) => Promise<Match[]>;
  leagues: (signal?: AbortSignal) => Promise<League[]>;
  oddsForMatch: (matchId: string, signal?: AbortSignal) => Promise<OddsBook | null>;
}
