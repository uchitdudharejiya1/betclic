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
  host: string,
): void => {
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // Handle The Odds API differently
    if (host === 'api.the-odds-api.com') {
      // The Odds API uses apiKey parameter instead of header
      if (ENV.THE_ODDS_API_KEY) {
        config.params = {
          ...config.params,
          apiKey: ENV.THE_ODDS_API_KEY,
        };
      }
    } else {
      // API Sports uses header
      config.headers.set('x-apisports-key', ENV.APISPORTS_KEY);
    }
    
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
