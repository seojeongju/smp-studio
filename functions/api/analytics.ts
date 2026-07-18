import type { Env } from '../types';
import { json } from '../lib/auth';

const ALLOWED: Record<string, Set<string>> = {
  visit: new Set(['session']),
  device: new Set(['mobile', 'desktop']),
  tab: new Set([
    'home',
    'gallery',
    'portfolio',
    'reviews',
    'services',
    'care',
    'location',
    'profile',
  ]),
  cta: new Set(['talk', 'consulting', 'booking']),
};

function kstDay(date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

type IncomingEvent = { type?: string; key?: string };

/**
 * POST /api/analytics — 공개 집계 수집 (IP·식별자 저장 안 함)
 */
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    let body: { events?: IncomingEvent[]; type?: string; key?: string };
    try {
      body = await context.request.json();
    } catch {
      return json({ error: '잘못된 요청입니다.' }, 400);
    }

    const raw: IncomingEvent[] = Array.isArray(body.events)
      ? body.events
      : body.type
        ? [{ type: body.type, key: body.key }]
        : [];

    if (!raw.length || raw.length > 20) {
      return json({ error: '이벤트 개수가 올바르지 않습니다.' }, 400);
    }

    const day = kstDay();
    const stmts: D1PreparedStatement[] = [];

    for (const item of raw) {
      const type = String(item.type || '').trim();
      const key = String(item.key || '').trim();
      const allowedKeys = ALLOWED[type];
      if (!allowedKeys || !allowedKeys.has(key)) continue;

      stmts.push(
        context.env.DB.prepare(
          `INSERT INTO site_analytics_daily (day, event_type, event_key, count)
           VALUES (?, ?, ?, 1)
           ON CONFLICT(day, event_type, event_key)
           DO UPDATE SET count = count + 1`,
        ).bind(day, type, key),
      );
    }

    if (!stmts.length) {
      return json({ success: true, accepted: 0 });
    }

    await context.env.DB.batch(stmts);
    return json({ success: true, accepted: stmts.length });
  } catch (error: any) {
    return json({ error: '집계 저장에 실패했습니다.', details: error.message }, 500);
  }
};
