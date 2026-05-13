import type {ApiErrors} from '../types/api/common';

export type ErrorKind =
  | 'network'
  | 'timeout'
  | 'rate_limit'
  | 'auth'
  | 'server'
  | 'api'
  | 'cancelled'
  | 'unknown';

export class AppError extends Error {
  readonly kind: ErrorKind;
  readonly status?: number;
  readonly url?: string;
  readonly retryAfterMs?: number;
  readonly details?: unknown;

  constructor(
    kind: ErrorKind,
    message: string,
    opts: {
      status?: number;
      url?: string;
      retryAfterMs?: number;
      details?: unknown;
    } = {},
  ) {
    super(message);
    this.name = 'AppError';
    this.kind = kind;
    this.status = opts.status;
    this.url = opts.url;
    this.retryAfterMs = opts.retryAfterMs;
    this.details = opts.details;
  }
}

export const apiError = (errors: ApiErrors, url?: string): AppError =>
  new AppError('api', formatApiErrors(errors), {url, details: errors});

const formatApiErrors = (errors: ApiErrors): string => {
  if (Array.isArray(errors)) return errors.join('; ') || 'API error';
  return (
    Object.entries(errors)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ') || 'API error'
  );
};

export const isCancelled = (err: unknown): boolean =>
  err instanceof AppError && err.kind === 'cancelled';

export class ProviderNotConfiguredError extends AppError {
  constructor(sport: string) {
    super('api', `Provider for "${sport}" is not configured`, {
      details: {sport},
    });
    this.name = 'ProviderNotConfiguredError';
  }
}
