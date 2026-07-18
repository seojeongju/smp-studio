type AnalyticsType = 'visit' | 'device' | 'tab' | 'cta';

interface AnalyticsEvent {
  type: AnalyticsType;
  key: string;
}

const SESSION_FLAG = 'grace_analytics_session_v1';
const queue: AnalyticsEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function enqueue(event: AnalyticsEvent) {
  if (typeof window === 'undefined') return;
  queue.push(event);
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flush();
  }, 400);
}

async function flush() {
  if (!queue.length) return;
  const events = queue.splice(0, queue.length);
  const payload = JSON.stringify({ events });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      const ok = navigator.sendBeacon('/api/analytics', blob);
      if (ok) return;
    }
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: payload,
      keepalive: true,
    });
  } catch {
    /* 집계 실패는 UX에 영향 없음 */
  }
}

/** 세션당 1회: 방문 + 기기 */
export function trackSessionVisit() {
  try {
    if (sessionStorage.getItem(SESSION_FLAG)) return;
    sessionStorage.setItem(SESSION_FLAG, '1');
  } catch {
    /* private mode 등 */
  }

  const mobile = window.matchMedia('(max-width: 768px)').matches;
  enqueue({ type: 'visit', key: 'session' });
  enqueue({ type: 'device', key: mobile ? 'mobile' : 'desktop' });
}

export function trackTabView(tab: string) {
  if (!tab || tab === 'admin') return;
  enqueue({ type: 'tab', key: tab });
}

export function trackCta(key: 'talk' | 'consulting' | 'booking') {
  enqueue({ type: 'cta', key });
}
