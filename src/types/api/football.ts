export type RawFootballTeam = {
  id: number;
  name: string;
  logo: string;
  winner?: boolean | null;
};

export type RawFootballLeague = {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string | null;
  season: number;
  round: string;
};

export type RawFootballFixture = {
  fixture: {
    id: number;
    referee: string | null;
    timezone: string;
    date: string;
    timestamp: number;
    status: {long: string; short: string; elapsed: number | null};
    venue: {id: number | null; name: string | null; city: string | null};
  };
  league: RawFootballLeague;
  teams: {home: RawFootballTeam; away: RawFootballTeam};
  goals: {home: number | null; away: number | null};
  score: {
    halftime: {home: number | null; away: number | null};
    fulltime: {home: number | null; away: number | null};
    extratime: {home: number | null; away: number | null};
    penalty: {home: number | null; away: number | null};
  };
};

export type RawFootballLeagueListItem = {
  league: {id: number; name: string; type: string; logo: string};
  country: {name: string; code: string | null; flag: string | null};
  seasons: Array<{year: number; start: string; end: string; current: boolean}>;
};

export type RawFootballOddsValue = {value: string; odd: string};
export type RawFootballOddsBet = {id: number; name: string; values: RawFootballOddsValue[]};
export type RawFootballOddsBookmaker = {id: number; name: string; bets: RawFootballOddsBet[]};

export type RawFootballOdds = {
  league: {id: number; name: string; country: string; logo: string; flag: string | null; season: number};
  fixture: {id: number; timezone: string; date: string; timestamp: number};
  update: string;
  bookmakers: RawFootballOddsBookmaker[];
};
