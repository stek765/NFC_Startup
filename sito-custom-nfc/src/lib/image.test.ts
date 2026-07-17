import { describe, expect, it } from 'vitest';
import { alphaFromLuminance, hasTransparency, targetSize } from './image';

describe('targetSize', () => {
  it('sotto il massimo non tocca nulla', () => {
    expect(targetSize(800, 600, 1000)).toEqual([800, 600]);
  });
  it('riduce il lato lungo a max mantenendo le proporzioni', () => {
    expect(targetSize(2000, 1000, 1000)).toEqual([1000, 500]);
    expect(targetSize(1000, 4000, 1000)).toEqual([250, 1000]);
  });
});

// un "pixel" = [r, g, b, a]
const px = (...pixels: number[][]) => new Uint8ClampedArray(pixels.flat());

describe('hasTransparency', () => {
  it('vede l\'alpha sotto 250', () => {
    expect(hasTransparency(px([0, 0, 0, 255], [10, 10, 10, 100]))).toBe(true);
  });
  it('immagine tutta opaca → false', () => {
    expect(hasTransparency(px([255, 255, 255, 255], [0, 0, 0, 255]))).toBe(false);
  });
});

describe('alphaFromLuminance', () => {
  it('bianco (sfondo) → trasparente, nero (tratto) → opaco', () => {
    const data = px([255, 255, 255, 255], [0, 0, 0, 255]);
    alphaFromLuminance(data);
    expect(data[3]).toBe(0); // bianco
    expect(data[7]).toBe(255); // nero
  });
  it('grigio medio → alpha intermedio (rampa morbida, niente bordo seghettato)', () => {
    const data = px([180, 180, 180, 255]); // lum ≈ 0.706
    alphaFromLuminance(data);
    expect(data[3]).toBeGreaterThan(0);
    expect(data[3]).toBeLessThan(255);
  });
});
