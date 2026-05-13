import {apiClient} from '../client/apiClient';
import type {ApiResponse} from '../../types/api/common';
import type {
  RawVolleyballGame,
  RawVolleyballLeagueListItem,
  RawVolleyballOdds,
} from '../../types/api/volleyball';

const c = () => apiClient('volleyball');

export const volleyballService = {
  liveGames: (signal?: AbortSignal) =>
    c()
      .get<ApiResponse<RawVolleyballGame[]>>('/games', {
        params: {live: 'all'},
        signal,
      })
      .then(r => r.data),
  gamesByDate: (date: string, signal?: AbortSignal) =>
    c()
      .get<ApiResponse<RawVolleyballGame[]>>('/games', {
        params: {date},
        signal,
      })
      .then(r => r.data),
  leagues: (params?: {season?: string; country?: string}, signal?: AbortSignal) =>
    c()
      .get<ApiResponse<RawVolleyballLeagueListItem[]>>('/leagues', {
        params,
        signal,
      })
      .then(r => r.data),
  oddsForGame: (gameId: number, signal?: AbortSignal) =>
    c()
      .get<ApiResponse<RawVolleyballOdds[]>>('/odds', {
        params: {game: gameId},
        signal,
      })
      .then(r => r.data),
};
