import { useLayoutEffect } from 'react';

let locks = 0;

export function useLockBodyScroll() {
  useLayoutEffect(() => {
    locks += 1;
    if (locks === 1) document.body.style.overflow = 'hidden';
    return () => {
      locks -= 1;
      if (locks === 0) document.body.style.overflow = '';
    };
  }, []);
}
