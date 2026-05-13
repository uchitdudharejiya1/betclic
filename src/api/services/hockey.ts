import {apiClient} from '../client/apiClient';
import type {ApiResponse} from '../../types/api/common';
import type {
  RawHockeyGame,
  RawHockeyLeagueListItem,
  RawHockeyOdds,
} from '../../types/api/hockey';

const c = () => apiClient('hockey');

export const hockeyService = {
  liveGames: (signal?: AbortSignal) =>
    c()
      .get<ApiResponse<RawHockeyGame[]>>('/games', {
        params: {live: 'all'},
        signal,
      })
      .then(r => r.data),
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
