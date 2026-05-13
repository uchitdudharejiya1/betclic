import {SportKey, isSportAvailable} from '../../config/sports';
import {
  mapBasketballOddsToBook,
  mapFootballOddsToBook,
} from '../../modules/odds/oddsMapper';
import type {OddsBook} from '../../types/domain/odds';
import {basketballService} from '../services/basketball';
import {footballService} from '../services/football';
import {hockeyService} from '../services/hockey';
import {volleyballService} from '../services/volleyball';

export const oddsRepository = {
  forMatch: async (
    sport: SportKey,
    matchId: string,
    signal?: AbortSignal,
  ): Promise<OddsBook | null> => {
    if (!isSportAvailable(sport)) return null;
    const id = Number.parseInt(matchId, 10);
    if (!Number.isFinite(id)) return null;

    switch (sport) {
      case 'football': {
        const {response} = await footballService.oddsForFixture(id, signal);
        return response[0] ? mapFootballOddsToBook(response[0]) : null;
      }
      case 'basketball': {
        const {response} = await basketballService.oddsForGame(id, signal);
        return response[0] ? mapBasketballOddsToBook(response[0]) : null;
      }
      case 'hockey': {
        const {response} = await hockeyService.oddsForGame(id, signal);
        return response[0] ? mapBasketballOddsToBook(response[0]) : null;
      }
      case 'volleyball': {
        const {response} = await volleyballService.oddsForGame(id, signal);
        return response[0] ? mapBasketballOddsToBook(response[0]) : null;
      }
      default:
        return null;
    }
  },
};
