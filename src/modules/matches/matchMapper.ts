import type {SportKey} from '../../config/sports';
import type {
  RawBasketballGame,
  RawBasketballScores,
} from '../../types/api/basketball';
import type {RawFootballFixture} from '../../types/api/football';
import type {RawMmaFight} from '../../types/api/mma';
import type {RawTennisEvent, RawTennisScore} from '../../types/api/tennis';
import type {Match, MatchStatus} from '../../types/domain/match';
import {hasValidTennisScore, extractTennisScores} from '../../api/services/tennis';

const FOOTBALL_LIVE_SHORT = new Set([
  '1H',
  '2H',
  'HT',
  'ET',
  'BT',
  'P',
  'LIVE',
  'INT',
]);

const FOOTBALL_FINISHED = new Set(['FT', 'AET', 'PEN']);

const mapFootballStatus = (short: string): MatchStatus => {
  if (FOOTBALL_LIVE_SHORT.has(short)) {
    if (short === 'HT') return 'halftime';
    return 'live';
  }
  if (FOOTBALL_FINISHED.has(short)) return 'finished';
  if (short === 'PST') return 'postponed';
  if (short === 'CANC' || short === 'ABD') return 'cancelled';
  if (short === 'NS' || short === 'TBD') return 'scheduled';
  return 'unknown';
};

export const mapFootballFixtureToMatch = (f: RawFootballFixture): Match => ({
  id: String(f.fixture.id),
  sport: 'football',
  competition: `${f.league.name}${f.league.round ? ' · ' + f.league.round : ''}`,
  league: {id: String(f.league.id), name: f.league.name, logo: f.league.logo},
  home: {id: String(f.teams.home.id), name: f.teams.home.name, logo: f.teams.home.logo},
  away: {id: String(f.teams.away.id), name: f.teams.away.name, logo: f.teams.away.logo},
  score: {
    home: f.goals.home != null ? String(f.goals.home) : '-',
    away: f.goals.away != null ? String(f.goals.away) : '-',
  },
  status: mapFootballStatus(f.fixture.status.short),
  clock: f.fixture.status.elapsed != null ? `${f.fixture.status.elapsed}'` : undefined,
  startsAtMs: f.fixture.timestamp * 1000,
  hasMedia: false,
});

const summarizeScores = (s: RawBasketballScores): string => {
  if (s.total != null) return String(s.total);
  const parts = [s.quarter_1, s.quarter_2, s.quarter_3, s.quarter_4, s.over_time]
    .filter((q): q is number => q != null);
  return parts.length ? String(parts.reduce((a, b) => a + b, 0)) : '-';
};

const detailedScore = (s: RawBasketballScores): string => {
  const tokens: string[] = [];
  for (const q of [s.quarter_1, s.quarter_2, s.quarter_3, s.quarter_4]) {
    if (q != null) tokens.push(String(q));
  }
  if (s.over_time != null) tokens.push(String(s.over_time));
  return tokens.length ? tokens.join(' ') : summarizeScores(s);
};

const mapPeriodicStatus = (short: string): MatchStatus => {
  if (short === 'NS') return 'scheduled';
  if (short === 'FT' || short === 'AOT') return 'finished';
  if (short === 'POST') return 'postponed';
  if (short === 'CANC') return 'cancelled';
  return 'live';
};

export const mapBasketballGameToMatch = (g: RawBasketballGame): Match =>
  mapPeriodicGameToMatch(g, 'basketball');

export const mapHockeyGameToMatch = (g: RawBasketballGame): Match =>
  mapPeriodicGameToMatch(g, 'hockey');

export const mapVolleyballGameToMatch = (g: RawBasketballGame): Match =>
  mapPeriodicGameToMatch(g, 'volleyball');

const mapPeriodicGameToMatch = (g: RawBasketballGame, sport: SportKey): Match => {
  const homeRaw = (g as unknown as any).scores?.home;
  const awayRaw = (g as unknown as any).scores?.away;
  const homeScore =
    homeRaw == null
      ? '-'
      : typeof homeRaw === 'number'
      ? String(homeRaw)
      : sport === 'volleyball'
      ? detailedScore(homeRaw)
      : summarizeScores(homeRaw);
  const awayScore =
    awayRaw == null
      ? '-'
      : typeof awayRaw === 'number'
      ? String(awayRaw)
      : sport === 'volleyball'
      ? detailedScore(awayRaw)
      : summarizeScores(awayRaw);

  return {
    id: String(g.id),
    sport,
    competition: `${g.league.name}${g.stage ? ' · ' + g.stage : ''}`,
    league: {id: String(g.league.id), name: g.league.name, logo: g.league.logo},
    home: {id: String(g.teams.home.id), name: g.teams.home.name, logo: g.teams.home.logo},
    away: {id: String(g.teams.away.id), name: g.teams.away.name, logo: g.teams.away.logo},
    score: {home: homeScore, away: awayScore},
    status: mapPeriodicStatus(g.status.short),
    clock: g.status.timer ?? g.status.long,
    startsAtMs: g.timestamp * 1000,
    hasMedia: false,
  };
};

const mapMmaStatus = (short: string): MatchStatus => {
  if (short === 'NS') return 'scheduled';
  if (short === 'FT') return 'finished';
  if (short === 'CANC') return 'cancelled';
  return 'live';
};

export const mapMmaFightToMatch = (f: RawMmaFight): Match => ({
  id: String(f.id),
  sport: 'martial',
  competition: f.league?.name ?? f.category,
  league: {id: String(f.league?.id ?? 0), name: f.league?.name ?? 'MMA', logo: f.league?.logo ?? null},
  home: {id: String(f.fighters.first.id), name: f.fighters.first.name, logo: f.fighters.first.logo},
  away: {id: String(f.fighters.second.id), name: f.fighters.second.name, logo: f.fighters.second.logo},
  score: {home: '—', away: '—'},
  status: mapMmaStatus(f.status.short),
  clock: f.status.long,
  startsAtMs: f.timestamp * 1000,
  hasMedia: false,
});

const mapTennisStatus = (completed: boolean, commenceTime: string): MatchStatus => {
  const now = new Date();
  const startTime = new Date(commenceTime);
  
  if (completed) return 'finished';
  if (startTime <= now) return 'live';
  return 'scheduled';
};

export const mapTennisEventToMatch = (event: RawTennisEvent): Match => {
  const {home: homeScore, away: awayScore} = extractTennisScores(event);
  const hasValidScore = hasValidTennisScore(event);
  
  return {
    id: event.id,
    sport: 'tennis',
    competition: event.sport_title,
    league: {id: event.sport_key, name: event.sport_title, logo: null},
    home: {id: `home-${event.id}`, name: event.home_team, logo: null},
    away: {id: `away-${event.id}`, name: event.away_team, logo: null},
    score: {home: homeScore, away: awayScore},
    status: mapTennisStatus(event.completed, event.commence_time),
    clock: !hasValidScore && mapTennisStatus(event.completed, event.commence_time) === 'live' ? 'Live score unavailable' : undefined,
    startsAtMs: new Date(event.commence_time).getTime(),
    hasMedia: false,
  };
};

export const mapTennisScoreToMatch = (score: RawTennisScore): Match => {
  const {home: homeScore, away: awayScore} = extractTennisScores(score);
  const hasValidScore = hasValidTennisScore(score);
  
  return {
    id: score.id,
    sport: 'tennis',
    competition: score.sport_title,
    league: {id: score.sport_key, name: score.sport_title, logo: null},
    home: {id: `home-${score.id}`, name: score.home_team, logo: null},
    away: {id: `away-${score.id}`, name: score.away_team, logo: null},
    score: {home: homeScore, away: awayScore},
    status: mapTennisStatus(score.completed, score.commence_time),
    clock: !hasValidScore && mapTennisStatus(score.completed, score.commence_time) === 'live' ? 'Live score unavailable' : undefined,
    startsAtMs: new Date(score.commence_time).getTime(),
    hasMedia: false,
  };
};
