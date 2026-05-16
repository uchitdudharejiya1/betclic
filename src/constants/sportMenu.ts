import type {SportId} from './sports';

export type SportMenuItem = {
  id: Exclude<SportId, 'live'>;
  labelKey: string;
  icon: string;
  count: number;
};

export const SPORT_MENU: SportMenuItem[] = [
  {id: 'football', labelKey: 'sports.football', icon: '⚽', count: 9},
  {id: 'basketball', labelKey: 'sports.basketball', icon: '🏀', count: 3},
  {id: 'volleyball', labelKey: 'sports.volleyball', icon: '🏐', count: 3},
  {id: 'hockey', labelKey: 'sports.hockey', icon: '🏒', count: 3},
  {id: 'martial', labelKey: 'sports.martial', icon: '🥊', count: 3},
];
