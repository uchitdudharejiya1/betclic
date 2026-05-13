import {useQuery} from '@tanstack/react-query';

import {leagueRepository} from '../api/repositories/leagueRepository';
import type {SportKey} from '../config/sports';
import type {League} from '../types/domain/league';

export const useLeagues = (sport: SportKey) =>
  useQuery<League[]>({
    queryKey: ['leagues', sport],
    queryFn: ({signal}) => leagueRepository.list(sport, signal),
    staleTime: 10 * 60_000,
  });
