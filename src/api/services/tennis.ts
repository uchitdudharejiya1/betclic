import {ProviderNotConfiguredError} from '../../utils/errors';

const stub = () => Promise.reject(new ProviderNotConfiguredError('tennis'));

export const tennisService = {
  liveMatches: stub,
  matchesByDate: stub,
  leagues: stub,
  oddsForMatch: stub,
};
