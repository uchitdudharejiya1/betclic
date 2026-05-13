import type {SportId} from './sports';

export const SPORT_LEAGUES: Record<Exclude<SportId, 'live'>, string[]> = {
  football: [
    "Ligue 1 (Côte d'Ivoire)",
    'CHAN',
    'Ligue 1 (France)',
    'Premier League',
    'La Liga',
    'Bundesliga',
    'Serie A',
    'Ligue des Champions',
    'Ligue Europa',
  ],
  basketball: ['NBA Playoffs', 'EuroLeague', 'Pro A (France)'],
  tennis: ['Roland-Garros', 'ATP Madrid', 'WTA Rome', 'ATP Barcelona'],
  volleyball: ['Ligue des Nations', 'CEV Champions League', 'Ligue A'],
  hockey: ['NHL Playoffs', 'KHL', 'Ligue Magnus'],
  martial: ['UFC 301', 'Bellator MMA', 'PFL'],
};
