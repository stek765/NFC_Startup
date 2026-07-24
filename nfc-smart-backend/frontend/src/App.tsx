import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Restaurant } from './types';
import { Hero } from './components/Hero';
import { QuickActions } from './components/QuickActions';
import { MenuView } from './components/MenuView';
import { WifiModal } from './components/WifiModal';
import { ReviewSheet } from './components/ReviewSheet';
import { ReviewsSheet } from './components/ReviewsSheet';
import { SelectionProvider } from './context/SelectionContext';
import { LangProvider } from './i18n';
import { track } from './lib/analytics';
import { reviewUrl } from './lib/review';
import { markFirstSeen, markPrompted, shouldPrompt } from './lib/reviewPrompt';

type Screen = 'hero' | 'menu';

export function App({ restaurant }: { restaurant: Restaurant }) {
  const [screen, setScreen] = useState<Screen>('hero');
  const [wifiOpen, setWifiOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewsPageOpen, setReviewsPageOpen] = useState(false);
  const reviewHref = reviewUrl(restaurant);

  useEffect(() => {
    markFirstSeen();
    if (!reviewHref) return;
    function check() {
      if (document.visibilityState !== 'visible') return;
      if (wifiOpen || reviewsPageOpen) return;
      if (shouldPrompt()) {
        markPrompted();
        setReviewOpen(true);
      }
    }
    check();
    document.addEventListener('visibilitychange', check);
    return () => document.removeEventListener('visibilitychange', check);
  }, [reviewHref, wifiOpen, reviewsPageOpen]);

  function goTo(next: Screen) {
    setScreen(next);
    window.scrollTo(0, 0);
  }

  function openWifi() {
    setWifiOpen(true);
    track('wifi_open');
  }

  return (
    <LangProvider>
      <SelectionProvider>
        <div className="bg-bg">
          <AnimatePresence mode="wait">
            {screen === 'hero' ? (
              <motion.div key="hero" exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <Hero
                  onOpenMenu={() => goTo('menu')}
                  actions={
                    <QuickActions
                      restaurant={restaurant}
                      onWifiClick={openWifi}
                      onReviewsClick={() => setReviewsPageOpen(true)}
                    />
                  }
                />
              </motion.div>
            ) : (
              <MenuView
                key="menu"
                restaurant={restaurant}
                onBack={() => goTo('hero')}
                onWifiClick={openWifi}
                onReviewsClick={() => setReviewsPageOpen(true)}
              />
            )}
          </AnimatePresence>

          {wifiOpen && restaurant.wifi_password && (
            <WifiModal password={restaurant.wifi_password} onClose={() => setWifiOpen(false)} />
          )}

          {reviewsPageOpen && reviewHref && (
            <ReviewsSheet href={reviewHref} onClose={() => setReviewsPageOpen(false)} />
          )}

          {reviewOpen && reviewHref && (
            <ReviewSheet href={reviewHref} onClose={() => setReviewOpen(false)} />
          )}
        </div>
      </SelectionProvider>
    </LangProvider>
  );
}
