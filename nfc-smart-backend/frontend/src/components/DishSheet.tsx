import { AnimatePresence, motion } from 'motion/react';
import { Check, X } from '@phosphor-icons/react';
import { EXTRA_INGREDIENTS, type MenuItem } from '../data/menu';
import { useSelection } from '../context/SelectionContext';
import { useLang } from '../i18n';
import { useLockBodyScroll } from '../lib/useLockBodyScroll';

function ingredientsOf(item: MenuItem): string[] {
  return item.description
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 1);
}

function Chip({
  label,
  state,
  onTap,
}: {
  label: string;
  state: 'normal' | 'removed' | 'added';
  onTap: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onTap}
      className={`border px-3.5 py-2 text-[13px] transition active:scale-95 ${
        state === 'removed'
          ? 'border-border text-text-muted/70 line-through'
          : state === 'added'
            ? 'border-text bg-text text-bg'
            : 'border-border text-text'
      }`}
    >
      {label}
    </button>
  );
}

export function DishSheet({
  item,
  selectionKey,
  onClose,
}: {
  item: MenuItem;
  selectionKey: string;
  onClose: () => void;
}) {
  useLockBodyScroll();
  const { t } = useLang();
  const { getMods, setMods, isSelected, toggle } = useSelection();
  const mods = getMods(selectionKey);
  const selected = isSelected(selectionKey);
  const ingredients = ingredientsOf(item);
  const extras = EXTRA_INGREDIENTS.filter(
    (extra) => !ingredients.some((ing) => ing.toLowerCase().includes(extra.toLowerCase())),
  );

  function toggleRemoved(ing: string) {
    const removed = mods.removed.includes(ing)
      ? mods.removed.filter((r) => r !== ing)
      : [...mods.removed, ing];
    setMods(selectionKey, { ...mods, removed });
  }

  function toggleAdded(extra: string) {
    const added = mods.added.includes(extra)
      ? mods.added.filter((a) => a !== extra)
      : [...mods.added, extra];
    setMods(selectionKey, { ...mods, added });
  }

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
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="font-display text-[28px] font-semibold leading-tight text-text">{item.name}</h2>
                <p className="mt-0.5 font-display text-[16px] font-medium tabular-nums text-gold">
                  €{item.price.toFixed(2).replace('.', ',')}
                </p>
              </div>
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
            {ingredients.length > 0 && (
              <>
                <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-gold">
                  {t.ingredientsLabel}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ingredients.map((ing) => (
                    <Chip
                      key={ing}
                      label={ing}
                      state={mods.removed.includes(ing) ? 'removed' : 'normal'}
                      onTap={() => toggleRemoved(ing)}
                    />
                  ))}
                </div>
              </>
            )}

            <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.3em] text-gold">
              {t.extrasLabel}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {extras.map((extra) => (
                <Chip
                  key={extra}
                  label={extra}
                  state={mods.added.includes(extra) ? 'added' : 'normal'}
                  onTap={() => toggleAdded(extra)}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                if (!selected) toggle(selectionKey);
                onClose();
              }}
              className={`mt-7 flex w-full items-center justify-center gap-2.5 px-6 py-4.5 text-[12px] font-normal uppercase tracking-[0.3em] transition active:scale-[0.99] ${
                selected ? 'border border-text/70 text-text' : 'bg-accent text-accent-ink'
              }`}
            >
              {selected && <Check size={15} weight="bold" />}
              {selected ? t.mySelection : t.addToSelection}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
