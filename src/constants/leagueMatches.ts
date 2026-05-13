export type LeagueMatchStatus = 'live' | 'scheduled' | 'finished';

export type LeagueMatch = {
  status: LeagueMatchStatus;
  t1: string;
  t2: string;
  s1?: string;
  s2?: string;
  min?: string;
  set?: string;
  time?: string;
};

export const LEAGUE_MATCHES: Record<string, LeagueMatch[]> = {
  "Ligue 1 (Côte d'Ivoire)": [
    {status: 'live', min: "54'", t1: 'ASEC Mimosas', t2: 'Africa Sports', s1: '1', s2: '0'},
    {status: 'scheduled', time: '19:00', t1: "Stade d'Abidjan", t2: 'SOA'},
    {status: 'finished', t1: 'AS Tanda', t2: 'Sewe Sport', s1: '2', s2: '0'},
    {status: 'finished', t1: 'Bouaké FC', t2: 'Stella Club', s1: '1', s2: '1'},
  ],
  CHAN: [
    {status: 'live', min: "72'", t1: "Côte d'Ivoire", t2: 'Mali', s1: '2', s2: '1'},
    {status: 'scheduled', time: '18:00', t1: 'Sénégal', t2: 'Algérie'},
    {status: 'finished', t1: 'Maroc', t2: 'Égypte', s1: '1', s2: '0'},
  ],
  'Ligue 1 (France)': [
    {status: 'live', min: "67'", t1: 'Paris Saint-Germain', t2: 'Olympique de Marseille', s1: '3', s2: '1'},
    {status: 'scheduled', time: '17:00', t1: 'OGC Nice', t2: 'Stade Rennais'},
    {status: 'scheduled', time: '21:00', t1: 'Lille OSC', t2: 'RC Lens'},
    {status: 'finished', t1: 'AS Monaco', t2: 'Olympique Lyonnais', s1: '2', s2: '2'},
  ],
  'Premier League': [
    {status: 'live', min: "23'", t1: 'Manchester City', t2: 'Liverpool', s1: '0', s2: '0'},
    {status: 'scheduled', time: '16:30', t1: 'Arsenal', t2: 'Chelsea'},
    {status: 'finished', t1: 'Tottenham', t2: 'Newcastle', s1: '2', s2: '2'},
  ],
  'La Liga': [
    {status: 'scheduled', time: '21:00', t1: 'FC Barcelone', t2: 'Atlético de Madrid'},
    {status: 'scheduled', time: '19:00', t1: 'Real Madrid', t2: 'Séville'},
    {status: 'finished', t1: 'Valence', t2: 'Athletic Bilbao', s1: '1', s2: '2'},
  ],
  Bundesliga: [
    {status: 'live', min: "45+2'", t1: 'Bayern Munich', t2: 'Borussia Dortmund', s1: '2', s2: '2'},
    {status: 'scheduled', time: '18:30', t1: 'RB Leipzig', t2: 'Bayer Leverkusen'},
    {status: 'finished', t1: 'Eintracht Frankfurt', t2: 'VfL Wolfsburg', s1: '1', s2: '0'},
  ],
  'Serie A': [
    {status: 'scheduled', time: '20:45', t1: 'AC Milan', t2: 'Juventus'},
    {status: 'scheduled', time: '18:00', t1: 'Inter Milan', t2: 'Napoli'},
    {status: 'finished', t1: 'AS Roma', t2: 'Lazio', s1: '2', s2: '0'},
  ],
  'Ligue des Champions': [
    {status: 'live', min: "88'", t1: 'Real Madrid', t2: 'Bayern Munich', s1: '1', s2: '1'},
    {status: 'scheduled', time: '21:00', t1: 'Manchester City', t2: 'Arsenal'},
    {status: 'finished', t1: 'PSG', t2: 'Borussia Dortmund', s1: '1', s2: '0'},
  ],
  'Ligue Europa': [
    {status: 'scheduled', time: '18:45', t1: 'Olympique Lyonnais', t2: 'Eintracht Frankfurt'},
    {status: 'scheduled', time: '21:00', t1: 'Manchester United', t2: 'AS Roma'},
    {status: 'finished', t1: 'Atalanta', t2: 'Bayer Leverkusen', s1: '2', s2: '1'},
  ],
  'NBA Playoffs': [
    {status: 'live', min: 'Q4 3:14', t1: 'Boston Celtics', t2: 'New York Knicks', s1: '88', s2: '91'},
    {status: 'scheduled', time: '02:30', t1: 'Denver Nuggets', t2: 'Los Angeles Lakers'},
    {status: 'finished', t1: 'Miami Heat', t2: 'Philadelphia 76ers', s1: '104', s2: '98'},
  ],
  EuroLeague: [
    {status: 'scheduled', time: '20:00', t1: 'Real Madrid', t2: 'FC Barcelone'},
    {status: 'finished', t1: 'Olympiacos', t2: 'Panathinaïkos', s1: '82', s2: '78'},
  ],
  'Pro A (France)': [
    {status: 'scheduled', time: '20:30', t1: 'AS Monaco', t2: 'ASVEL'},
    {status: 'finished', t1: 'Paris Basketball', t2: 'Boulogne-Levallois', s1: '95', s2: '88'},
  ],
  'Roland-Garros': [
    {status: 'live', set: '3e Set', t1: 'Carlos Alcaraz', t2: 'Novak Djokovic', s1: '6 4 2', s2: '3 6 4'},
    {status: 'live', set: '2e Set', t1: 'N. Djokovic / R. Nadal', t2: 'C. Alcaraz / F. Auger', s1: '6 3', s2: '4 5'},
    {status: 'finished', t1: 'Iga Świątek', t2: 'Aryna Sabalenka', s1: '6 7 6', s2: '4 6 3'},
  ],
  'ATP Madrid': [
    {status: 'scheduled', time: '15:30', t1: 'C. Alcaraz', t2: 'F. Tiafoe'},
    {status: 'finished', t1: 'J. Sinner', t2: 'D. Medvedev', s1: '6 6', s2: '4 3'},
  ],
  'WTA Rome': [
    {status: 'scheduled', time: '14:00', t1: 'C. Gauff', t2: 'O. Jabeur'},
    {status: 'finished', t1: 'E. Rybakina', t2: 'P. Badosa', s1: '7 6', s2: '5 4'},
  ],
  'ATP Barcelona': [
    {status: 'scheduled', time: '13:00', t1: 'L. Djere', t2: 'H. Hurkacz'},
  ],
  'Ligue des Nations': [
    {status: 'live', min: '4e Set', t1: 'France', t2: 'Italie', s1: '2', s2: '1'},
    {status: 'scheduled', time: '19:00', t1: 'Pologne', t2: 'Brésil'},
    {status: 'finished', t1: 'États-Unis', t2: 'Japon', s1: '3', s2: '1'},
  ],
  'CEV Champions League': [
    {status: 'scheduled', time: '18:00', t1: 'Trentino Volley', t2: 'Zenit Kazan'},
  ],
  'Ligue A': [
    {status: 'scheduled', time: '20:00', t1: 'Paris Volley', t2: 'Tours VB'},
    {status: 'finished', t1: 'Tourcoing', t2: 'Cannes', s1: '3', s2: '2'},
  ],
  'NHL Playoffs': [
    {status: 'live', min: 'P3 12:45', t1: 'Boston Bruins', t2: 'Toronto Maple Leafs', s1: '2', s2: '3'},
    {status: 'scheduled', time: '01:00', t1: 'Edmonton Oilers', t2: 'Vegas Golden Knights'},
    {status: 'finished', t1: 'New York Rangers', t2: 'Carolina Hurricanes', s1: '4', s2: '2'},
  ],
  KHL: [
    {status: 'scheduled', time: '17:30', t1: 'CSKA Moscou', t2: 'SKA Saint-Pétersbourg'},
  ],
  'Ligue Magnus': [
    {status: 'scheduled', time: '20:30', t1: 'Grenoble', t2: 'Rouen'},
    {status: 'finished', t1: 'Bordeaux', t2: 'Angers', s1: '4', s2: '1'},
  ],
  'UFC 301': [
    {status: 'live', min: 'Round 2', t1: 'A. Volkanovski', t2: 'I. Topuria', s1: '—', s2: '—'},
    {status: 'scheduled', time: '04:00', t1: 'José Aldo', t2: 'Jonathan Martinez'},
    {status: 'finished', t1: 'Anthony Smith', t2: 'Vitor Petrino', s1: 'KO R2', s2: ''},
  ],
  'Bellator MMA': [
    {status: 'scheduled', time: '02:00', t1: 'P. Pitbull', t2: 'A. Sanchez'},
  ],
  PFL: [
    {status: 'scheduled', time: '03:00', t1: 'O. Storley', t2: 'M. Velasco'},
  ],
};
