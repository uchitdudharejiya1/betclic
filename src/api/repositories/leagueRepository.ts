import {SportKey, isSportAvailable} from '../../config/sports';
import type {League} from '../../types/domain/league';
import {basketballService} from '../services/basketball';
import {footballService} from '../services/football';
import {hockeyService} from '../services/hockey';
import {volleyballService} from '../services/volleyball';

const seasonalCurrent = (
  seasons: Array<{season: string; current: boolean}>,
): string | undefined => seasons.find(s => s.current)?.season;

export const leagueRepository = {
  list: async (sport: SportKey, signal?: AbortSignal): Promise<League[]> => {
    if (!isSportAvailable(sport)) return [];
    switch (sport) {
      case 'football': {
        const {response} = await footballService.leagues(undefined, signal);
        return response.map(item => ({
          id: String(item.league.id),
          name: item.league.name,
          sport,
          country: item.country.name,
          logo: item.league.logo,
          currentSeason: item.seasons.find(s => s.current)?.year,
        }));
      }
      case 'basketball': {
        const {response} = await basketballService.leagues(undefined, signal);
        return response.map(item => ({
          id: String(item.id),
          name: item.name,
          sport,
          country: item.country.name,
          logo: item.logo,
          currentSeason: seasonalCurrent(item.seasons),
        }));
      }
      case 'hockey': {
        const {response} = await hockeyService.leagues(undefined, signal);
        return response.map(item => ({
          id: String(item.id),
          name: item.name,
          sport,
          country: item.country.name,
          logo: item.logo,
          currentSeason: seasonalCurrent(item.seasons),
        }));
      }
      case 'volleyball': {
        const {response} = await volleyballService.leagues(undefined, signal);
        return response.map(item => ({
          id: String(item.id),
          name: item.name,
          sport,
          country: item.country.name,
          logo: item.logo,
          currentSeason: seasonalCurrent(item.seasons),
        }));
      }
      default:
        return [];
    }
  },
};
