import { beforeEach, describe, expect, it } from 'vitest';
import { markFirstSeen, markPrompted, shouldPrompt } from './reviewPrompt';

const MIN = 60_000;

function fakeStorage(): Storage {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
  } as Storage;
}

beforeEach(() => {
  (globalThis as { localStorage?: Storage }).localStorage = fakeStorage();
});

describe('shouldPrompt', () => {
  it('is false before 35 minutes', () => {
    markFirstSeen(0);
    expect(shouldPrompt(34 * MIN)).toBe(false);
  });

  it('is true after 35 minutes, and only once', () => {
    markFirstSeen(0);
    expect(shouldPrompt(36 * MIN)).toBe(true);
    markPrompted(36 * MIN);
    expect(shouldPrompt(37 * MIN)).toBe(false);
  });

  it('is false with no visit recorded', () => {
    expect(shouldPrompt(36 * MIN)).toBe(false);
  });

  it('visit expires after 2h and everything resets', () => {
    markFirstSeen(0);
    markPrompted(40 * MIN);
    const nextVisit = 3 * 60 * MIN;
    expect(shouldPrompt(nextVisit)).toBe(false);
    markFirstSeen(nextVisit);
    expect(shouldPrompt(nextVisit + 36 * MIN)).toBe(true);
  });

  it('markFirstSeen never renews an existing visit (fixed TTL, not sliding)', () => {
    markFirstSeen(0);
    markFirstSeen(30 * MIN);
    expect(shouldPrompt(36 * MIN)).toBe(true);
  });

  it('degrades to never-prompt when localStorage is unavailable', () => {
    (globalThis as { localStorage?: Storage }).localStorage = undefined as unknown as Storage;
    markFirstSeen(0);
    expect(shouldPrompt(36 * MIN)).toBe(false);
  });

});
