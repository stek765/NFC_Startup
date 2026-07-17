import { describe, expect, it } from 'vitest';
import { computePrice } from './price';
import { DEFAULT_CONFIG } from '../catalog';

describe('computePrice', () => {
  it('config di default: base 24 + QR 4 = 28', () => {
    expect(computePrice(DEFAULT_CONFIG)).toBe(28);
  });

  it('senza QR resta la sola base', () => {
    expect(computePrice({ ...DEFAULT_CONFIG, qr: false })).toBe(24);
  });

  it('somma i delta di taglia e colore', () => {
    expect(computePrice({ ...DEFAULT_CONFIG, size: 'l', baseColor: 'crema' })).toBe(24 + 12 + 3 + 4);
  });

  it('il logo aggiunge il suo delta', () => {
    expect(computePrice({ ...DEFAULT_CONFIG, logo: 'data:image/png;base64,xxx' })).toBe(28 + 7);
  });

  it('forma ad arco parte dalla sua base', () => {
    expect(computePrice({ ...DEFAULT_CONFIG, shape: 'arco', qr: false })).toBe(29);
  });

  it('id sconosciuto: errore esplicito', () => {
    expect(() => computePrice({ ...DEFAULT_CONFIG, baseColor: 'viola' })).toThrow();
  });
});
