import {keepPreviousData, useQuery} from '@tanstack/react-query';

import {matchRepository} from '../api/repositories/matchRepository';
import type {SportId} from '../constants/sports';
import type {Match} from '../types/domain/match';

const LIVE_POLL_MS = 30_000;

export type UseLiveMatchesOptions = {
  enabled?: boolean;
};

export const useLiveMatches = (
  sport: SportId,
  options?: UseLiveMatchesOptions,
) =>
  useQuery<Match[]>({
    queryKey: ['matches', 'live', sport],
    queryFn: ({signal}) =>
      sport === 'live'
        ? matchRepository.allLive(signal)
        : matchRepository.live(sport, signal),
    enabled: options?.enabled ?? true,
    refetchInterval: LIVE_POLL_MS,
    refetchIntervalInBackground: false,
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  });
