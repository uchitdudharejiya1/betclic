import {useQuery} from '@tanstack/react-query';

import {matchRepository} from '../api/repositories/matchRepository';
import type {SportId} from '../constants/sports';
import type {Match} from '../types/domain/match';

export const useFixtures = (date: string, sport: SportId) =>
  useQuery<Match[]>({
    queryKey: ['matches', 'date', date, sport],
    queryFn: ({signal}) =>
      sport === 'live'
        ? matchRepository.allByDate(date, signal)
        : matchRepository.byDate(sport, date, signal),
  });
