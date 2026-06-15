import {QueryClientProvider} from '@tanstack/react-query';
import React from 'react';

import {queryClient} from '../config/queryClient';
import {CountryProvider} from '../context/CountryContext';
import {LanguageProvider} from '../context/LanguageContext';
import {ThemeProvider} from '../context/ThemeContext';
import {SocketProvider} from '../sockets/provider/SocketProvider';

export const AppProviders: React.FC<{children: React.ReactNode}> = ({
  children,
}) => (
  <QueryClientProvider client={queryClient}>
    <CountryProvider>
      <LanguageProvider>
        <ThemeProvider>
          <SocketProvider>{children}</SocketProvider>
        </ThemeProvider>
      </LanguageProvider>
    </CountryProvider>
  </QueryClientProvider>
);
