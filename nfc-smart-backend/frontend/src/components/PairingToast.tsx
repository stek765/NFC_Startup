import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check } from '@phosphor-icons/react';
import { menu, type MenuItem } from '../data/menu';
import { useSelection } from '../context/SelectionContext';
import { useLang } from '../i18n';
import { localizeNote } from '../i18n/menu.i18n';

function itemFromKey(key: string): MenuItem | undefined {
  const separator = key.indexOf(':');
  const categoryId = key.slice(0, separator);
  const itemId = key.slice(separator + 1);
  return menu.find((c) => c.id === categoryId)?.items.find((i) => i.id === itemId);
}

export function PairingToast() {
  const { lang, t } = useLang();
  const { lastAdded, isPaired, togglePaired } = useSelection();
  const [current, setCurrent] = useState<{ item: MenuItem; key: string; ts: number } | null>(null);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!lastAdded) return;
    const item = itemFromKey(lastAdded.key);
    if (!item?.pairing) return;
    setCurrent({ item, key: lastAdded.key, ts: lastAdded.ts });
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCurrent(null), 10000);
    return () => window.clearTimeout(timerRef.current);
  }, [lastAdded]);

  const pairing = current?.item.pairing;
  const accepted = current ? isPaired(current.key) : false;

  function accept() {
    if (!current) return;
    togglePaired(current.key);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCurrent(null), 1300);
  }

  return (
    <AnimatePresence>
      {current && pairing && (
        <motion.div
          key={current.ts}
          onClick={() => setCurrent(null)}
          initial={{ opacity: 0, y: 48, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, transition: { duration: 0.25 } }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          role="status"
          className="fixed inset-x-3 z-[45] flex cursor-pointer overflow-hidden rounded-3xl border border-border bg-surface text-left shadow-[0_18px_50px_rgba(38,32,15,0.25)]"
          style={{ bottom: 'calc(max(1.25rem, env(safe-area-inset-bottom)) + 4.5rem)' }}
        >
          <div className="relative order-2 w-[36%] shrink-0 self-stretch overflow-hidden">
            <motion.img
              src={pairing.image}
              alt=""
              initial={{ scale: 1.22 }}
              animate={{ scale: 1 }}
              transition={{ duration: 5, ease: 'linear' }}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(90deg, var(--color-surface) 0%, transparent 35%)' }}
            />
          </div>
          <div className="relative order-1 min-w-0 flex-1 px-5 pb-5 pt-6">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12 }}
              className="text-[10px] font-medium uppercase tracking-[0.3em] text-gold"
            >
              {t.houseTip}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-1 font-display text-[26px] font-semibold leading-none text-text"
            >
              {pairing.label}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-1.5 max-w-[90%] text-[12px] leading-relaxed text-text-muted"
            >
              {localizeNote(current.item, lang)}
            </motion.p>
            <motion.button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                accept();
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.38 }}
              className={`mt-3.5 flex items-center gap-2 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] transition active:scale-95 ${
                accepted ? 'bg-text text-bg' : 'border border-text/60 text-text'
              }`}
            >
              {accepted && <Check size={13} weight="bold" />}
              {accepted ? t.inList : `${t.takeIt} · €${pairing.price.toFixed(2).replace('.', ',')}`}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
