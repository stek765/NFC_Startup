import { describe, expect, it } from 'vitest';
import { drinkInfo } from '../data/drinkInfo';
import { drinkL10n, localizeDrinkDescription } from './menu.i18n';

describe('localizeDrinkDescription', () => {
  it('returns the italian description for lang "it"', () => {
    const info = drinkInfo['Verdicchio'];
    expect(localizeDrinkDescription(info, 'it')).toBe(info.description);
  });

  it('returns the english translation for lang "en"', () => {
    const info = drinkInfo['Verdicchio'];
    expect(localizeDrinkDescription(info, 'en')).toBe(drinkL10n['Verdicchio'].en);
  });

  it('falls back to the italian description if a translation is missing', () => {
    const info = { label: 'Not Translated', image: '', description: 'testo italiano' };
    expect(localizeDrinkDescription(info, 'de')).toBe('testo italiano');
  });

  it('has an en/de translation for every drinkInfo entry', () => {
    for (const label of Object.keys(drinkInfo)) {
      expect(drinkL10n[label], `missing drinkL10n for "${label}"`).toBeDefined();
    }
  });
});
