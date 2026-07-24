import { AnimatePresence, motion } from 'motion/react';
import { Check, Plus } from '@phosphor-icons/react';
import type { MenuItem } from '../data/menu';
import { useSelection } from '../context/SelectionContext';
import { useLang } from '../i18n';
import { localizeDescription } from '../i18n/menu.i18n';

export function DishRow({
  item,
  selectionKey,
  onCustomize,
}: {
  item: MenuItem;
  selectionKey: string;
  onCustomize?: () => void;
}) {
  const { lang, t } = useLang();
  const { isSelected, toggle, getMods } = useSelection();
  const selected = isSelected(selectionKey);
  const description = localizeDescription(item, lang);
  const mods = getMods(selectionKey);
  const hasMods = selected && (mods.removed.length > 0 || mods.added.length > 0);
  const handleTap = selected ? () => toggle(selectionKey) : (onCustomize ?? (() => toggle(selectionKey)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`-mx-3.5 flex items-start gap-1.5 rounded-2xl px-3.5 py-4.5 transition-colors ${selected ? 'bg-surface' : ''}`}
    >
      <button
        type="button"
        onClick={handleTap}
        aria-pressed={selected}
        className="min-w-0 flex-1 text-left active:opacity-70"
      >
        <div className="flex items-baseline gap-2.5">
          <h3 className="font-display text-[19px] font-semibold leading-snug text-text">
            {item.name}
          </h3>
          <span className="mb-[5px] min-w-4 flex-1 border-b border-dotted border-text-muted/30" />
          <span className="shrink-0 font-display text-[16px] font-medium tabular-nums text-text">
            {item.price.toFixed(2).replace('.', ',')}
          </span>
        </div>
        {description && (
          <p className="mt-1 text-[13px] leading-relaxed text-text-muted">{description}</p>
        )}
        {hasMods && (
          <p className="mt-1 text-[12px] italic leading-relaxed text-gold">
            {[
              ...mods.removed.map((r) => `${t.withoutShort} ${r}`),
              ...mods.added.map((a) => `${t.withShort} ${a}`),
            ].join(' · ')}
          </p>
        )}
      </button>
      <button
        type="button"
        onClick={handleTap}
        aria-label={selected ? t.removeItem(item.name) : t.addToSelection}
        aria-pressed={selected}
        className={`mt-[3px] flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors active:scale-90 ${
          selected ? 'bg-text text-bg' : 'border border-text-muted/35 text-text-muted/70'
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {selected ? (
            <motion.span
              key="check"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center"
            >
              <Check size={12} weight="bold" />
            </motion.span>
          ) : (
            <motion.span
              key="plus"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center"
            >
              <Plus size={12} weight="bold" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}
