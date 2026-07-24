import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, HandPointing, X } from '@phosphor-icons/react';
import { EXTRA_INGREDIENTS, type MenuItem } from '../data/menu';
import { useSelection } from '../context/SelectionContext';
import { useLang } from '../i18n';
import { dishTotal } from '../lib/pricing';
import { useLockBodyScroll } from '../lib/useLockBodyScroll';
import { useSheetDrag } from '../lib/useSheetDrag';

function euro(value: number): string {
  return `€${value.toFixed(2).replace('.', ',')}`;
}

function ingredientsOf(item: MenuItem): string[] {
  return item.description
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 1);
}

// Three real poses (not a baked keyframe array) chained through spring
// physics via onAnimationComplete — each leg of the tap gets its own spring
// feel (a settling entrance, a quick decisive flick down, a soft release),
// which reads as one continuous fluid gesture instead of a mechanical
// tween. `onLand` fires exactly when the flick lands, so the chip's own
// "removed" look and the ripple are triggered by the real animation state
// rather than a guessed timestamp.
const FINGER_POSES = {
  hidden: { opacity: 0, scale: 0.7, rotate: -16, x: 0, y: 0 },
  idle: { opacity: 1, scale: 1, rotate: -13, x: 0, y: 0 },
  tap: { opacity: 1, scale: 0.82, rotate: 12, x: 2, y: 4 },
  relax: { opacity: 1, scale: 0.92, rotate: -4, x: 0, y: -1 },
} as const;

function FingerTap({ onLand }: { onLand: () => void }) {
  const [phase, setPhase] = useState<'idle' | 'tap' | 'relax'>('idle');

  return (
    <motion.span
      key="demo-finger"
      initial={FINGER_POSES.hidden}
      animate={FINGER_POSES[phase]}
      exit={{ opacity: 0, scale: 0.75, transition: { duration: 0.35, ease: 'easeOut' } }}
      transition={
        phase === 'idle'
          ? { type: 'spring', stiffness: 260, damping: 22 }
          : phase === 'tap'
            ? { type: 'spring', stiffness: 520, damping: 13 }
            : { type: 'spring', stiffness: 220, damping: 24 }
      }
      onAnimationComplete={() => {
        if (phase === 'idle') {
          onLand();
          setPhase('tap');
        } else if (phase === 'tap') {
          setPhase('relax');
        }
      }}
      className="flex h-full w-full items-center justify-center text-gold drop-shadow-[0_4px_10px_rgba(28,26,21,0.35)]"
    >
      <HandPointing size={26} weight="bold" />
    </motion.span>
  );
}

function Chip({
  label,
  priceLabel,
  state,
  demo,
  demoLanded,
  onLand,
  onTap,
}: {
  label: string;
  priceLabel?: string;
  state: 'normal' | 'removed' | 'added';
  demo?: boolean;
  demoLanded?: boolean;
  onLand?: () => void;
  onTap: () => void;
}) {
  const showRemoved = state === 'removed' || demoLanded;
  return (
    <motion.button
      type="button"
      onClick={onTap}
      animate={demoLanded ? { scale: 0.86 } : { scale: 1 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={`relative overflow-visible border px-3.5 py-2 text-[13px] transition active:scale-95 ${
        showRemoved
          ? 'border-border text-text-muted/70 line-through'
          : state === 'added'
            ? 'border-text bg-text text-bg'
            : 'border-border text-text'
      }`}
    >
      <AnimatePresence>
        {demo && (
          <>
            {demoLanded && (
              <motion.span
                aria-hidden
                key="demo-ripple"
                initial={{ opacity: 0.6, scale: 0.3 }}
                animate={{ opacity: 0, scale: 2.2 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold"
              />
            )}
            {/* Static wrapper handles centering only, so the pose animation
                below can't ever fight it for control of `transform`. */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-11 w-11 -translate-x-1/2 -translate-y-1/2"
            >
              <FingerTap onLand={() => onLand?.()} />
            </span>
          </>
        )}
      </AnimatePresence>
      {label}
      {priceLabel && !showRemoved && (
        <span className={`ml-1.5 tabular-nums ${state === 'added' ? 'text-bg/70' : 'text-text-muted'}`}>
          {priceLabel}
        </span>
      )}
    </motion.button>
  );
}

export function DishSheet({
  item,
  selectionKey,
  onClose,
}: {
  item: MenuItem;
  selectionKey: string;
  onClose: () => void;
}) {
  useLockBodyScroll();
  const { startDrag, panelProps } = useSheetDrag(onClose);
  const { t } = useLang();
  const { getMods, setMods, isSelected, toggle } = useSelection();
  const mods = getMods(selectionKey);
  const selected = isSelected(selectionKey);
  const ingredients = ingredientsOf(item);
  const extras = EXTRA_INGREDIENTS.filter(
    (extra) => !ingredients.some((ing) => ing.toLowerCase().includes(extra.name.toLowerCase())),
  );
  const total = dishTotal(item, mods);

  // First time someone opens this dish's editor, briefly show an oversized
  // finger "tapping" the first ingredient to demonstrate removal — doesn't
  // touch real selection state, purely a demonstration. It stays in place
  // and just rotates/shifts slightly (no swoop-in from off-screen). The
  // finger's own spring sequence (FingerTap) reports back via onLand exactly
  // when its tap flick lands, so the chip's "removed" look and the ripple
  // are triggered by the real animation, not a guessed timestamp.
  const [demoOn, setDemoOn] = useState(false);
  const [demoLanded, setDemoLanded] = useState(false);
  useEffect(() => {
    if (mods.removed.length > 0 || mods.added.length > 0) return;
    const showTimer = window.setTimeout(() => setDemoOn(true), 600);
    const hideTimer = window.setTimeout(() => {
      setDemoOn(false);
      setDemoLanded(false);
    }, 4200);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleRemoved(ing: string) {
    const removed = mods.removed.includes(ing)
      ? mods.removed.filter((r) => r !== ing)
      : [...mods.removed, ing];
    setMods(selectionKey, { ...mods, removed });
  }

  function toggleAdded(extra: string) {
    const added = mods.added.includes(extra)
      ? mods.added.filter((a) => a !== extra)
      : [...mods.added, extra];
    setMods(selectionKey, { ...mods, added });
  }

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
          {...panelProps}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-[85dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-bg"
        >
          <div onPointerDown={startDrag} className="shrink-0 touch-none py-3" style={{ cursor: 'grab' }}>
            <div className="mx-auto h-1 w-10 rounded-full bg-border" />
          </div>
          <div className="shrink-0 px-6 pt-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="font-display text-[28px] font-semibold leading-tight text-text">{item.name}</h2>
                <p className="mt-0.5 font-display text-[16px] font-medium tabular-nums text-gold">
                  {euro(total)}
                  {mods.added.length > 0 && (
                    <span className="ml-1.5 text-[12px] font-normal text-text-muted line-through">
                      {euro(item.price)}
                    </span>
                  )}
                </p>
              </div>
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
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pt-5"
            style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
          >
            {ingredients.length > 0 && (
              <>
                <p className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-gold">
                    {t.ingredientsLabel}
                  </span>
                  <span className="text-[13px] text-text-muted">({t.tapToRemove})</span>
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ingredients.map((ing, i) => (
                    <Chip
                      key={ing}
                      label={ing}
                      state={mods.removed.includes(ing) ? 'removed' : 'normal'}
                      demo={i === 0 && demoOn}
                      demoLanded={i === 0 && demoLanded}
                      onLand={() => setDemoLanded(true)}
                      onTap={() => toggleRemoved(ing)}
                    />
                  ))}
                </div>
              </>
            )}

            <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.3em] text-gold">
              {t.extrasLabel}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {extras.map((extra) => (
                <Chip
                  key={extra.name}
                  label={extra.name}
                  priceLabel={`+${euro(extra.price)}`}
                  state={mods.added.includes(extra.name) ? 'added' : 'normal'}
                  onTap={() => toggleAdded(extra.name)}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                if (!selected) toggle(selectionKey);
                onClose();
              }}
              className={`mt-7 flex w-full items-center justify-center gap-2.5 px-6 py-4.5 text-[12px] font-normal uppercase tracking-[0.3em] transition active:scale-[0.99] ${
                selected ? 'border border-text/70 text-text' : 'bg-accent text-accent-ink'
              }`}
            >
              {selected && <Check size={15} weight="bold" />}
              {selected ? t.mySelection : t.addToSelection}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
