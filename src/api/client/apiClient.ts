import type {AxiosInstance} from 'axios';

import {SPORT_HOSTS, SportKey} from '../../config/sports';
import {ProviderNotConfiguredError} from '../../utils/errors';
import {createClient} from './createClient';

const clients = new Map<SportKey, AxiosInstance>();

export const apiClient = (sport: SportKey): AxiosInstance => {
  const cfg = SPORT_HOSTS[sport];
  if (!cfg.available) throw new ProviderNotConfiguredError(sport);

  const cached = clients.get(sport);
  if (cached) return cached;

  const fresh = createClient(cfg.baseURL, cfg.host);
  clients.set(sport, fresh);
  return fresh;
};
