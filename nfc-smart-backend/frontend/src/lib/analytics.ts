export type EventType = 'search' | 'select_add' | 'call_waiter' | 'wifi_open' | 'review_click' | 'lang';

export function track(type: EventType, payload: Record<string, unknown> = {}) {
  try {
    const id = window.__RESTAURANT__?.id;
    if (!id || id === 'test-mock') return;
    const body = JSON.stringify({ restaurant_id: id, type, payload });
    const sent = navigator.sendBeacon?.('/api/event', new Blob([body], { type: 'application/json' }));
    if (!sent) {
      fetch('/api/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
  }
}
