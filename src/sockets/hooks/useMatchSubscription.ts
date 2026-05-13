import {useEffect, useMemo} from 'react';

import {oddsSocket} from '../services/oddsSocket';

export const useMatchSubscription = (matchIds: string[] | string): void => {
  const ids = useMemo(() => {
    const list = typeof matchIds === 'string' ? [matchIds] : matchIds;
    return [...new Set(list.filter(Boolean))].sort();
  }, [matchIds]);
  const key = ids.join(',');

  useEffect(() => {
    if (!key) return;
    const list = key.split(',');
    oddsSocket.subscribe(list);
    return () => oddsSocket.unsubscribe(list);
  }, [key]);
};
