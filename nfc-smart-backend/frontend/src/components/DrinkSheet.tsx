import { AnimatePresence, motion } from 'motion/react';
import { X } from '@phosphor-icons/react';
import { getDrinkInfo } from '../data/drinkInfo';
import { useSelection } from '../context/SelectionContext';
import { useLang } from '../i18n';
import { localizeDrinkDescription } from '../i18n/menu.i18n';
import type { PairingGroup } from '../lib/pairing';
import { useLockBodyScroll } from '../lib/useLockBodyScroll';
import { useSheetDrag } from '../lib/useSheetDrag';

function euro(value: number): string {
  return `€${value.toFixed(2).replace('.', ',')}`;
}

export function DrinkSheet({
  group,
  onClose,
}: {
  group: PairingGroup | null;
  onClose: () => void;
}) {
  useLockBodyScroll(group !== null);
  const { startDrag, panelProps } = useSheetDrag(onClose);
  const { lang, t } = useLang();
  const { isPaired, togglePaired } = useSelection();
  const info = group ? getDrinkInfo(group.pairing.label) : undefined;

  return (
    <AnimatePresence>
      {group && (
        <motion.div
          key="drink-sheet-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end bg-black/50"
          onClick={onClose}
        >
          <motion.div
            {...panelProps}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-bg"
          >
            <div onPointerDown={startDrag} className="shrink-0 touch-none py-3" style={{ cursor: 'grab' }}>
              <div className="mx-auto h-1 w-10 rounded-full bg-border" />
            </div>
            <div className="shrink-0 px-6 pt-4">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-display text-[28px] font-semibold leading-tight text-text">
                  {group.pairing.label}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={t.close}
                  className="rounded-full p-2 text-text-muted active:scale-95"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pt-5"
              style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
            >
              {info && (
                <>
                  <img src={info.image} alt="" className="h-48 w-full rounded-2xl object-cover" />
                  <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
                    {localizeDrinkDescription(info, lang)}
                  </p>
                </>
              )}

              <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.3em] text-gold">
                {t.pairingFor(group.dishes.map((d) => d.name).join(', '))}
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {group.dishes.map((dish, idx) => {
                  const key = group.keys[idx];
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-3.5"
                    >
                      <span className="min-w-0 flex-1 font-display text-[16px] font-medium text-text">
                        {dish.name}
                      </span>
                      <span className="shrink-0 text-[13px] tabular-nums text-text-muted">
                        {euro(group.pairing.price)}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (isPaired(key)) return;
                          togglePaired(key);
                          window.setTimeout(onClose, 500);
                        }}
                        className="flex shrink-0 items-center gap-1.5 bg-accent px-3.5 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-accent-ink transition active:scale-95"
                      >
                        {t.addShort}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
