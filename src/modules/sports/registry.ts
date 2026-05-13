import {SportKey, isSportAvailable} from '../../config/sports';
import {leagueRepository} from '../../api/repositories/leagueRepository';
import {matchRepository} from '../../api/repositories/matchRepository';
import {oddsRepository} from '../../api/repositories/oddsRepository';
import type {SportAdapter} from './SportAdapter';

const buildAdapter = (key: SportKey): SportAdapter => ({
  key,
  available: isSportAvailable(key),
  liveMatches: signal => matchRepository.live(key, signal),
  matchesByDate: (date, signal) => matchRepository.byDate(key, date, signal),
  leagues: signal => leagueRepository.list(key, signal),
  oddsForMatch: (matchId, signal) => oddsRepository.forMatch(key, matchId, signal),
});

const REGISTRY: Record<SportKey, SportAdapter> = {
  football: buildAdapter('football'),
  basketball: buildAdapter('basketball'),
  hockey: buildAdapter('hockey'),
  volleyball: buildAdapter('volleyball'),
  martial: buildAdapter('martial'),
  tennis: buildAdapter('tennis'),
};

export const sportRegistry = REGISTRY;

export const getSportAdapter = (sport: SportKey): SportAdapter => REGISTRY[sport];
