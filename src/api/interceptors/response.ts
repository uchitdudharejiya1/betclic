import axios, {AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from 'axios';

import type {ApiResponse} from '../../types/api/common';
import {hasApiErrors} from '../../types/api/common';
import {AppError, apiError} from '../../utils/errors';
import {logger} from '../../utils/logger';

const parseRetryAfter = (header: string | string[] | undefined): number => {
  if (!header) return 0;
  const raw = Array.isArray(header) ? header[0] : header;
  const asInt = Number.parseInt(raw, 10);
  if (Number.isFinite(asInt)) return asInt * 1000;
  const asDate = Date.parse(raw);
  if (Number.isFinite(asDate)) return Math.max(0, asDate - Date.now());
  return 0;
};

const attachConfig = (err: AppError, config?: InternalAxiosRequestConfig): AppError => {
  if (config) (err as AppError & {config?: InternalAxiosRequestConfig}).config = config;
  return err;
};

const onFulfilled = (res: AxiosResponse): AxiosResponse => {
  const meta = res.config.metadata;
  if (meta) {
    logger.debug(
      'api:res',
      res.status,
      `${res.config.baseURL ?? ''}${res.config.url ?? ''}`,
      `${Date.now() - meta.startedAt}ms`,
    );
  }
  logger.debug('api:res:data', res.data);
  const body = res.data as ApiResponse<unknown> | undefined;
  if (body && typeof body === 'object' && 'errors' in body && hasApiErrors(body.errors)) {
    const url = `${res.config.baseURL ?? ''}${res.config.url ?? ''}`;
    const elapsed = meta ? `${Date.now() - meta.startedAt}ms` : undefined;
    logger.error('api:err', 'api_error', url, elapsed ?? '');
    logger.debug('api:err:data', body.errors);
    throw attachConfig(apiError(body.errors, url), res.config);
  }
  return res;
};

const onRejected = (err: unknown): never => {
  if (err instanceof AppError) throw err;

  if (axios.isCancel(err)) {
    throw new AppError('cancelled', 'Request cancelled');
  }

  const axiosErr = err as AxiosError;
  const status = axiosErr.response?.status;
  const config = axiosErr.config as InternalAxiosRequestConfig | undefined;
  const url = `${config?.baseURL ?? ''}${config?.url ?? ''}`;
  const elapsed = config?.metadata?.startedAt
    ? `${Date.now() - (config.metadata.startedAt as number)}ms`
    : undefined;

  logger.error('api:err', status ?? 'no_status', url, elapsed ?? '', axiosErr.code ?? '', axiosErr.message ?? '');
  logger.debug('api:err:data', axiosErr.response?.data);

  if (axiosErr.code === 'ECONNABORTED' || axiosErr.code === 'ETIMEDOUT') {
    throw attachConfig(new AppError('timeout', 'Request timed out', {url}), config);
  }
  if (!axiosErr.response) {
    throw attachConfig(
      new AppError('network', axiosErr.message || 'Network error', {url}),
      config,
    );
  }
  if (status === 429) {
    const retryAfterMs = parseRetryAfter(axiosErr.response.headers['retry-after']);
    throw attachConfig(
      new AppError('rate_limit', 'Rate limit exceeded', {status, url, retryAfterMs}),
      config,
    );
  }
  if (status === 401 || status === 403) {
    throw attachConfig(new AppError('auth', 'Unauthorized', {status, url}), config);
  }
  if (status && status >= 500) {
    throw attachConfig(
      new AppError('server', `Server error ${status}`, {status, url}),
      config,
    );
  }
  throw attachConfig(
    new AppError('unknown', axiosErr.message || 'Unknown error', {status, url}),
    config,
  );
};

export const installResponseInterceptor = (client: AxiosInstance): void => {
  client.interceptors.response.use(onFulfilled, onRejected);
};
