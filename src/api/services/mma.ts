import {apiClient} from '../client/apiClient';
import type {ApiResponse} from '../../types/api/common';
import type {RawMmaFight} from '../../types/api/mma';

const c = () => apiClient('martial');

export const mmaService = {
  fightsByDate: (date: string, signal?: AbortSignal) =>
    c()
      .get<ApiResponse<RawMmaFight[]>>('/fights', {
        params: {date},
        signal,
      })
      .then(r => r.data),
  liveFights: (signal?: AbortSignal) =>
    c()
      .get<ApiResponse<RawMmaFight[]>>('/fights', {
        params: {live: 'all'},
        signal,
      })
      .then(r => r.data),
};
