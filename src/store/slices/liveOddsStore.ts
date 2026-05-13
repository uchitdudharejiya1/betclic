import {create} from 'zustand';

import type {OddsBook} from '../../types/domain/odds';

type LiveOddsState = {
  byMatchId: Record<string, OddsBook>;
  upsert: (matchId: string, odds: OddsBook) => void;
  remove: (matchId: string) => void;
  clear: () => void;
};

export const useLiveOddsStore = create<LiveOddsState>(set => ({
  byMatchId: {},
  upsert: (matchId, odds) =>
    set(state => ({
      byMatchId: {...state.byMatchId, [matchId]: odds},
    })),
  remove: matchId =>
    set(state => {
      if (!(matchId in state.byMatchId)) return state;
      const next = {...state.byMatchId};
      delete next[matchId];
      return {byMatchId: next};
    }),
  clear: () => set({byMatchId: {}}),
}));
