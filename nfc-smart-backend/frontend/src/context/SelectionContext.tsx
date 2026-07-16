import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { track } from '../lib/analytics';

const STORAGE_KEY = 'nfc-menu-selection';

const SELECTION_TTL_MS = 2 * 60 * 60 * 1000;

export interface DishMods {
  removed: string[];
  added: string[];
}

interface SelectionContextValue {
  selectedKeys: Set<string>;
  isPaired: (key: string) => boolean;
  togglePaired: (key: string) => void;
  toggle: (key: string) => void;
  isSelected: (key: string) => boolean;
  clear: () => void;
  count: number;
  lastAdded: { key: string; ts: number } | null;
  getMods: (key: string) => DishMods;
  setMods: (key: string, mods: DishMods) => void;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

const EMPTY_MODS: DishMods = { removed: [], added: [] };

interface Stored {
  keys: Set<string>;
  mods: Record<string, DishMods>;
  paired: Set<string>;
}

function readStorage(): Stored {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { keys: new Set(), mods: {}, paired: new Set() };
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return { keys: new Set(), mods: {}, paired: new Set() };
    if (typeof parsed?.at !== 'number' || Date.now() - parsed.at > SELECTION_TTL_MS) {
      return { keys: new Set(), mods: {}, paired: new Set() };
    }
    return { keys: new Set(parsed.keys), mods: parsed.mods ?? {}, paired: new Set(parsed.paired ?? []) };
  } catch {
    return { keys: new Set(), mods: {}, paired: new Set() };
  }
}

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<Stored>(readStorage);
  const [lastAdded, setLastAdded] = useState<{ key: string; ts: number } | null>(null);
  const selectedKeys = stored.keys;

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        at: Date.now(),
        keys: Array.from(stored.keys),
        mods: stored.mods,
        paired: Array.from(stored.paired),
      }),
    );
  }, [stored]);

  function toggle(key: string) {
    if (!selectedKeys.has(key)) {
      track('select_add', { item: key });
      setLastAdded({ key, ts: Date.now() });
    }
    setStored((prev) => {
      const keys = new Set(prev.keys);
      const mods = { ...prev.mods };
      const paired = new Set(prev.paired);
      if (keys.has(key)) {
        keys.delete(key);
        delete mods[key];
        paired.delete(key);
      } else {
        keys.add(key);
      }
      return { keys, mods, paired };
    });
  }

  function togglePaired(key: string) {
    setStored((prev) => {
      const paired = new Set(prev.paired);
      if (paired.has(key)) {
        paired.delete(key);
      } else {
        paired.add(key);
        track('select_add', { item: key, drink: true });
      }
      return { ...prev, paired };
    });
  }

  function setMods(key: string, next: DishMods) {
    const isEmpty = next.removed.length === 0 && next.added.length === 0;
    setStored((prev) => {
      const keys = new Set(prev.keys);
      const mods = { ...prev.mods };
      if (!keys.has(key)) {
        keys.add(key);
        track('select_add', { item: key });
        setLastAdded({ key, ts: Date.now() });
      }
      if (isEmpty) delete mods[key];
      else mods[key] = next;
      return { ...prev, keys, mods };
    });
  }

  function clear() {
    setStored({ keys: new Set(), mods: {}, paired: new Set() });
  }

  return (
    <SelectionContext.Provider
      value={{
        selectedKeys,
        toggle,
        isSelected: (key) => selectedKeys.has(key),
        clear,
        count: selectedKeys.size,
        lastAdded,
        getMods: (key) => stored.mods[key] ?? EMPTY_MODS,
        setMods,
        isPaired: (key) => stored.paired.has(key),
        togglePaired,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error('useSelection must be used within SelectionProvider');
  return ctx;
}
