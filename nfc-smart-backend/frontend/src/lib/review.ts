import type { Restaurant } from '../types';

export function reviewUrl(restaurant: Restaurant): string | null {
  if (!restaurant.google_place_id) return null;
  return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(restaurant.google_place_id)}`;
}
