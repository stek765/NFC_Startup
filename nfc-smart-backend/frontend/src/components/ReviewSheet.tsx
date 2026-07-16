import { AnimatePresence, motion } from 'motion/react';
import { Star, X } from '@phosphor-icons/react';
import { useLang } from '../i18n';
import { useLockBodyScroll } from '../lib/useLockBodyScroll';
import { track } from '../lib/analytics';

export function ReviewSheet({ href, onClose }: { href: string; onClose: () => void }) {
  useLockBodyScroll();
  const { t } = useLang();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-end bg-black/60"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full rounded-t-3xl border-t border-border bg-surface px-6 pb-10 pt-4"
        >
          <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-border" />
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-text">{t.reviewSheetTitle}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label={t.close}
              className="rounded-full p-2 text-text-muted active:scale-95"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm leading-relaxed text-text-muted">{t.reviewSheetBody}</p>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              track('review_click', { source: 'timed_sheet' });
              onClose();
            }}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-4 font-display text-[15px] font-bold text-accent-ink active:scale-[0.98]"
          >
            <Star size={18} weight="fill" />
            {t.reviewSheetCta}
          </a>
          <button
            type="button"
            onClick={onClose}
            className="mt-3 w-full py-2 text-center text-sm text-text-muted active:scale-[0.98]"
          >
            {t.reviewSheetDismiss}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
