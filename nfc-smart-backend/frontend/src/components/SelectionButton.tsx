import { AnimatePresence, motion } from 'motion/react';
import { ForkKnife } from '@phosphor-icons/react';
import { useSelection } from '../context/SelectionContext';
import { useLang } from '../i18n';

export function SelectionButton({ onOpen }: { onOpen: () => void }) {
  const { t } = useLang();
  const { count } = useSelection();

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.button
          type="button"
          onClick={onOpen}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed right-5 z-[45] flex items-center gap-2.5 rounded-full bg-accent py-3.5 pl-4 pr-3 text-accent-ink shadow-[0_10px_30px_rgba(38,32,15,0.28)] active:scale-95"
          style={{ bottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
        >
          <ForkKnife size={16} weight="bold" />
          <span className="text-[11px] font-bold uppercase tracking-[0.12em]">{t.mySelection}</span>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-ink px-1 font-display text-[11px] font-bold text-accent">
            {count}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
