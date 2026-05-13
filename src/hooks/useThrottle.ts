import {useEffect, useRef, useState} from 'react';

export const useThrottle = <T,>(value: T, delayMs = 250): T => {
  const [throttled, setThrottled] = useState(value);
  const lastEmittedAt = useRef<number>(0);
  const pendingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastEmittedAt.current;
    if (elapsed >= delayMs) {
      lastEmittedAt.current = now;
      setThrottled(value);
      return;
    }
    if (pendingTimer.current) clearTimeout(pendingTimer.current);
    pendingTimer.current = setTimeout(() => {
      lastEmittedAt.current = Date.now();
      setThrottled(value);
    }, delayMs - elapsed);
    return () => {
      if (pendingTimer.current) clearTimeout(pendingTimer.current);
    };
  }, [value, delayMs]);

  return throttled;
};
