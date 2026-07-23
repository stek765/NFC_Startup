import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import type { MenuCategory } from '../data/menu';

interface Category {
  id: string;
  name: string;
  group: MenuCategory['group'];
}

interface GroupRun {
  group: MenuCategory['group'];
  items: Category[];
}

function groupRuns(categories: Category[]): GroupRun[] {
  const runs: GroupRun[] = [];
  for (const category of categories) {
    const last = runs[runs.length - 1];
    if (last && last.group === category.group) last.items.push(category);
    else runs.push({ group: category.group, items: [category] });
  }
  return runs;
}

// Only the pizze group gets a background block for now — a flat cut of the
// wine accent, full-bleed with the tab bar's own top/bottom edges (no
// radius, no border of its own). Extend this map if other groups want it.
const GROUP_WASH: Partial<Record<MenuCategory['group'], boolean>> = {
  pizze: true,
};

export function CategoryTabs({
  categories,
  activeId,
  onSelect,
}: {
  categories: Category[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const container = containerRef.current;
    const button = buttonRefs.current[activeId];
    if (!container || !button) return;
    container.scrollTo({
      left: button.offsetLeft - container.clientWidth / 2 + button.clientWidth / 2,
      behavior: 'smooth',
    });
  }, [activeId]);

  const runs = groupRuns(categories);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="flex gap-7 overflow-x-auto overscroll-x-contain px-6 py-4"
        style={{
          maskImage: 'linear-gradient(to right, black calc(100% - 18px), transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, black calc(100% - 18px), transparent 100%)',
        }}
      >
        {runs.map((run, ri) => {
          const wash = GROUP_WASH[run.group];
          return (
            <div
              key={ri}
              className={`flex shrink-0 items-center gap-7 ${
                wash ? '-my-4 border-x-2 border-gold bg-wine px-4 py-4' : ''
              }`}
            >
              {run.items.map((category) => {
                const isActive = category.id === activeId;
                return (
                  <button
                    key={category.id}
                    ref={(el) => {
                      buttonRefs.current[category.id] = el;
                    }}
                    type="button"
                    onClick={() => onSelect(category.id)}
                    className="relative shrink-0 pb-2 text-[13px] font-medium uppercase tracking-[0.18em] transition-colors"
                  >
                    <span
                      className={
                        wash
                          ? isActive
                            ? 'text-bg'
                            : 'text-bg/55'
                          : isActive
                            ? 'text-text'
                            : 'text-text-muted'
                      }
                    >
                      {category.name}
                    </span>
                    {isActive && (
                      <motion.span
                        layoutId="active-tab"
                        className="absolute inset-x-0 bottom-0 h-[2px] bg-gold"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
