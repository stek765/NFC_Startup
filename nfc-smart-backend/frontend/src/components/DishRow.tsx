import { AnimatePresence, motion } from 'motion/react';
import { Check } from '@phosphor-icons/react';
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
        onClick={onCustomize ?? (() => toggle(selectionKey))}
        aria-pressed={onCustomize ? undefined : selected}
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
      <AnimatePresence>
        {selected && (
          <motion.button
            type="button"
            onClick={() => toggle(selectionKey)}
            aria-label={t.removeItem(item.name)}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2 }}
            className="mt-[3px] flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-text text-bg active:scale-90"
          >
            <Check size={12} weight="bold" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
