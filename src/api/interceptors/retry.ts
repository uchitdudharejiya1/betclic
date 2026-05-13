import type {AxiosInstance, InternalAxiosRequestConfig} from 'axios';

import {AppError} from '../../utils/errors';
import {backoff, sleep} from '../../utils/network';
import {logger} from '../../utils/logger';

const MAX_ATTEMPTS = 3;
const RETRY_KINDS = new Set(['network', 'timeout', 'server', 'rate_limit']);

type RetryConfig = InternalAxiosRequestConfig & {__retryCount?: number};

export const installRetryInterceptor = (client: AxiosInstance): void => {
  client.interceptors.response.use(undefined, async (err: unknown) => {
    if (!(err instanceof AppError)) throw err;
    if (!RETRY_KINDS.has(err.kind)) throw err;

    const cfg = (err as AppError & {config?: RetryConfig}).config;
    if (!cfg) throw err;
    const method = (cfg.method ?? 'get').toLowerCase();
    if (method !== 'get') throw err;
    if (cfg.signal?.aborted) throw err;

    cfg.__retryCount = (cfg.__retryCount ?? 0) + 1;
    if (cfg.__retryCount > MAX_ATTEMPTS) throw err;

    const delay =
      err.kind === 'rate_limit' && err.retryAfterMs
        ? err.retryAfterMs
        : backoff(cfg.__retryCount - 1);

    logger.warn(
      'api:retry',
      `${cfg.__retryCount}/${MAX_ATTEMPTS} after ${delay}ms (${err.kind})`,
      cfg.url,
    );
    await sleep(delay);
    return client.request(cfg);
  });
};
