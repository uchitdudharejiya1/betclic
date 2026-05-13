import type {SportId} from './sports';

export type LiveGame = {
  id: string;
  comp: string;
  t1: string;
  t2: string;
  s1: string;
  s2: string;
  sport: Exclude<SportId, 'live'>;
  min?: string;
  set?: string;
  hasTV: boolean;
};

export const LIVE_GAMES: LiveGame[] = [
  {
    id: 'g1',
    comp: "Côte d'Ivoire · Ligue 1 · J30",
    t1: 'ASEC Mimosas',
    t2: 'Africa Sports',
    s1: '1',
    s2: '0',
    sport: 'football',
    min: "54'",
    hasTV: true,
  },
  {
    id: 'g2',
    comp: 'CHAN 2024 · Groupe B',
    t1: "Côte d'Ivoire",
    t2: 'Mali',
    s1: '2',
    s2: '1',
    sport: 'football',
    min: "72'",
    hasTV: true,
  },
  {
    id: 'g3',
    comp: 'Ligue des Champions · Demi-finales',
    t1: 'Real Madrid',
    t2: 'Bayern Munich',
    s1: '1',
    s2: '1',
    sport: 'football',
    min: "88'",
    hasTV: true,
  },
  {
    id: 'g4',
    comp: 'Ligue 1 · Journée 35',
    t1: 'Paris Saint-Germain',
    t2: 'Olympique de Marseille',
    s1: '3',
    s2: '1',
    sport: 'football',
    min: "67'",
    hasTV: true,
  },
  {
    id: 'g5',
    comp: 'Roland-Garros · Quarts de finale',
    t1: 'Carlos Alcaraz',
    t2: 'Novak Djokovic',
    s1: '6 4 2',
    s2: '3 6 4',
    sport: 'tennis',
    set: '3e Set',
    hasTV: true,
  },
  {
    id: 'g6',
    comp: 'Roland-Garros · Doubles',
    t1: 'N. Djokovic / R. Nadal',
    t2: 'C. Alcaraz / F. Auger',
    s1: '6 3',
    s2: '4 5',
    sport: 'tennis',
    set: '2e Set',
    hasTV: false,
  },
  {
    id: 'g7',
    comp: 'NBA Playoffs · Conf. Est',
    t1: 'Boston Celtics',
    t2: 'New York Knicks',
    s1: '88',
    s2: '91',
    sport: 'basketball',
    min: 'Q4 3:14',
    hasTV: true,
  },
  {
    id: 'g8',
    comp: 'Ligue des Nations · Poule 2',
    t1: 'France',
    t2: 'Italie',
    s1: '2',
    s2: '1',
    sport: 'volleyball',
    min: '4e Set',
    hasTV: true,
  },
  {
    id: 'g9',
    comp: 'NHL Playoffs · 1er tour',
    t1: 'Boston Bruins',
    t2: 'Toronto Maple Leafs',
    s1: '2',
    s2: '3',
    sport: 'hockey',
    min: 'P3 12:45',
    hasTV: true,
  },
  {
    id: 'g10',
    comp: 'UFC 301 · Combat principal',
    t1: 'A. Volkanovski',
    t2: 'I. Topuria',
    s1: '—',
    s2: '—',
    sport: 'martial',
    min: 'Round 2',
    hasTV: true,
  },
];
