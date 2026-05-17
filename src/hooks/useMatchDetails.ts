import {keepPreviousData, useQuery} from '@tanstack/react-query';

import {oddsRepository} from '../api/repositories/oddsRepository';
import type {SportKey} from '../config/sports';
import type {OddsBook} from '../types/domain/odds';

const ODDS_POLL_MS = 30_000;

export const useMatchOdds = (sport: SportKey, matchId: string) =>
  useQuery<OddsBook | null>({
    queryKey: ['odds', sport, matchId],
    queryFn: ({signal}) => oddsRepository.forMatch(sport, matchId, signal),
    enabled: Boolean(matchId),
    refetchInterval: ODDS_POLL_MS,
    refetchIntervalInBackground: false,
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  });
