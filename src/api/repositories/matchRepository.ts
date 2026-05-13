import {SportKey, isSportAvailable, SUPPORTED_SPORTS} from '../../config/sports';
import {
  mapBasketballGameToMatch,
  mapFootballFixtureToMatch,
  mapHockeyGameToMatch,
  mapMmaFightToMatch,
  mapVolleyballGameToMatch,
} from '../../modules/matches/matchMapper';
import type {Match} from '../../types/domain/match';
import {basketballService} from '../services/basketball';
import {footballService} from '../services/football';
import {hockeyService} from '../services/hockey';
import {mmaService} from '../services/mma';
import {volleyballService} from '../services/volleyball';

const isoDate = (d: Date = new Date()): string => d.toISOString().slice(0, 10);

export const matchRepository = {
  live: async (sport: SportKey, signal?: AbortSignal): Promise<Match[]> => {
    if (!isSportAvailable(sport)) return [];
    switch (sport) {
      case 'football':
        return ((await footballService.liveFixtures(signal)).response ?? []).map(
          mapFootballFixtureToMatch,
        );
      case 'basketball':
        return ((await basketballService.liveGames(signal)).response ?? []).map(
          mapBasketballGameToMatch,
        );
      case 'hockey':
        return ((await hockeyService.liveGames(signal)).response ?? []).map(
          mapHockeyGameToMatch,
        );
      case 'volleyball':
        return ((await volleyballService.liveGames(signal)).response ?? []).map(
          mapVolleyballGameToMatch,
        );
      case 'martial':
        return ((await mmaService.liveFights(signal)).response ?? []).map(
          mapMmaFightToMatch,
        );
      default:
        return [];
    }
  },

  byDate: async (
    sport: SportKey,
    date: string,
    signal?: AbortSignal,
  ): Promise<Match[]> => {
    if (!isSportAvailable(sport)) return [];
    switch (sport) {
      case 'football':
        return ((await footballService.fixturesByDate(date, signal)).response ?? []).map(
          mapFootballFixtureToMatch,
        );
      case 'basketball':
        return ((await basketballService.gamesByDate(date, signal)).response ?? []).map(
          mapBasketballGameToMatch,
        );
      case 'hockey':
        return ((await hockeyService.gamesByDate(date, signal)).response ?? []).map(
          mapHockeyGameToMatch,
        );
      case 'volleyball':
        return ((await volleyballService.gamesByDate(date, signal)).response ?? []).map(
          mapVolleyballGameToMatch,
        );
      case 'martial':
        return ((await mmaService.fightsByDate(date, signal)).response ?? []).map(
          mapMmaFightToMatch,
        );
      default:
        return [];
    }
  },

  allLive: async (signal?: AbortSignal): Promise<Match[]> => {
    const results = await Promise.allSettled(
      SUPPORTED_SPORTS.map(s => matchRepository.live(s, signal)),
    );
    return results.flatMap(r => (r.status === 'fulfilled' ? r.value : []));
  },

  allByDate: async (
    date: string = isoDate(),
    signal?: AbortSignal,
  ): Promise<Match[]> => {
    const results = await Promise.allSettled(
      SUPPORTED_SPORTS.map(s => matchRepository.byDate(s, date, signal)),
    );
    return results.flatMap(r => (r.status === 'fulfilled' ? r.value : []));
  },
};
