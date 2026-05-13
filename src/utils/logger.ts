import {ENV} from '../config/env';

type Level = 'debug' | 'info' | 'warn' | 'error';

const emit = (level: Level, tag: string, ...args: unknown[]): void => {
  if (!ENV.IS_DEV && level === 'debug') return;
  const prefix = `[${tag}]`;
  switch (level) {
    case 'error':
      console.error(prefix, ...args);
      return;
    case 'warn':
      console.warn(prefix, ...args);
      return;
    default:
      console.log(prefix, ...args);
  }
};

export const logger = {
  debug: (tag: string, ...args: unknown[]) => emit('debug', tag, ...args),
  info: (tag: string, ...args: unknown[]) => emit('info', tag, ...args),
  warn: (tag: string, ...args: unknown[]) => emit('warn', tag, ...args),
  error: (tag: string, ...args: unknown[]) => emit('error', tag, ...args),
};
