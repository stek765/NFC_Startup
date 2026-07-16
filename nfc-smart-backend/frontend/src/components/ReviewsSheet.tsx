import { AnimatePresence, motion } from 'motion/react';
import { Star, X } from '@phosphor-icons/react';
import { curatedReviews, googleRating, googleReviewCount } from '../data/reviews';
import { useLang } from '../i18n';
import { track } from '../lib/analytics';
import { useLockBodyScroll } from '../lib/useLockBodyScroll';

export function ReviewsSheet({ href, onClose }: { href: string; onClose: () => void }) {
  useLockBodyScroll();
  const { t } = useLang();

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
            <div className="flex items-center justify-between">
              <h2 className="text-[13px] font-medium uppercase tracking-[0.3em] text-text">
                {t.reviewsHeadline}
              </h2>
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
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pt-6"
            style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
          >
            <div className="flex items-baseline gap-3">
              <p className="font-display text-[56px] font-medium leading-none text-text">{googleRating}</p>
              <div>
                <div className="flex gap-0.5 text-gold" aria-hidden>
                  {[1, 2, 3, 4].map((i) => (
                    <Star key={i} size={15} weight="fill" />
                  ))}
                  <Star size={15} weight="regular" />
                </div>
                <p className="mt-1 text-[12px] text-text-muted">
                  {t.ratingLine(googleRating, googleReviewCount)}
                </p>
              </div>
            </div>

            {curatedReviews.length > 0 && (
              <div className="mt-7 space-y-6">
                {curatedReviews.map((review) => (
                  <figure key={review.name} className="border-l border-gold/50 pl-4">
                    <div className="flex gap-0.5 text-gold" aria-hidden>
                      {Array.from({ length: review.stars }).map((_, i) => (
                        <Star key={i} size={12} weight="fill" />
                      ))}
                    </div>
                    <blockquote className="mt-2 font-display text-[19px] font-normal italic leading-snug text-text">
                      “{review.text}”
                    </blockquote>
                    <figcaption className="mt-1.5 text-[11px] uppercase tracking-[0.2em] text-text-muted">
                      {review.name} · Google
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}

            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                track('review_click', { source: 'reviews_page' });
                onClose();
              }}
              className="mt-8 flex w-full items-center justify-center gap-2.5 bg-accent px-6 py-4.5 text-[12px] font-normal uppercase tracking-[0.3em] text-accent-ink transition active:scale-[0.99]"
            >
              <Star size={15} weight="fill" />
              {t.reviewsCta}
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
