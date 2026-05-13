import type {SportKey} from '../../config/sports';

export type League = {
  id: string;
  name: string;
  sport: SportKey;
  country?: string;
  logo?: string | null;
  currentSeason?: string | number;
};
