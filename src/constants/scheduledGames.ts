import type {SportId} from './sports';

export type ScheduledGame = {
  id: string;
  comp: string;
  sport: Exclude<SportId, 'live'>;
  t1: string;
  t2: string;
  time: string;
};

export const SCHEDULED_GAMES: ScheduledGame[] = [
  {id: 's1', comp: 'Ligue Europa · Demi-finales', sport: 'football', t1: 'Olympique Lyonnais', t2: 'Eintracht Frankfurt', time: '18:45'},
  {id: 's2', comp: 'Ligue Europa · Demi-finales', sport: 'football', t1: 'Manchester United', t2: 'AS Roma', time: '21:00'},
  {id: 's3', comp: 'Ligue 1 · Journée 35', sport: 'football', t1: 'OGC Nice', t2: 'Stade Rennais', time: '17:00'},
  {id: 's4', comp: 'Ligue 1 · Journée 35', sport: 'football', t1: 'Lille OSC', t2: 'RC Lens', time: '21:00'},
  {id: 's5', comp: 'Serie A · J36', sport: 'football', t1: 'AC Milan', t2: 'Juventus', time: '20:45'},
  {id: 's6', comp: 'Premier League · J37', sport: 'football', t1: 'Arsenal', t2: 'Chelsea', time: '16:30'},
  {id: 's7', comp: 'ATP Madrid · 8es de finale', sport: 'tennis', t1: 'C. Alcaraz', t2: 'F. Tiafoe', time: '15:30'},
  {id: 's8', comp: 'NBA Playoffs · Conf. Ouest', sport: 'basketball', t1: 'Denver Nuggets', t2: 'Los Angeles Lakers', time: '02:30'},
  {id: 's9', comp: 'Ligue des Nations · Poule 2', sport: 'volleyball', t1: 'Pologne', t2: 'Brésil', time: '19:00'},
  {id: 's10', comp: 'NHL Playoffs · 1er tour', sport: 'hockey', t1: 'Edmonton Oilers', t2: 'Vegas Golden Knights', time: '01:00'},
  {id: 's11', comp: 'UFC 301 · Combat préliminaire', sport: 'martial', t1: 'José Aldo', t2: 'Jonathan Martinez', time: '04:00'},
];

export const groupByCompetition = (
  games: ScheduledGame[],
): {comp: string; sport: ScheduledGame['sport']; data: ScheduledGame[]}[] => {
  const map = new Map<string, {comp: string; sport: ScheduledGame['sport']; data: ScheduledGame[]}>();
  for (const g of games) {
    const existing = map.get(g.comp);
    if (existing) {
      existing.data.push(g);
    } else {
      map.set(g.comp, {comp: g.comp, sport: g.sport, data: [g]});
    }
  }
  return Array.from(map.values());
};
