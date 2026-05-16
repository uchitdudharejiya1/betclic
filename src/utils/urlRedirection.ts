import { Linking } from 'react-native';
import { useTranslation } from 'react-i18next';

export const useLanguageSpecificUrls = () => {
  const { i18n } = useTranslation();
  
  const urls = {
    // Cote d'Ivoire URLs (French)
    fr: {
      allCompetitions: 'https://betclic.onelink.me/oTcP/2c0vftjs',
      allGames: 'https://betclic.onelink.me/oTcP/k6mnkp5v',
      match: 'https://betclic.onelink.me/oTcP/10zx84uj',
    },
    // Poland URLs
    pl: {
      allCompetitions: 'https://go.onelink.me/ZeBi/34a85wej',
      allGames: 'https://go.onelink.me/ZeBi/nmajzfuc',
      match: 'https://go.onelink.me/ZeBi/pifnfe95',
    },
  };

  const getCurrentLanguageUrls = () => {
    const currentLang = i18n.language;
    // Default to French URLs for any language that's not Polish
    return urls[currentLang as keyof typeof urls] || urls.fr;
  };

  const openAllCompetitions = () => {
    const { allCompetitions } = getCurrentLanguageUrls();
    Linking.openURL(allCompetitions);
  };

  const openAllGames = () => {
    const { allGames } = getCurrentLanguageUrls();
    Linking.openURL(allGames);
  };

  const openMatch = () => {
    const { match } = getCurrentLanguageUrls();
    Linking.openURL(match);
  };

  return {
    openAllCompetitions,
    openAllGames,
    openMatch,
    getCurrentLanguageUrls,
  };
};
