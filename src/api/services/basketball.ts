import {apiClient} from '../client/apiClient';
import type {ApiResponse} from '../../types/api/common';
import type {
  RawBasketballGame,
  RawBasketballLeagueListItem,
  RawBasketballOdds,
} from '../../types/api/basketball';
import {getTodayDate, transformToLiveResponse} from '../../utils/liveGamesHelper';

const c = () => apiClient('basketball');

export const basketballService = {
  liveGames: async (signal?: AbortSignal) => {
    const response = await c()
      .get<ApiResponse<RawBasketballGame[]>>('/games', {
        params: {date: getTodayDate()},
        signal,
      })
      .then(r => r.data);
    
    return transformToLiveResponse(response, 'basketball');
  },
  gamesByDate: (date: string, signal?: AbortSignal) =>
    c()
      .get<ApiResponse<RawBasketballGame[]>>('/games', {
        params: {date},
        signal,
      })
      .then(r => r.data),
  leagues: (params?: {season?: string; country?: string}, signal?: AbortSignal) =>
    c()
      .get<ApiResponse<RawBasketballLeagueListItem[]>>('/leagues', {
        params,
        signal,
      })
      .then(r => r.data),
  oddsForGame: (gameId: number, signal?: AbortSignal) =>
    c()
      .get<ApiResponse<RawBasketballOdds[]>>('/odds', {
        params: {game: gameId},
        signal,
      })
      .then(r => r.data),
};
