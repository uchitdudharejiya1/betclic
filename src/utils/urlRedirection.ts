import { Linking } from 'react-native';
import * as RNLocalize from 'react-native-localize';

export const useCountrySpecificUrls = () => {
  const urls = {
    // Poland URLs
    PL: {
      allCompetitions: 'https://go.onelink.me/ZeBi/34a85wej',
      allGames: 'https://go.onelink.me/ZeBi/nmajzfuc',
      match: 'https://go.onelink.me/ZeBi/pifnfe95',
    },
    // Cameroon URLs
    CM: {
      allCompetitions: 'https://betclic.onelink.me/p26b/gziltbqw',
      allGames: 'https://betclic.onelink.me/p26b/atz9jph4',
      match: 'https://betclic.onelink.me/p26b/qz9vg3do',
    },
    // Côte d'Ivoire URLs
    CI: {
      allCompetitions: 'https://betclic.onelink.me/oTcP/2c0vftjs',
      allGames: 'https://betclic.onelink.me/oTcP/k6mnkp5v',
      match: 'https://betclic.onelink.me/oTcP/10zx84uj',
    },
  };

  const getCurrentCountryUrls = () => {
    const country = RNLocalize.getCountry();
    // Default to Côte d'Ivoire URLs for any country that's not PL, CM, or CI
    return urls[country as keyof typeof urls] || urls.CI;
  };

  const openAllCompetitions = () => {
    const { allCompetitions } = getCurrentCountryUrls();
    Linking.openURL(allCompetitions);
  };

  const openAllGames = () => {
    const { allGames } = getCurrentCountryUrls();
    Linking.openURL(allGames);
  };

  const openMatch = () => {
    const { match } = getCurrentCountryUrls();
    Linking.openURL(match);
  };

  return {
    openAllCompetitions,
    openAllGames,
    openMatch,
    getCurrentCountryUrls,
  };
};
