import { describe, expect, it } from 'vitest';
import { menu } from './menu';
import { drinkInfo, getDrinkInfo } from './drinkInfo';

function allPairingLabels(): string[] {
  const labels = new Set<string>();
  for (const category of menu) {
    for (const item of category.items) {
      if (item.pairing) labels.add(item.pairing.label);
    }
  }
  return [...labels];
}

describe('drinkInfo', () => {
  it('has an entry for every pairing label used in the menu', () => {
    for (const label of allPairingLabels()) {
      expect(drinkInfo[label], `missing drinkInfo for "${label}"`).toBeDefined();
    }
  });

  it('every entry uses a w=1200 image variant', () => {
    for (const info of Object.values(drinkInfo)) {
      expect(info.image).toContain('w=1200');
    }
  });

  it('getDrinkInfo returns undefined for an unknown label', () => {
    expect(getDrinkInfo('Not A Real Drink')).toBeUndefined();
  });

  it('getDrinkInfo returns the matching record for a known label', () => {
    expect(getDrinkInfo('Verdicchio')?.label).toBe('Verdicchio');
  });
});
