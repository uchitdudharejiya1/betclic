export type DayItem = {
  key: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
  date: number;
};

export const DAYS: DayItem[] = [
  {key: 'mon', date: 5},
  {key: 'tue', date: 6},
  {key: 'wed', date: 7},
  {key: 'thu', date: 8},
  {key: 'fri', date: 9},
  {key: 'sat', date: 10},
  {key: 'sun', date: 11},
];
