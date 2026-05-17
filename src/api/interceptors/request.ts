import type {AxiosInstance, InternalAxiosRequestConfig} from 'axios';

import {ENV} from '../../config/env';
import {logger} from '../../utils/logger';

export type RequestMeta = {
  startedAt: number;
  dedupeKey?: string;
};

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    metadata?: RequestMeta;
  }
}

export const installRequestInterceptor = (
  client: AxiosInstance,
  _host: string,
): void => {
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    config.headers.set('x-apisports-key', ENV.APISPORTS_KEY);
    if (!config.headers.has('Accept')) {
      config.headers.set('Accept', 'application/json');
    }
    config.metadata = {startedAt: Date.now()};
    logger.debug(
      'api:req',
      (config.method ?? 'get').toUpperCase(),
      `${config.baseURL ?? ''}${config.url ?? ''}`,
      config.params ?? {},
    );
    return config;
  });
};
