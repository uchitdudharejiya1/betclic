export type WeekdayKey =
  | 'mon'
  | 'tue'
  | 'wed'
  | 'thu'
  | 'fri'
  | 'sat'
  | 'sun';

export type DayItem = {
  key: string;
  date: number;
  weekdayKey: WeekdayKey;
  isToday: boolean;
};

const WEEKDAY_BY_INDEX: WeekdayKey[] = [
  'sun',
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
];

const toIsoDate = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const todayKey = (now: Date = new Date()): string => toIsoDate(now);

export const buildCenteredWeek = (today: Date = new Date()): DayItem[] => {
  const todayIso = toIsoDate(today);
  const items: DayItem[] = [];
  for (let offset = -3; offset <= 3; offset++) {
    const d = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + offset,
    );
    const iso = toIsoDate(d);
    items.push({
      key: iso,
      date: d.getDate(),
      weekdayKey: WEEKDAY_BY_INDEX[d.getDay()],
      isToday: iso === todayIso,
    });
  }
  return items;
};
