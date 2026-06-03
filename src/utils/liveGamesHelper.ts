/**
 * Reusable helper for fetching live games across different sports
 * Handles the different API approaches (live parameter vs date filtering)
 */

import type {ApiResponse} from '../types/api/common';
import {isLiveStatus} from '../constants/liveStatus';

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayDate = (): string => new Date().toISOString().slice(0, 10);

/**
 * Filter games/fights by live status
 */
export const filterLiveGames = <T extends {status: {short: string}}>(
  games: T[],
  sport: 'football' | 'basketball' | 'hockey' | 'volleyball' | 'baseball' | 'mma',
): T[] => {
  return games.filter(game => {
    switch (sport) {
      case 'football':
        return isLiveStatus.football(game.status.short);
      case 'basketball':
        return isLiveStatus.basketball(game.status.short);
      case 'hockey':
        return isLiveStatus.hockey(game.status.short);
      case 'volleyball':
        return isLiveStatus.volleyball(game.status.short);
      case 'baseball':
        return isLiveStatus.baseball(game.status.short);
      case 'mma':
        return isLiveStatus.mma(game.status.short);
      default:
        return false;
    }
  });
};

/**
 * Transform API response to include only live games
 */
export const transformToLiveResponse = <T extends {status: {short: string}}>(
  response: ApiResponse<T[]>,
  sport: 'football' | 'basketball' | 'hockey' | 'volleyball' | 'baseball' | 'mma',
): ApiResponse<T[]> => {
  const liveGames = filterLiveGames(response.response ?? [], sport);
  
  return {
    ...response,
    response: liveGames,
    results: liveGames.length,
  };
};
