const FIRST_SEEN_KEY = 'nfc-review-first-seen';
const PROMPTED_KEY = 'nfc-review-prompted';

const VISIT_TTL_MS = 2 * 60 * 60 * 1000;
const PROMPT_AFTER_MS = 35 * 60 * 1000;

function read(key: string): number | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const t = Number(raw);
    return Number.isFinite(t) ? t : null;
  } catch {
    return null;
  }
}

function write(key: string, value: number): void {
  try {
    localStorage.setItem(key, String(value));
  } catch {
  }
}

function remove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
  }
}

function firstSeen(now: number): number | null {
  const t = read(FIRST_SEEN_KEY);
  if (t === null) return null;
  if (now - t > VISIT_TTL_MS) {
    remove(FIRST_SEEN_KEY);
    remove(PROMPTED_KEY);
    return null;
  }
  return t;
}

export function markFirstSeen(now = Date.now()): void {
  if (firstSeen(now) === null) write(FIRST_SEEN_KEY, now);
}

export function markPrompted(now = Date.now()): void {
  write(PROMPTED_KEY, now);
}

export function shouldPrompt(now = Date.now()): boolean {
  const t = firstSeen(now);
  if (t === null) return false;
  if (read(PROMPTED_KEY) !== null) return false;
  return now - t >= PROMPT_AFTER_MS;
}
