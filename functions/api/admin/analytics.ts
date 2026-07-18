import type { Env } from '../../types';
import { isErrorResponse, json, requireAdmin } from '../../lib/auth';

interface AnalyticsRow {
  day: string;
  event_type: string;
  event_key: string;
  count: number;
}

function kstDay(date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function daysAgoKst(n: number): string {
  const now = new Date();
  // KST 기준 자정에서 n일 전
  const kstNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
  kstNow.setDate(kstNow.getDate() - n);
  const y = kstNow.getFullYear();
  const m = String(kstNow.getMonth() + 1).padStart(2, '0');
  const d = String(kstNow.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * GET /api/admin/analytics?days=14 — 관리자 접속 요약
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const auth = await requireAdmin(context.request, context.env);
  if (isErrorResponse(auth)) return auth;

  try {
    const url = new URL(context.request.url);
    const days = Math.min(Math.max(parseInt(url.searchParams.get('days') || '14', 10) || 14, 1), 90);
    const from = daysAgoKst(days - 1);
    const today = kstDay();

    const { results } = await context.env.DB.prepare(
      `SELECT day, event_type, event_key, count
       FROM site_analytics_daily
       WHERE day >= ?
       ORDER BY day ASC`,
    )
      .bind(from)
      .all<AnalyticsRow>();

    const rows = results || [];

    const visitsByDayMap = new Map<string, number>();
    for (let i = days - 1; i >= 0; i -= 1) {
      visitsByDayMap.set(daysAgoKst(i), 0);
    }

    const tabs = new Map<string, number>();
    const ctas = new Map<string, number>();
    const devices = new Map<string, number>();
    let todayVisits = 0;

    for (const row of rows) {
      if (row.event_type === 'visit') {
        visitsByDayMap.set(row.day, (visitsByDayMap.get(row.day) || 0) + row.count);
        if (row.day === today) todayVisits += row.count;
      } else if (row.event_type === 'tab') {
        tabs.set(row.event_key, (tabs.get(row.event_key) || 0) + row.count);
      } else if (row.event_type === 'cta') {
        ctas.set(row.event_key, (ctas.get(row.event_key) || 0) + row.count);
      } else if (row.event_type === 'device') {
        devices.set(row.event_key, (devices.get(row.event_key) || 0) + row.count);
      }
    }

    const sortDesc = (map: Map<string, number>) =>
      [...map.entries()]
        .map(([key, count]) => ({ key, count }))
        .sort((a, b) => b.count - a.count);

    const visitsByDay = [...visitsByDayMap.entries()].map(([day, count]) => ({ day, count }));
    const periodVisits = visitsByDay.reduce((sum, row) => sum + row.count, 0);

    return json({
      success: true,
      from,
      to: today,
      days,
      todayVisits,
      periodVisits,
      visitsByDay,
      tabs: sortDesc(tabs),
      ctas: sortDesc(ctas),
      devices: sortDesc(devices),
    });
  } catch (error: any) {
    return json({ error: '접속 현황을 불러오지 못했습니다.', details: error.message }, 500);
  }
};
