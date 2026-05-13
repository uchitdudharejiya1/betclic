import axios, {AxiosInstance} from 'axios';

import {installRequestInterceptor} from '../interceptors/request';
import {installResponseInterceptor} from '../interceptors/response';
import {installRetryInterceptor} from '../interceptors/retry';

export const createClient = (baseURL: string, host: string): AxiosInstance => {
  const client = axios.create({baseURL, timeout: 15_000});
  installRequestInterceptor(client, host);
  installResponseInterceptor(client);
  installRetryInterceptor(client);
  return client;
};
