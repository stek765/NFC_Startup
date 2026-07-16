import { AnimatePresence, motion } from 'motion/react';
import { Check, Trash, X } from '@phosphor-icons/react';
import { useSelection } from '../context/SelectionContext';
import { useLang } from '../i18n';
import { localizeCategoryName } from '../i18n/menu.i18n';
import { groupPairings, resolveSelection } from '../lib/pairing';
import { useLockBodyScroll } from '../lib/useLockBodyScroll';

function euro(value: number): string {
  return `€${value.toFixed(2).replace('.', ',')}`;
}

export function SelectionSheet({ onClose }: { onClose: () => void }) {
  useLockBodyScroll();
  const { lang, t } = useLang();
  const { selectedKeys, toggle, clear, getMods, isPaired, togglePaired } = useSelection();
  const entries = resolveSelection(selectedKeys);
  const pairings = groupPairings(entries);
  const best = pairings[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-end bg-black/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-[85dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-bg"
        >
          <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-border" />
          <div className="shrink-0 px-6 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[13px] font-medium uppercase tracking-[0.3em] text-text">
                {t.yourSelection}
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
            {entries.length > 0 && (
              <p className="mt-1 text-xs text-text-muted">{t.selectionHint}</p>
            )}
          </div>

          <div
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pt-5"
            style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
          >
            {entries.length === 0 ? (
              <p className="py-10 text-center text-sm text-text-muted">{t.emptySelection}</p>
            ) : (
              <>
                <div>
                  {entries.map(({ key, item, category }, i) => {
                    const isNewCategory = i === 0 || entries[i - 1].category.id !== category.id;
                    const mods = getMods(key);
                    const hasMods = mods.removed.length > 0 || mods.added.length > 0;
                    return (
                      <div key={key}>
                        {isNewCategory && (
                          <p
                            className={`${i === 0 ? '' : 'mt-6'} mb-1.5 text-[10px] font-medium uppercase tracking-[0.3em] text-text-muted`}
                          >
                            {localizeCategoryName(category, lang)}
                          </p>
                        )}
                        <div
                          className={`flex items-start gap-4 py-3.5 ${i === entries.length - 1 ? '' : 'border-b border-border'}`}
                        >
                          <span className="pt-0.5 font-display text-sm font-semibold text-gold">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-display text-[19px] font-medium leading-snug text-text">
                              {item.name}
                            </p>
                            {hasMods && (
                              <p className="mt-0.5 text-[12px] italic leading-relaxed text-gold">
                                {[
                                  ...mods.removed.map((r) => `${t.withoutShort} ${r}`),
                                  ...mods.added.map((a) => `${t.withShort} ${a}`),
                                ].join(' · ')}
                              </p>
                            )}
                            {item.pairing && isPaired(key) && (
                              <button
                                type="button"
                                onClick={() => togglePaired(key)}
                                aria-label={t.removeItem(item.pairing.label)}
                                className="mt-1 flex items-center gap-1.5 text-[13px] text-text active:opacity-60"
                              >
                                <span className="font-display font-medium">
                                  + {item.pairing.label}
                                </span>
                                <span className="tabular-nums text-gold">{euro(item.pairing.price)}</span>
                                <X size={12} className="text-text-muted" />
                              </button>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => toggle(key)}
                            aria-label={t.removeItem(item.name)}
                            className="shrink-0 rounded-full p-1.5 text-text-muted active:scale-90"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {best && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="inverted -mx-6 mt-8 bg-bg px-6 pb-7 pt-6"
                  >
                    <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-gold">
                      {t.houseTip}
                    </p>
                    <p className="mt-1 text-[12px] text-text-muted">{t.askWaiter}</p>
                    <div className="mt-4 flex flex-col gap-3">
                      {pairings.map((group) => {
                        const allTaken = group.keys.every((k) => isPaired(k));
                        return (
                          <div
                            key={group.pairing.label}
                            className="flex items-center gap-3.5 overflow-hidden rounded-2xl border border-border bg-surface p-3"
                          >
                            <img
                              src={group.pairing.image}
                              alt=""
                              className="h-14 w-14 shrink-0 rounded-xl object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-display text-[18px] font-semibold leading-tight text-text">
                                {group.pairing.label}
                                <span className="ml-2 text-[13px] font-medium tabular-nums text-gold">
                                  {euro(group.pairing.price)}
                                </span>
                              </p>
                              <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-text-muted">
                                {t.pairingFor(group.dishes.map((d) => d.name).join(', '))}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const target = !allTaken;
                                for (const k of group.keys) {
                                  if (isPaired(k) !== target) togglePaired(k);
                                }
                              }}
                              className={`shrink-0 px-3 py-2.5 text-[10px] font-medium uppercase tracking-[0.18em] transition active:scale-95 ${
                                allTaken ? 'bg-text text-bg' : 'border border-text/60 text-text'
                              }`}
                            >
                              {allTaken ? <Check size={13} weight="bold" /> : t.takeIt}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                <button
                  type="button"
                  onClick={clear}
                  className="mt-7 w-full border border-border py-3.5 text-[11px] font-normal uppercase tracking-[0.3em] text-text-muted active:scale-[0.98]"
                >
                  {t.clearList}
                </button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
