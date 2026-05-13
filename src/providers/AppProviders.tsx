import {QueryClientProvider} from '@tanstack/react-query';
import React from 'react';

import {queryClient} from '../config/queryClient';
import {ThemeProvider} from '../context/ThemeContext';
import {SocketProvider} from '../sockets/provider/SocketProvider';

export const AppProviders: React.FC<{children: React.ReactNode}> = ({
  children,
}) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <SocketProvider>{children}</SocketProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
