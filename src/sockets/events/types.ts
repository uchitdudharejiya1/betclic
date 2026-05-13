import type {OddsBook} from '../../types/domain/odds';

export type OddsUpdateEvent = {
  matchId: string;
  odds: OddsBook;
  ts: number;
};

export type ScoreUpdateEvent = {
  matchId: string;
  home: number;
  away: number;
  minute?: string;
  ts: number;
};

export type MatchEndedEvent = {matchId: string};

export interface ServerToClientEvents {
  'odds:update': (msg: OddsUpdateEvent) => void;
  'score:update': (msg: ScoreUpdateEvent) => void;
  'match:ended': (msg: MatchEndedEvent) => void;
  ping: () => void;
  'auth:error': (msg: {reason: string}) => void;
}

export interface ClientToServerEvents {
  auth: (msg: {apiKey: string}, ack: (ok: boolean) => void) => void;
  subscribe: (msg: {matchIds: string[]}, ack: (ok: boolean) => void) => void;
  unsubscribe: (msg: {matchIds: string[]}) => void;
  pong: () => void;
}
