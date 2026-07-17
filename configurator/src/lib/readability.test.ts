import { describe, expect, it } from 'vitest';
import { contrastRatio, isReadable } from './readability';

describe('leggibilità base × stampa', () => {
  it('nero su bianco è leggibile', () => {
    expect(isReadable('#f2f0ea', '#1e1e23')).toBe(true);
  });

  it('bianco su bianco non lo è', () => {
    expect(isReadable('#f2f0ea', '#f4f2ec')).toBe(false);
  });

  it('blu notte su targhetta nera non lo è (scuro su scuro)', () => {
    expect(isReadable('#26262b', '#2c3a54')).toBe(false);
  });

  it('bianco su terracotta è leggibile', () => {
    expect(isReadable('#bd5f3e', '#f4f2ec')).toBe(true);
  });

  it('il rapporto è simmetrico', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(contrastRatio('#ffffff', '#000000'));
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0);
  });
});
