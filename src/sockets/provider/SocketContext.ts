import {createContext} from 'react';

import type {ConnectionStatus} from '../../store/slices/connectionStore';

export type SocketContextValue = {
  status: ConnectionStatus;
  enabled: boolean;
};

export const SocketContext = createContext<SocketContextValue>({
  status: 'idle',
  enabled: false,
});
