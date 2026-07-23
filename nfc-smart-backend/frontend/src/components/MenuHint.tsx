import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useLang } from '../i18n';

// Module-scoped: survives back-to-hero-and-forward within the same page load,
// resets only on a full reload (new NFC scan / browser refresh).
let dismissedThisLoad = false;

export function MenuHint() {
  const { t } = useLang();
  const [visible, setVisible] = useState(() => !dismissedThisLoad);
  const reduceMotion = useReducedMotion();

  function dismiss() {
    dismissedThisLoad = true;
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center px-8">
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 22 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.22 } }}
            transition={reduceMotion ? { duration: 0.3 } : { type: 'spring', stiffness: 240, damping: 16 }}
            className="inverted pointer-events-auto relative max-w-[330px] rounded-3xl border border-gold/30 bg-bg px-6 py-7 text-center shadow-[0_24px_70px_rgba(0,0,0,0.5)]"
          >
            {!reduceMotion && (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-3xl border border-gold/40"
                initial={{ opacity: 0.6, scale: 1 }}
                animate={{ opacity: 0, scale: 1.16 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              />
            )}
            <p className="text-[17px] font-medium leading-snug text-text">{t.menuHint}</p>
            <button
              type="button"
              onClick={dismiss}
              className="mt-5 px-3 py-1.5 text-[13px] font-semibold uppercase tracking-[0.2em] text-gold active:opacity-60"
            >
              {t.gotIt}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
