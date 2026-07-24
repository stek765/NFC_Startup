import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import type { MenuCategory } from '../data/menu';

interface Category {
  id: string;
  name: string;
  group: MenuCategory['group'];
}

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
        {categories.map((category) => {
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
              <span className={isActive ? 'text-text' : 'text-text-muted'}>{category.name}</span>
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
    </div>
  );
}
