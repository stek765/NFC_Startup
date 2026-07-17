import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { ArrowLeft, MagnifyingGlass } from '@phosphor-icons/react';
import { menu, restaurantName } from '../data/menu';
import { useLang } from '../i18n';
import { localizeCategoryName } from '../i18n/menu.i18n';
import { CategoryTabs } from './CategoryTabs';
import { CategoryHeader } from './CategoryHeader';
import { DishRow } from './DishRow';
import { DishSheet } from './DishSheet';
import { LangSwitcher } from './LangSwitcher';
import { PairingToast } from './PairingToast';
import { SearchOverlay } from './SearchOverlay';
import { SelectionButton } from './SelectionButton';
import { SelectionSheet } from './SelectionSheet';

const HINT_KEY = 'nfc-hint-comanda';
const HINT_TTL_MS = 2 * 60 * 60 * 1000;

function hintDismissed(): boolean {
  try {
    const ts = Number(localStorage.getItem(HINT_KEY));
    return Number.isFinite(ts) && ts > 0 && Date.now() - ts < HINT_TTL_MS;
  } catch {
    return true;
  }
}

export function MenuView({ onBack }: { onBack: () => void }) {
  const { lang, t } = useLang();
  const [activeId, setActiveId] = useState(menu[0].id);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [hintVisible, setHintVisible] = useState(() => !hintDismissed());
  const [customize, setCustomize] = useState<{ item: (typeof menu)[number]['items'][number]; key: string } | null>(null);

  function dismissHint() {
    setHintVisible(false);
    try {
      localStorage.setItem(HINT_KEY, String(Date.now()));
    } catch {
    }
  }
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const isClickScrolling = useRef(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (isClickScrolling.current) return;
    const prev = scrollY.getPrevious() ?? latest;
    if (latest > prev && latest > 160) setHeaderHidden(true);
    else if (latest < prev) setHeaderHidden(false);
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 },
    );

    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function handleSelect(id: string) {
    setActiveId(id);
    isClickScrolling.current = true;
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      isClickScrolling.current = false;
    }, 900);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="relative min-h-dvh overflow-x-clip pb-28"
    >
      <motion.div
        animate={{ y: headerHidden ? '-100%' : '0%' }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-20 border-b border-border bg-bg/90 backdrop-blur-md"
      >
        <div className="flex items-center gap-3 px-6 pt-5">
          <button
            type="button"
            onClick={onBack}
            aria-label={t.back}
            className="rounded-full p-1.5 text-text-muted active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-[13px] font-bold uppercase tracking-[0.25em] text-text">{restaurantName}</h1>
          <div className="ml-auto flex items-center gap-1">
            <LangSwitcher />
          </div>
        </div>
        <CategoryTabs
          categories={menu.map((c) => ({ id: c.id, name: localizeCategoryName(c, lang) }))}
          activeId={activeId}
          onSelect={handleSelect}
        />
      </motion.div>

      {hintVisible && (
        <div className="relative z-10 mx-6 mt-5 flex items-start gap-4 border border-gold/40 bg-surface px-4 py-3.5">
          <p className="min-w-0 flex-1 text-[13px] leading-relaxed text-text">{t.menuHint}</p>
          <button
            type="button"
            onClick={dismissHint}
            className="shrink-0 pt-0.5 text-[11px] font-medium uppercase tracking-[0.2em] text-gold active:opacity-60"
          >
            {t.gotIt}
          </button>
        </div>
      )}

      <div className="relative z-10 space-y-12 px-6 pt-4">
        {menu.map((category, i) => {
          const isNewGroup = i === 0 || menu[i - 1].group !== category.group;
          return (
            <div key={category.id}>
              {isNewGroup && (
                <div className="-mx-6 overflow-hidden pb-2 pt-6">
                  <motion.p
                    aria-hidden
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="whitespace-nowrap px-4 text-center font-display text-[17vw] font-extrabold uppercase leading-[0.9] text-transparent"
                    style={{ WebkitTextStroke: '1.5px color-mix(in srgb, var(--color-gold) 55%, transparent)' }}
                  >
                    {t.groups[category.group]}
                  </motion.p>
                </div>
              )}
              <section
                id={category.id}
                ref={(el) => {
                  sectionRefs.current[category.id] = el;
                }}
                className="scroll-mt-32"
              >
                <CategoryHeader name={localizeCategoryName(category, lang)} index={i} />
                <div>
                  {category.items.map((item) => (
                    <DishRow
                      key={item.id}
                      item={item}
                      selectionKey={`${category.id}:${item.id}`}
                      onCustomize={
                        category.group === 'pizze'
                          ? () => setCustomize({ item, key: `${category.id}:${item.id}` })
                          : undefined
                      }
                    />
                  ))}
                </div>
              </section>
            </div>
          );
        })}
        <p className="mx-auto max-w-[30ch] pt-2 text-center font-display text-[15px] font-semibold leading-snug text-text-muted">
          {t.signOff}
        </p>
        <p className="pb-2 pt-5 text-center text-[11px] uppercase tracking-[0.2em] text-text-muted/60">
          {t.footer}
        </p>
      </div>

      <SelectionButton onOpen={() => setSheetOpen(true)} />

      {!searchOpen && (
        <motion.button
          type="button"
          onClick={() => setSearchOpen(true)}
          aria-label={t.searchAria}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="fixed left-5 z-[45] flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-ink shadow-[0_10px_30px_rgba(28,26,21,0.3)] active:scale-95"
          style={{ bottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
        >
          <MagnifyingGlass size={22} weight="light" />
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full border border-gold"
            animate={{ scale: [1, 1.45], opacity: [0.8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', repeatDelay: 1.6 }}
          />
        </motion.button>
      )}

      {searchOpen && (
        <SearchOverlay
          onClose={() => setSearchOpen(false)}
          onCustomize={(item, key) => setCustomize({ item, key })}
        />
      )}
      <PairingToast />
      {sheetOpen && <SelectionSheet onClose={() => setSheetOpen(false)} />}
      {customize && (
        <DishSheet item={customize.item} selectionKey={customize.key} onClose={() => setCustomize(null)} />
      )}
    </motion.div>
  );
}
