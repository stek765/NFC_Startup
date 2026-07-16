import { motion } from 'motion/react';
import { restaurantMotto } from '../data/menu';
import { useLang } from '../i18n';
import { LangSwitcher } from './LangSwitcher';

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero({ onOpenMenu, actions }: { onOpenMenu: () => void; actions?: React.ReactNode }) {
  const { t } = useLang();

  return (
    <div
      className="relative flex min-h-dvh flex-col px-7"
      style={{
        paddingTop: 'max(1.25rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="flex justify-end"
      >
        <LangSwitcher />
      </motion.div>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="text-[10px] font-medium uppercase tracking-[0.45em] text-gold"
        >
          Pizzeria · Verona
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.25, ease }}
          className="mt-6 font-display text-[76px] font-medium leading-[0.95] text-text"
        >
          Notte
          <br />
          <span className="italic">Dì</span>
        </motion.h1>

        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.7, ease }}
          className="mt-9 h-px w-14 bg-gold"
        />

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.85, ease }}
          className="mt-8 max-w-[30ch] font-display text-[20px] font-normal italic leading-snug text-text/80"
        >
          {restaurantMotto}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, delay: 1.05 }}
          className="mt-8 font-script text-[42px] leading-none text-text"
          style={{ transform: 'rotate(-3deg)' }}
        >
          Notte Dì
        </motion.p>
      </div>

      <div>
        <motion.button
          type="button"
          onClick={onOpenMenu}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.25, ease }}
          className="flex w-full items-center justify-center border border-text/70 bg-transparent px-6 py-5 text-text transition active:bg-text active:text-bg"
        >
          <span className="text-[12px] font-normal uppercase tracking-[0.35em]">{t.browseMenu}</span>
        </motion.button>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.45 }}
        >
          {actions}
        </motion.div>
      </div>
    </div>
  );
}
