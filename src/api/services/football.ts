import {apiClient} from '../client/apiClient';
import type {ApiResponse} from '../../types/api/common';
import type {
  RawFootballFixture,
  RawFootballLeagueListItem,
  RawFootballOdds,
} from '../../types/api/football';

const c = () => apiClient('football');

export const footballService = {
  liveFixtures: (signal?: AbortSignal) =>
    c()
      .get<ApiResponse<RawFootballFixture[]>>('/fixtures', {
        params: {live: 'all'},
        signal,
      })
      .then(r => r.data),
  fixturesByDate: (date: string, signal?: AbortSignal) =>
    c()
      .get<ApiResponse<RawFootballFixture[]>>('/fixtures', {
        params: {date},
        signal,
      })
      .then(r => r.data),
  leagues: (params?: {season?: number; country?: string}, signal?: AbortSignal) =>
    c()
      .get<ApiResponse<RawFootballLeagueListItem[]>>('/leagues', {
        params,
        signal,
      })
      .then(r => r.data),
  oddsForFixture: (fixtureId: number, signal?: AbortSignal) =>
    c()
      .get<ApiResponse<RawFootballOdds[]>>('/odds', {
        params: {fixture: fixtureId},
        signal,
      })
      .then(r => r.data),
};
