import { describe, expect, it } from 'vitest';
import { untakenPairingGroups, type SelectionEntry } from './pairing';
import type { MenuCategory, MenuItem, Pairing } from '../data/menu';

function makePairing(label: string): Pairing {
  return { label, note: 'note', image: 'img.jpg', price: 3 };
}

function makeEntry(id: string, categoryId: string, pairing?: Pairing): SelectionEntry {
  const item: MenuItem = { id, name: id, description: '', price: 10, pairing };
  const category: MenuCategory = { id: categoryId, name: categoryId, group: 'cucina', items: [item] };
  return { key: `${categoryId}:${id}`, item, category };
}

describe('untakenPairingGroups', () => {
  it('excludes a group once every dish sharing it is taken', () => {
    const a = makeEntry('a', 'cat', makePairing('Verdicchio'));
    const b = makeEntry('b', 'cat', makePairing('Verdicchio'));
    const taken = new Set([a.key, b.key]);
    const groups = untakenPairingGroups([a, b], (key) => taken.has(key));
    expect(groups).toHaveLength(0);
  });

  it('keeps a group with only the untaken dish once one of two sharing it is taken', () => {
    const a = makeEntry('a', 'cat', makePairing('Verdicchio'));
    const b = makeEntry('b', 'cat', makePairing('Verdicchio'));
    const taken = new Set([a.key]);
    const groups = untakenPairingGroups([a, b], (key) => taken.has(key));
    expect(groups).toHaveLength(1);
    expect(groups[0].keys).toEqual([b.key]);
  });

  it('ignores entries without a pairing', () => {
    const a = makeEntry('a', 'cat', undefined);
    const groups = untakenPairingGroups([a], () => false);
    expect(groups).toHaveLength(0);
  });
});
