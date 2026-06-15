export type SportId =
  | 'live'
  | 'football'
  | 'basketball'
  | 'volleyball'
  | 'hockey'
  | 'martial';

export type SportItem = {
  id: SportId;
  icon: string;
  labelKey: string;
  count?: number;
};

export const SPORTS: SportItem[] = [
  {id: 'live', icon: '🔴', labelKey: 'sports.live', count: 10},
  {id: 'football', icon: '⚽', labelKey: 'sports.football'},
  {id: 'basketball', icon: '🏀', labelKey: 'sports.basketball'},
  {id: 'volleyball', icon: '🏐', labelKey: 'sports.volleyball'},
  {id: 'hockey', icon: '🏒', labelKey: 'sports.hockey'},
  {id: 'martial', icon: '🥊', labelKey: 'sports.martial'},
];
