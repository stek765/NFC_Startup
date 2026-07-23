import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CaretRight, PencilSimple, Trash, X } from '@phosphor-icons/react';
import { useSelection } from '../context/SelectionContext';
import type { DishMods } from '../context/SelectionContext';
import { useLang } from '../i18n';
import { localizeCategoryName } from '../i18n/menu.i18n';
import type { MenuItem } from '../data/menu';
import { type PairingGroup, pairingTint, resolveSelection, untakenPairingGroups } from '../lib/pairing';
import { useLockBodyScroll } from '../lib/useLockBodyScroll';
import { DrinkSheet } from './DrinkSheet';

function euro(value: number): string {
  return `€${value.toFixed(2).replace('.', ',')}`;
}

function DishNameBlock({ name, mods, hasMods }: { name: string; mods: DishMods; hasMods: boolean }) {
  return (
    <>
      <span className="block font-display text-[19px] font-medium leading-snug text-text">{name}</span>
      {hasMods && (
        <span className="mt-1 block">
          {mods.removed.length > 0 && (
            <span className="block text-[13px] leading-relaxed text-text-muted line-through">
              − {mods.removed.join(' · ')}
            </span>
          )}
          {mods.added.length > 0 && (
            <span className="mt-0.5 block text-[13px] font-semibold leading-relaxed text-gold">
              + {mods.added.join(' · ')}
            </span>
          )}
        </span>
      )}
    </>
  );
}

export function SelectionSheet({
  onClose,
  onCustomize,
}: {
  onClose: () => void;
  onCustomize: (item: MenuItem, key: string) => void;
}) {
  useLockBodyScroll();
  const { lang, t } = useLang();
  const { selectedKeys, toggle, clear, getMods, isPaired, togglePaired } = useSelection();
  const entries = resolveSelection(selectedKeys);
  const pairings = untakenPairingGroups(entries, isPaired);

  const [openDrink, setOpenDrink] = useState<PairingGroup | null>(null);

  return (
    <>
      <AnimatePresence>
        <motion.div
          key="selection-sheet-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-end bg-black/50"
        onClick={onClose}
      >
        <motion.div
          layout
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
                            className={`${i === 0 ? '' : 'mt-7'} mb-2 text-[13px] font-semibold uppercase tracking-[0.25em] text-text`}
                          >
                            {localizeCategoryName(category, lang)}
                          </p>
                        )}
                        <div
                          className={`flex items-start gap-4 px-2 -mx-2 py-3.5 ${
                            i === entries.length - 1 ? '' : 'border-b border-border'
                          }`}
                        >
                          <span className="pt-0.5 font-display text-sm font-semibold text-gold">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <div className="min-w-0 flex-1">
                            {category.group === 'pizze' ? (
                              <button type="button" onClick={() => onCustomize(item, key)} className="block w-full text-left">
                                <DishNameBlock name={item.name} mods={mods} hasMods={hasMods} />
                                <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-gold/50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-gold">
                                  <PencilSimple size={11} weight="bold" />
                                  {t.edit}
                                </span>
                              </button>
                            ) : (
                              <DishNameBlock name={item.name} mods={mods} hasMods={hasMods} />
                            )}
                            <AnimatePresence>
                              {item.pairing && isPaired(key) && (
                                <motion.button
                                  type="button"
                                  onClick={() => togglePaired(key)}
                                  aria-label={t.removeItem(item.pairing.label)}
                                  initial={{ opacity: 0, scale: 0.85 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.85 }}
                                  transition={{ duration: 0.2 }}
                                  style={{
                                    backgroundColor: pairingTint(item.pairing.label).bg,
                                    color: pairingTint(item.pairing.label).text,
                                  }}
                                  className="mt-1.5 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] active:opacity-70"
                                >
                                  <span className="font-display font-medium">{item.pairing.label}</span>
                                  <span className="tabular-nums opacity-80">{euro(item.pairing.price)}</span>
                                  <X size={12} />
                                </motion.button>
                              )}
                            </AnimatePresence>
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

                {entries.length > 0 && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="inverted -mx-6 mt-8 bg-bg px-6 pb-7 pt-6"
                  >
                    <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-gold">
                      {t.houseTip}
                    </p>
                    <p className="mt-1 text-[12px] text-text-muted">
                      {pairings.length > 0 ? t.askWaiter : t.noMorePairings}
                    </p>
                    <div className="mt-4 flex flex-col gap-3">
                      {pairings.map((group) => (
                        <button
                          key={group.pairing.label}
                          type="button"
                          onClick={() => setOpenDrink(group)}
                          className="flex items-center gap-3.5 overflow-hidden rounded-2xl border border-border bg-surface p-3 text-left active:opacity-80"
                        >
                          <img
                            src={group.pairing.image}
                            alt=""
                            className="h-16 w-16 shrink-0 rounded-xl object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-display text-[18px] font-semibold leading-tight text-text">
                              {group.pairing.label}
                              <span className="ml-2 text-[13px] font-medium tabular-nums text-gold">
                                {euro(group.pairing.price)}
                              </span>
                            </p>
                            <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-text-muted">
                              {t.pairingFor(group.dishes.map((d) => d.name).join(', '))}
                            </p>
                            <span className="mt-1.5 flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.18em] text-gold">
                              {t.discover}
                              <CaretRight size={12} weight="bold" />
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                <button
                  type="button"
                  onClick={clear}
                  className="mt-7 flex w-full items-center justify-center gap-2 border border-text/50 py-3.5 text-[12px] font-medium uppercase tracking-[0.3em] text-text active:scale-[0.98]"
                >
                  <Trash size={15} />
                  {t.clearList}
                </button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
      </AnimatePresence>
      <DrinkSheet group={openDrink} onClose={() => setOpenDrink(null)} />
    </>
  );
}
