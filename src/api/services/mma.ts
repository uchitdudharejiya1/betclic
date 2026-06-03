import {apiClient} from '../client/apiClient';
import type {ApiResponse} from '../../types/api/common';
import type {RawMmaFight} from '../../types/api/mma';
import {getTodayDate, transformToLiveResponse} from '../../utils/liveGamesHelper';

const c = () => apiClient('martial');

export const mmaService = {
  fightsByDate: (date: string, signal?: AbortSignal) =>
    c()
      .get<ApiResponse<RawMmaFight[]>>('/fights', {
        params: {date},
        signal,
      })
      .then(r => r.data),
  liveFights: async (signal?: AbortSignal) => {
    const response = await c()
      .get<ApiResponse<RawMmaFight[]>>('/fights', {
        params: {date: getTodayDate()},
        signal,
      })
      .then(r => r.data);
    
    return transformToLiveResponse(response, 'mma');
  },
};
