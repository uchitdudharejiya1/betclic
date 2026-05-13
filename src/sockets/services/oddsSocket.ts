import {io, Socket} from 'socket.io-client';

import {ENV} from '../../config/env';
import {useConnectionStore} from '../../store/slices/connectionStore';
import {useLiveOddsStore} from '../../store/slices/liveOddsStore';
import {logger} from '../../utils/logger';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '../events/types';

type OddsSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

class OddsSocketManager {
  private socket: OddsSocket | null = null;
  private subscribed = new Set<string>();
  private connected = false;

  isEnabled(): boolean {
    return Boolean(ENV.ODDS_SOCKET_URL);
  }

  connect(): void {
    if (!this.isEnabled()) {
      useConnectionStore.getState().set('disabled');
      logger.info('socket', 'ODDS_SOCKET_URL not set — socket disabled');
      return;
    }
    if (this.socket) return;

    useConnectionStore.getState().set('connecting');
    this.socket = io(ENV.ODDS_SOCKET_URL, {
      path: ENV.ODDS_SOCKET_PATH,
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1_000,
      reconnectionDelayMax: 30_000,
      timeout: 10_000,
    });
    this.bind();
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
    this.connected = false;
    this.subscribed.clear();
    useConnectionStore.getState().set('idle');
  }

  subscribe(matchIds: string[]): void {
    if (!matchIds.length) return;
    matchIds.forEach(id => this.subscribed.add(id));
    if (this.connected) {
      this.socket?.emit('subscribe', {matchIds}, () => {});
    }
  }

  unsubscribe(matchIds: string[]): void {
    if (!matchIds.length) return;
    matchIds.forEach(id => this.subscribed.delete(id));
    if (this.connected && this.socket) {
      this.socket.emit('unsubscribe', {matchIds});
    }
  }

  private bind(): void {
    const s = this.socket;
    if (!s) return;
    s.on('connect', () => {
      this.connected = true;
      useConnectionStore.getState().set('connected');
      logger.info('socket', 'connected', s.id);
      if (ENV.APISPORTS_KEY) {
        s.emit('auth', {apiKey: ENV.APISPORTS_KEY}, () => {});
      }
      if (this.subscribed.size) {
        s.emit('subscribe', {matchIds: [...this.subscribed]}, () => {});
      }
    });
    s.on('disconnect', reason => {
      this.connected = false;
      useConnectionStore.getState().set('reconnecting', String(reason));
      logger.warn('socket', 'disconnected', reason);
    });
    s.on('connect_error', err => {
      this.connected = false;
      useConnectionStore.getState().set('error', err.message);
      logger.error('socket', 'connect_error', err.message);
    });
    s.on('auth:error', msg => {
      useConnectionStore.getState().set('error', msg.reason);
      logger.error('socket', 'auth:error', msg.reason);
    });
    s.on('ping', () => s.emit('pong'));
    s.on('odds:update', msg => {
      useLiveOddsStore.getState().upsert(msg.matchId, msg.odds);
    });
    s.on('match:ended', msg => {
      useLiveOddsStore.getState().remove(msg.matchId);
    });
  }
}

export const oddsSocket = new OddsSocketManager();
