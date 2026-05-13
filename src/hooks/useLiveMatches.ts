import {useQuery} from '@tanstack/react-query';

import {matchRepository} from '../api/repositories/matchRepository';
import type {SportId} from '../constants/sports';
import type {Match} from '../types/domain/match';

export const useLiveMatches = (sport: SportId) =>
  useQuery<Match[]>({
    queryKey: ['matches', 'live', sport],
    queryFn: ({signal}) =>
      sport === 'live'
        ? matchRepository.allLive(signal)
        : matchRepository.live(sport, signal),
    refetchInterval: 60_000,
  });
