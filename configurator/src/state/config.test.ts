import { describe, expect, it } from 'vitest';
import { applyBaseColor, sanitizeConfig } from './config';
import { DEFAULT_CONFIG } from '../catalog';

describe('sanitizeConfig', () => {
  it('input non valido → default', () => {
    expect(sanitizeConfig(null)).toEqual(DEFAULT_CONFIG);
    expect(sanitizeConfig('spazzatura')).toEqual(DEFAULT_CONFIG);
  });

  it('id sconosciuti → campo riportato al default, il resto sopravvive', () => {
    const out = sanitizeConfig({ ...DEFAULT_CONFIG, shape: 'stella', textTop: 'Ciao' });
    expect(out.shape).toBe(DEFAULT_CONFIG.shape);
    expect(out.textTop).toBe('Ciao');
  });

  it('testi troncati a MAX_TEXT_LEN', () => {
    const out = sanitizeConfig({ ...DEFAULT_CONFIG, textTop: 'x'.repeat(50) });
    expect(out.textTop).toHaveLength(18);
  });
});

describe('applyBaseColor', () => {
  it('se la stampa resta leggibile, non la cambia', () => {
    const out = applyBaseColor({ ...DEFAULT_CONFIG, printColor: 'nero' }, 'crema');
    expect(out.baseColor).toBe('crema');
    expect(out.printColor).toBe('nero');
  });

  it('base nera + stampa nera → stampa auto-cambiata alla prima leggibile', () => {
    const out = applyBaseColor({ ...DEFAULT_CONFIG, printColor: 'nero' }, 'nero');
    expect(out.baseColor).toBe('nero');
    expect(out.printColor).not.toBe('nero');
  });
});
