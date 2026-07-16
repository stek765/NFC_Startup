import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { MagnifyingGlass, X } from '@phosphor-icons/react';
import { menu, type MenuCategory, type MenuItem } from '../data/menu';
import { useLang, type Lang } from '../i18n';
import { localizeCategoryName, localizeDescription } from '../i18n/menu.i18n';
import { track } from '../lib/analytics';
import { useLockBodyScroll } from '../lib/useLockBodyScroll';
import { DishRow } from './DishRow';

interface Result {
  category: MenuCategory;
  items: MenuItem[];
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function search(query: string, lang: Lang): Result[] {
  const q = normalize(query.trim());
  if (!q) return [];
  const results: Result[] = [];
  for (const category of menu) {
    const items = category.items.filter((item) =>
      normalize(`${item.name} ${item.description} ${localizeDescription(item, lang)}`).includes(q),
    );
    if (items.length > 0) results.push({ category, items });
  }
  return results;
}

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  useLockBodyScroll();
  const { lang, t } = useLang();
  const [query, setQuery] = useState('');
  const results = useMemo(() => search(query, lang), [query, lang]);
  const hasQuery = query.trim().length > 0;

  useEffect(() => {
    const q = query.trim();
    if (q.length < 3) return;
    const timer = window.setTimeout(() => {
      track('search', { q, results: results.reduce((n, r) => n + r.items.length, 0) });
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [query, results]);

  function pickSuggestion(ingredient: string) {
    setQuery(ingredient);
    track('search', { q: ingredient, via: 'chip' });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="inverted fixed inset-0 z-40 flex flex-col bg-bg"
    >
      <div className="flex shrink-0 items-center gap-3 border-b border-border px-6 py-4">
        <MagnifyingGlass size={18} className="shrink-0 text-text-muted" />
        <input
          type="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="min-w-0 flex-1 bg-transparent text-base text-text placeholder:text-text-muted/60 focus:outline-none"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label={t.closeSearch}
          className="shrink-0 rounded-full p-2 text-text-muted active:scale-95"
        >
          <X size={20} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-28 pt-6">
        {!hasQuery ? (
          <>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-gold">{t.tryWith}</p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {t.suggestions.map((ingredient) => (
                <button
                  key={ingredient}
                  type="button"
                  onClick={() => pickSuggestion(ingredient)}
                  className="rounded-full border border-border px-4 py-2 text-[13px] font-medium text-text transition active:scale-95"
                >
                  {ingredient}
                </button>
              ))}
            </div>
          </>
        ) : results.length === 0 ? (
          <p className="py-10 text-center text-sm text-text-muted">{t.noResults(query.trim())}</p>
        ) : (
          results.map((result) => (
            <div key={result.category.id} className="mb-6">
              <p className="border-b border-border pb-2 text-[11px] font-medium uppercase tracking-[0.3em] text-gold">
                {localizeCategoryName(result.category, lang)}
              </p>
              <div>
                {result.items.map((item) => (
                  <DishRow key={item.id} item={item} selectionKey={`${result.category.id}:${item.id}`} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
