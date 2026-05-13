import React, {useEffect, useMemo} from 'react';

import {useConnectionStore} from '../../store/slices/connectionStore';
import {oddsSocket} from '../services/oddsSocket';
import {SocketContext, type SocketContextValue} from './SocketContext';

export const SocketProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const status = useConnectionStore(s => s.status);

  useEffect(() => {
    oddsSocket.connect();
    return () => oddsSocket.disconnect();
  }, []);

  const value = useMemo<SocketContextValue>(
    () => ({status, enabled: oddsSocket.isEnabled()}),
    [status],
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
