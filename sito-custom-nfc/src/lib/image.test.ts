import { describe, expect, it } from 'vitest';
import { targetSize } from './image';

describe('targetSize', () => {
  it('sotto il massimo non tocca nulla', () => {
    expect(targetSize(800, 600, 1000)).toEqual([800, 600]);
  });
  it('riduce il lato lungo a max mantenendo le proporzioni', () => {
    expect(targetSize(2000, 1000, 1000)).toEqual([1000, 500]);
    expect(targetSize(1000, 4000, 1000)).toEqual([250, 1000]);
  });
});
