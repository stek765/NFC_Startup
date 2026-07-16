import { describe, expect, it } from 'vitest';
import { reviewUrl } from './review';
import type { Restaurant } from '../types';

const base: Restaurant = { id: 'r1', name: 'Notte Dì' };

describe('reviewUrl', () => {
  it('builds the writereview deep link from the place id', () => {
    expect(reviewUrl({ ...base, google_place_id: 'ChIJabc123' })).toBe(
      'https://search.google.com/local/writereview?placeid=ChIJabc123',
    );
  });

  it('URL-encodes the place id', () => {
    expect(reviewUrl({ ...base, google_place_id: 'a b' })).toBe(
      'https://search.google.com/local/writereview?placeid=a%20b',
    );
  });

  it('returns null without a place id — no Maps fallback', () => {
    expect(reviewUrl(base)).toBeNull();
    expect(reviewUrl({ ...base, google_place_id: null, google_maps_url: 'https://maps.google.com/x' })).toBeNull();
  });
});
