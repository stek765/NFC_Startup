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

export async function submitQuote(payload: QuotePayload): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.status === 201;
  } catch {
    return false;
  }
}
