import { menu, type MenuCategory, type MenuItem, type Pairing } from '../data/menu';

export interface SelectionEntry {
  key: string;
  item: MenuItem;
  category: MenuCategory;
}

export function resolveSelection(keys: Set<string>): SelectionEntry[] {
  const entries: SelectionEntry[] = [];
  for (const category of menu) {
    for (const item of category.items) {
      const key = `${category.id}:${item.id}`;
      if (keys.has(key)) entries.push({ key, item, category });
    }
  }
  return entries;
}

export interface PairingGroup {
  pairing: Pairing;
  count: number;
  dishes: MenuItem[];
  keys: string[];
}

export function groupPairings(entries: SelectionEntry[]): PairingGroup[] {
  const groups = new Map<string, PairingGroup>();
  for (const { key, item } of entries) {
    if (!item.pairing) continue;
    const existing = groups.get(item.pairing.label);
    if (existing) {
      existing.count += 1;
      existing.dishes.push(item);
      existing.keys.push(key);
    } else {
      groups.set(item.pairing.label, { pairing: item.pairing, count: 1, dishes: [item], keys: [key] });
    }
  }
  return [...groups.values()].sort((a, b) => b.count - a.count);
}
