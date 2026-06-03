import {apiClient} from '../client/apiClient';
import type {ApiResponse} from '../../types/api/common';
import type {
  RawHockeyGame,
  RawHockeyLeagueListItem,
  RawHockeyOdds,
} from '../../types/api/hockey';
import {getTodayDate, transformToLiveResponse} from '../../utils/liveGamesHelper';

const c = () => apiClient('hockey');

export const hockeyService = {
  liveGames: async (signal?: AbortSignal) => {
    const response = await c()
      .get<ApiResponse<RawHockeyGame[]>>('/games', {
        params: {date: getTodayDate()},
        signal,
      })
      .then(r => r.data);
    
    return transformToLiveResponse(response, 'hockey');
  },
  gamesByDate: (date: string, signal?: AbortSignal) =>
    c()
      .get<ApiResponse<RawHockeyGame[]>>('/games', {
        params: {date},
        signal,
      })
      .then(r => r.data),
  leagues: (params?: {season?: string; country?: string}, signal?: AbortSignal) =>
    c()
      .get<ApiResponse<RawHockeyLeagueListItem[]>>('/leagues', {
        params,
        signal,
      })
      .then(r => r.data),
  oddsForGame: (gameId: number, signal?: AbortSignal) =>
    c()
      .get<ApiResponse<RawHockeyOdds[]>>('/odds', {
        params: {game: gameId},
        signal,
      })
      .then(r => r.data),
};
