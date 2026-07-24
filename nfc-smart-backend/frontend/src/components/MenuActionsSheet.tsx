import { AnimatePresence, motion } from 'motion/react';
import { CallBell, CaretRight, MagnifyingGlass, Star, WifiHigh, X } from '@phosphor-icons/react';
import type { Restaurant } from '../types';
import { useLang } from '../i18n';
import { track } from '../lib/analytics';
import { reviewUrl } from '../lib/review';
import { useCallWaiter } from '../lib/useCallWaiter';
import { useLockBodyScroll } from '../lib/useLockBodyScroll';
import { useSheetDrag } from '../lib/useSheetDrag';

function Row({
  icon,
  label,
  sublabel,
  onClick,
  href,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  onClick?: () => void;
  href?: string;
  active?: boolean;
}) {
  const className = `flex w-full items-center gap-4 border-b border-border px-1 py-5 text-left last:border-b-0 active:opacity-70 ${
    active ? 'text-accent' : 'text-text'
  }`;

  const content = (
    <>
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
          active ? 'bg-accent text-accent-ink' : 'bg-surface-raised text-accent'
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[19px] font-semibold leading-tight">{label}</span>
        {sublabel && <span className="mt-0.5 block text-[12px] text-text-muted">{sublabel}</span>}
      </span>
      {!active && <CaretRight size={18} className="shrink-0 text-text-muted" />}
    </>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" onClick={onClick} className={className}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}

export function MenuActionsSheet({
  restaurant,
  onClose,
  onSearchClick,
  onWifiClick,
  onReviewsClick,
}: {
  restaurant: Restaurant;
  onClose: () => void;
  onSearchClick: () => void;
  onWifiClick: () => void;
  onReviewsClick: () => void;
}) {
  useLockBodyScroll();
  const { startDrag, panelProps } = useSheetDrag(onClose);
  const { t } = useLang();
  const { called, callWaiter } = useCallWaiter();
  const reviewHref = reviewUrl(restaurant);

  return (
    <AnimatePresence>
      <motion.div
        key="menu-actions-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[60] flex items-end bg-black/60"
        onClick={onClose}
      >
        <motion.div
          {...panelProps}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          onClick={(e) => e.stopPropagation()}
          className="inverted w-full rounded-t-3xl bg-bg px-6 pb-10 pt-4"
        >
          <div onPointerDown={startDrag} className="-mt-2 touch-none py-3" style={{ cursor: 'grab' }}>
            <div className="mx-auto h-1 w-10 rounded-full bg-border" />
          </div>
          <div className="mb-1 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-text">{t.moreOptions}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label={t.close}
              className="rounded-full p-2 text-text-muted active:scale-95"
            >
              <X size={20} />
            </button>
          </div>
          <p className="mb-3 text-[13px] text-text-muted">{t.moreOptionsHint}</p>

          <div>
            <Row icon={<MagnifyingGlass size={22} weight="light" />} label={t.searchAria} onClick={onSearchClick} />
            {restaurant.wifi_password && (
              <Row icon={<WifiHigh size={22} weight="light" />} label="Wi-Fi" onClick={onWifiClick} />
            )}
            {reviewHref && (
              <Row
                icon={<Star size={22} weight="light" />}
                label={t.reviews}
                onClick={() => {
                  track('review_click', { source: 'quick_action' });
                  onReviewsClick();
                }}
              />
            )}
            <Row
              icon={<CallBell size={22} weight={called ? 'fill' : 'light'} />}
              label={called ? t.waiterCalled : t.waiter}
              active={called}
              onClick={callWaiter}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
