import type { PlaqueConfig } from '../types';

export interface QuotePayload {
  restaurant_name: string;
  contact: string;
  notes: string;
  config: PlaqueConfig;
  price: number;
  logo: string | null;
}

// In produzione frontend e Worker vivono nello stesso Worker dedicato (same-origin → '').
// In dev il Worker gira a parte su :8788 (npm run dev:worker).
export const API_BASE: string =
  import.meta.env.VITE_API_BASE ?? (import.meta.env.DEV ? 'http://localhost:8788' : '');

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
