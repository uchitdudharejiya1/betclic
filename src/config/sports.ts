import type {SportId} from '../constants/sports';
import { ENV } from './env';

export type SportKey = Exclude<SportId, 'live'>;

export type SportHostConfig = {
  baseURL: string;
  host: string;
  available: boolean;
};

const USE_DIRECT = Boolean(ENV.APISPORTS_KEY);

// Debug logging to show which API configuration is being used
if (__DEV__) {
  console.log(`🔧 API Configuration Mode: ${USE_DIRECT ? 'Direct API-Sports' : 'RapidAPI'}`);
  console.log(`  APISPORTS_KEY set: ${Boolean(ENV.APISPORTS_KEY)}`);
}

export const SPORT_HOSTS: Record<SportKey, SportHostConfig> = USE_DIRECT
  ? {
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
      tennis: {baseURL: '', host: '', available: false},
    }
  : {
  football: {
    baseURL: 'https://api-football-v1.p.rapidapi.com/v3',
    host: 'api-football-v1.p.rapidapi.com',
    available: true,
  },
  basketball: {
    baseURL: 'https://api-basketball.p.rapidapi.com',
    host: 'api-basketball.p.rapidapi.com',
    available: true,
  },
  hockey: {
    baseURL: 'https://api-hockey.p.rapidapi.com',
    host: 'api-hockey.p.rapidapi.com',
    available: true,
  },
  volleyball: {
    baseURL: 'https://api-volleyball.p.rapidapi.com',
    host: 'api-volleyball.p.rapidapi.com',
    available: true,
  },
  martial: {
    baseURL: 'https://api-mma.p.rapidapi.com',
    host: 'api-mma.p.rapidapi.com',
    available: true,
  },
  tennis: {baseURL: '', host: '', available: false},
};

export const isSportAvailable = (sport: SportKey): boolean =>
  SPORT_HOSTS[sport].available;

export const SUPPORTED_SPORTS: SportKey[] = (
  Object.keys(SPORT_HOSTS) as SportKey[]
).filter(isSportAvailable);
