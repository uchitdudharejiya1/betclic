import Config from 'react-native-config';

const optional = (v?: string): string => v ?? '';

export const ENV = {
  APISPORTS_KEY: optional(Config.APISPORTS_KEY),
  THE_ODDS_API_KEY: optional(Config.THE_ODDS_API_KEY),
  ODDS_SOCKET_URL: optional(Config.ODDS_SOCKET_URL),
  ODDS_SOCKET_PATH: Config.ODDS_SOCKET_PATH ?? '/socket.io',
  PROGRAMME_WEB_URL: optional(Config.PROGRAMME_WEB_URL),
  IS_DEV: __DEV__,
} as const;

export const assertApiKey = (): void => {
  if (!ENV.APISPORTS_KEY) {
    throw new Error(
      '[env] RAPIDAPI_KEY is empty. Add it to .env and rebuild the app.',
    );
  }
};

if (__DEV__ && !ENV.THE_ODDS_API_KEY) {
  console.warn(
    '[config] THE_ODDS_API_KEY is empty. Add it to .env and rebuild the app.',
  );
}
