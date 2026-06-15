import { useContext } from 'react';
import { CountryContext } from '../context/CountryContext';

export const useCountry = () => {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
};
