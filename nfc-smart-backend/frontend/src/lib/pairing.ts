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

export function untakenPairingGroups(
  entries: SelectionEntry[],
  isPaired: (key: string) => boolean,
): PairingGroup[] {
  return groupPairings(entries.filter((e) => !isPaired(e.key)));
}

export interface PairingTint {
  bg: string;
  text: string;
}

const DEFAULT_TINT: PairingTint = { bg: '#1c1a15', text: '#faf6ee' };

// Medium-depth washes of each drink's real color — enough body to read as
// "that glass" and not disappear into the ivory page, but stopping short of
// a solid, heavy paint block.
const PAIRING_TINTS: Record<string, PairingTint> = {
  Verdicchio: { bg: '#d3ba71', text: '#1c1a15' },
  'Cabernet Franc': { bg: '#96384a', text: '#f3eee1' },
  'Moretti la rossa': { bg: '#bd7830', text: '#1c1a15' },
  "Foster's": { bg: '#dfc06c', text: '#1c1a15' },
  'Ichnusa non filtrata': { bg: '#c19f4c', text: '#1c1a15' },
  'Birra scura': { bg: '#7a4a26', text: '#f3eee1' },
};

export function pairingTint(label: string): PairingTint {
  return PAIRING_TINTS[label] ?? DEFAULT_TINT;
}
