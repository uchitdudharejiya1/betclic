import {useLiveOddsStore} from '../../store/slices/liveOddsStore';
import type {OddsBook} from '../../types/domain/odds';

export const useLiveOdds = (matchId: string | undefined): OddsBook | undefined =>
  useLiveOddsStore(s => (matchId ? s.byMatchId[matchId] : undefined));
