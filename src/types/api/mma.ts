export type RawMmaFighter = {
  id: number;
  name: string;
  logo: string | null;
  winner?: boolean | null;
};

export type RawMmaFight = {
  id: number;
  slug: string;
  date: string;
  timestamp: number;
  timezone: string;
  status: {long: string; short: string};
  is_main: boolean;
  category: string;
  fighters: {first: RawMmaFighter; second: RawMmaFighter};
  league?: {id: number; name: string; type: string; logo: string | null} | null;
  round?: {
    current: number;
    total: number;
    time?: string;
  } | null;
};
