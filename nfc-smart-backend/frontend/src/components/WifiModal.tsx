import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Copy, X } from '@phosphor-icons/react';
import { useLang } from '../i18n';
import { useLockBodyScroll } from '../lib/useLockBodyScroll';

export function WifiModal({ password, onClose }: { password: string; onClose: () => void }) {
  useLockBodyScroll();
  const { t } = useLang();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

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
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-text">{t.wifiNetwork}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label={t.close}
              className="rounded-full p-2 text-text-muted active:scale-95"
            >
              <X size={20} />
            </button>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="flex w-full items-center justify-between rounded-2xl border border-border bg-surface-raised px-5 py-4 text-left active:scale-[0.98]"
          >
            <span className="font-mono text-lg text-text">{password}</span>
            <span className="text-accent">{copied ? <Check size={20} weight="bold" /> : <Copy size={20} />}</span>
          </button>
          <p className="mt-3 text-sm text-text-muted">{copied ? t.copied : t.tapToCopy}</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
