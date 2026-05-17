import {keepPreviousData, useQuery} from '@tanstack/react-query';

import {matchRepository} from '../api/repositories/matchRepository';
import type {SportId} from '../constants/sports';
import type {Match} from '../types/domain/match';

export type UseFixturesOptions = {
  enabled?: boolean;
};

export const useFixtures = (
  date: string,
  sport: SportId,
  options?: UseFixturesOptions,
) =>
  useQuery<Match[]>({
    queryKey: ['matches', 'date', date, sport],
    queryFn: ({signal}) =>
      sport === 'live'
        ? matchRepository.allByDate(date, signal)
        : matchRepository.byDate(sport, date, signal),
    enabled: options?.enabled ?? true,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
