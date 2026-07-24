import { useEffect, useRef, useState } from 'react';
import { track } from './analytics';

export function useCallWaiter() {
  const [called, setCalled] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  function callWaiter() {
    if (called) {
      window.clearTimeout(timeoutRef.current);
      setCalled(false);
      return;
    }
    track('call_waiter');
    setCalled(true);
    timeoutRef.current = window.setTimeout(() => setCalled(false), 30_000);
  }

  return { called, callWaiter };
}
