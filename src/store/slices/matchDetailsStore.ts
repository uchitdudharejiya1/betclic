import {create} from 'zustand';

type MatchDetailsState = {
  openedMatchId: string | null;
  subscribed: Set<string>;
  open: (matchId: string) => void;
  close: () => void;
  trackSubscribed: (matchIds: string[]) => void;
  untrackSubscribed: (matchIds: string[]) => void;
};

export const useMatchDetailsStore = create<MatchDetailsState>(set => ({
  openedMatchId: null,
  subscribed: new Set<string>(),
  open: matchId => set({openedMatchId: matchId}),
  close: () => set({openedMatchId: null}),
  trackSubscribed: ids =>
    set(state => {
      const next = new Set(state.subscribed);
      ids.forEach(id => next.add(id));
      return {subscribed: next};
    }),
  untrackSubscribed: ids =>
    set(state => {
      const next = new Set(state.subscribed);
      ids.forEach(id => next.delete(id));
      return {subscribed: next};
    }),
}));
