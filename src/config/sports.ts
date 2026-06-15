import type {SportId} from '../constants/sports';
import {ENV} from './env';

export type SportKey = Exclude<SportId, 'live'>;

export type SportHostConfig = {
  baseURL: string;
  host: string;
  available: boolean;
};

if (__DEV__ && !ENV.APISPORTS_KEY) {
  console.warn(
    '[config] APISPORTS_KEY is empty. Add it to .env and rebuild the app.',
  );
}

export const SPORT_HOSTS: Record<SportKey, SportHostConfig> = {
  football: {
    baseURL: 'https://v3.football.api-sports.io',
    host: 'v3.football.api-sports.io',
    available: true,
  },
  basketball: {
    baseURL: 'https://v1.basketball.api-sports.io',
    host: 'v1.basketball.api-sports.io',
    available: true,
  },
  hockey: {
    baseURL: 'https://v1.hockey.api-sports.io',
    host: 'v1.hockey.api-sports.io',
    available: true,
  },
  volleyball: {
    baseURL: 'https://v1.volleyball.api-sports.io',
    host: 'v1.volleyball.api-sports.io',
    available: true,
  },
  martial: {
    baseURL: 'https://v1.mma.api-sports.io',
    host: 'v1.mma.api-sports.io',
    available: true,
  },
};

export const isSportAvailable = (sport: SportKey): boolean =>
  SPORT_HOSTS[sport].available;

export const SUPPORTED_SPORTS: SportKey[] = (
  Object.keys(SPORT_HOSTS) as SportKey[]
).filter(isSportAvailable);
