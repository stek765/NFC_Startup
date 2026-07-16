import { useEffect, useRef, useState } from 'react';
import { CallBell, Star, WifiHigh } from '@phosphor-icons/react';
import type { Restaurant } from '../types';
import { useLang } from '../i18n';
import { track } from '../lib/analytics';
import { reviewUrl } from '../lib/review';

function ActionButton({
  icon,
  label,
  onClick,
  href,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  active?: boolean;
}) {
  const className = `flex flex-1 flex-col items-center gap-2 px-2 py-4 text-center transition active:opacity-60 ${
    active ? 'opacity-100' : ''
  }`;

  const content = (
    <>
      <span className="text-gold">{icon}</span>
      <span
        className={`text-[10px] font-normal uppercase tracking-[0.28em] ${active ? 'text-text underline underline-offset-4' : 'text-text-muted'}`}
      >
        {label}
      </span>
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

function CallWaiterButton() {
  const { t } = useLang();
  const [called, setCalled] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  function callWaiter() {
    if (called) {
      window.clearTimeout(timeoutRef.current);
      setCalled(false);
      return;
    }
    track('call_waiter');
    setCalled(true);
    timeoutRef.current = window.setTimeout(() => setCalled(false), 30_000);
  }

  return (
    <ActionButton
      icon={<CallBell size={21} weight={called ? "fill" : "light"} />}
      label={called ? t.waiterCalled : t.waiter}
      onClick={callWaiter}
      active={called}
    />
  );
}

export function QuickActions({
  restaurant,
  onWifiClick,
  onReviewsClick,
}: {
  restaurant: Restaurant;
  onWifiClick: () => void;
  onReviewsClick: () => void;
}) {
  const { t } = useLang();

  const reviewHref = reviewUrl(restaurant);

  return (
    <div className="mt-4 flex divide-x divide-border border-t border-border pt-1">
      {restaurant.wifi_password && (
        <ActionButton icon={<WifiHigh size={21} weight="light" />} label="Wi-Fi" onClick={onWifiClick} />
      )}
      {reviewHref && (
        <ActionButton
          icon={<Star size={21} weight="light" />}
          label={t.reviews}
          onClick={() => {
            track('review_click', { source: 'quick_action' });
            onReviewsClick();
          }}
        />
      )}
      <CallWaiterButton />
    </div>
  );
}
