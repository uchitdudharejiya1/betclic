import { Linking } from 'react-native';
import * as RNLocalize from 'react-native-localize';

// Business document URLs - SOURCE OF TRUTH
const COUNTRY_URLS = {
  // Côte d'Ivoire (CI)
  CI: {
    match: 'https://betclic.onelink.me/oTcP/10zx84uj',
    seeAllMatches: 'https://betclic.onelink.me/oTcP/2c0vftjs',
    seeMore: 'https://betclic.onelink.me/oTcP/k6mnkp5v',
    banner: 'https://betclic.onelink.me/oTcP/4qvicar1',
  },
  // Cameroun (CM)
  CM: {
    match: 'https://betclic.onelink.me/p26b/qz9vg3do',
    seeAllMatches: 'https://betclic.onelink.me/p26b/gziltbqw',
    seeMore: 'https://betclic.onelink.me/p26b/atz9jph4',
    banner: 'https://betclic.onelink.me/p26b/qetfgfri',
  },
  // Poland (PL)
  PL: {
    match: 'https://go.onelink.me/ZeBi/pifnfe95',
    seeAllMatches: 'https://go.onelink.me/ZeBi/34a85wej',
    seeMore: 'https://go.onelink.me/ZeBi/nmajzfuc',
    banner: 'https://betclic.onelink.me/ZeBi/n9qjkv5g',
  },
} as const;

export type CountryCode = keyof typeof COUNTRY_URLS;
export type RedirectType = 'match' | 'seeAllMatches' | 'seeMore' | 'banner';

/**
 * Get current country code based on device locale
 * Defaults to CI (Côte d'Ivoire) for unsupported countries
 */
export const getCurrentCountry = (): CountryCode => {
  const country = RNLocalize.getCountry();
  return (country as CountryCode) in COUNTRY_URLS ? (country as CountryCode) : 'CI';
};

/**
 * Get redirect URL for specific country and type
 */
export const getRedirectUrl = (countryCode: CountryCode, type: RedirectType): string => {
  return COUNTRY_URLS[countryCode][type];
};

/**
 * Get match redirect URL for current country
 */
export const getMatchRedirect = (countryCode?: CountryCode): string => {
  const country = countryCode || getCurrentCountry();
  return getRedirectUrl(country, 'match');
};

/**
 * Get See All Matches redirect URL for current country
 */
export const getSeeAllMatchesRedirect = (countryCode?: CountryCode): string => {
  const country = countryCode || getCurrentCountry();
  return getRedirectUrl(country, 'seeAllMatches');
};

/**
 * Get See More redirect URL for current country
 */
export const getSeeMoreRedirect = (countryCode?: CountryCode): string => {
  const country = countryCode || getCurrentCountry();
  return getRedirectUrl(country, 'seeMore');
};

/**
 * Get Banner redirect URL for current country
 */
export const getBannerRedirect = (countryCode?: CountryCode): string => {
  const country = countryCode || getCurrentCountry();
  return getRedirectUrl(country, 'banner');
};

/**
 * Open match betting URL for current country
 */
export const openMatchRedirect = async (countryCode?: CountryCode): Promise<void> => {
  const country = countryCode || getCurrentCountry();
  const url = getMatchRedirect(country);
  console.log(`🎯 MATCH REDIRECT - Country: ${country}, URL: ${url}`);
  await Linking.openURL(url);
};

/**
 * Open See All Matches betting URL for current country
 */
export const openSeeAllMatchesRedirect = async (countryCode?: CountryCode): Promise<void> => {
  const country = countryCode || getCurrentCountry();
  const url = getSeeAllMatchesRedirect(country);
  console.log(`🏆 SEE ALL MATCHES REDIRECT - Country: ${country}, URL: ${url}`);
  await Linking.openURL(url);
};

/**
 * Open See More betting URL for current country
 */
export const openSeeMoreRedirect = async (countryCode?: CountryCode): Promise<void> => {
  const country = countryCode || getCurrentCountry();
  const url = getSeeMoreRedirect(country);
  console.log(`🔥 SEE MORE REDIRECT - Country: ${country}, URL: ${url}`);
  await Linking.openURL(url);
};

/**
 * Open Banner betting URL for current country
 */
export const openBannerRedirect = async (countryCode?: CountryCode): Promise<void> => {
  const country = countryCode || getCurrentCountry();
  const url = getBannerRedirect(country);
  console.log(`🏆 BANNER REDIRECT - Country: ${country}, URL: ${url}`);
  await Linking.openURL(url);
};

/**
 * Legacy compatibility functions for existing code
 * @deprecated Use openMatchRedirect, openSeeAllMatchesRedirect, or openSeeMoreRedirect instead
 */
export const useCountrySpecificUrls = () => {
  const currentCountry = getCurrentCountry();

  const openMatch = () => {
    console.log(`🔄 LEGACY openMatch called - Country: ${currentCountry}`);
    openMatchRedirect(currentCountry);
  };
  const openAllCompetitions = () => {
    console.log(`🔄 LEGACY openAllCompetitions called - Country: ${currentCountry}`);
    openSeeAllMatchesRedirect(currentCountry);
  };
  const openAllGames = () => {
    console.log(`🔄 LEGACY openAllGames called - Country: ${currentCountry}`);
    openSeeMoreRedirect(currentCountry);
  };

  return {
    openMatch,
    openAllCompetitions,
    openAllGames,
    getCurrentCountryUrls: () => COUNTRY_URLS[currentCountry],
  };
};
