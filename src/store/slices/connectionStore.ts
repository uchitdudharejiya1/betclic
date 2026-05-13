import {create} from 'zustand';

export type ConnectionStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'error'
  | 'disabled';

type ConnectionState = {
  status: ConnectionStatus;
  lastError?: string;
  set: (status: ConnectionStatus, lastError?: string) => void;
};

export const useConnectionStore = create<ConnectionState>(set => ({
  status: 'idle',
  set: (status, lastError) => set({status, lastError}),
}));
