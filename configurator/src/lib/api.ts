import type { PlaqueConfig } from '../types';

export interface QuotePayload {
  restaurant_name: string;
  contact: string;
  notes: string;
  config: PlaqueConfig;
  price: number;
  logo: string | null;
}

export const API_BASE: string = import.meta.env.VITE_API_BASE ?? 'http://localhost:8787';

export async function submitQuote(_payload: QuotePayload): Promise<boolean> {
  // Task 9 sostituisce questo stub con la POST reale a `${API_BASE}/api/quote`
  await new Promise((r) => setTimeout(r, 600));
  return true;
}
