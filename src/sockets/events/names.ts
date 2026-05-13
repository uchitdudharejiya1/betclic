export const SocketEvents = {
  // server → client
  oddsUpdate: 'odds:update',
  scoreUpdate: 'score:update',
  matchEnded: 'match:ended',
  ping: 'ping',
  authError: 'auth:error',
  // client → server
  auth: 'auth',
  subscribe: 'subscribe',
  unsubscribe: 'unsubscribe',
  pong: 'pong',
} as const;
