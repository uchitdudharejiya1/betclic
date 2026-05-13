export type RawBasketballTeam = {
  id: number;
  name: string;
  logo: string | null;
};

export type RawBasketballLeague = {
  id: number;
  name: string;
  type: string;
  season: string;
  logo: string | null;
};

export type RawBasketballScores = {
  quarter_1: number | null;
  quarter_2: number | null;
  quarter_3: number | null;
  quarter_4: number | null;
  over_time: number | null;
  total: number | null;
};

export type RawBasketballGame = {
  id: number;
  date: string;
  time: string;
  timestamp: number;
  timezone: string;
  stage: string | null;
  week: string | null;
  status: {long: string; short: string; timer: string | null};
  league: RawBasketballLeague;
  country: {id: number; name: string; code: string | null; flag: string | null};
  teams: {home: RawBasketballTeam; away: RawBasketballTeam};
  scores: {home: RawBasketballScores; away: RawBasketballScores};
};

export type RawBasketballLeagueListItem = {
  id: number;
  name: string;
  type: string;
  logo: string | null;
  country: {id: number; name: string; code: string | null; flag: string | null};
  seasons: Array<{season: string; start: string; end: string; current: boolean}>;
};

export type RawBasketballOddsValue = {value: string; odd: string};
export type RawBasketballOddsBet = {id: number; name: string; values: RawBasketballOddsValue[]};
export type RawBasketballOddsBookmaker = {id: number; name: string; bets: RawBasketballOddsBet[]};

export type RawBasketballOdds = {
  league: {id: number; season: string; name: string; logo: string | null};
  country: {id: number; name: string; code: string | null; flag: string | null};
  game: {id: number; date: string; time: string; timestamp: number; timezone: string};
  update: string;
  bookmakers: RawBasketballOddsBookmaker[];
};
