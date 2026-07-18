import type { Env } from '../../types';
import { isErrorResponse, json, requireAdmin } from '../../lib/auth';

interface AnalyticsRow {
  day: string;
  event_type: string;
  event_key: string;
  count: number;
}

type RangeMode = 'week' | 'weekly' | 'month';
type BucketMode = 'day' | 'week' | 'month';

function getKstNow(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
}

function formatYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function addDays(d: Date, n: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}

function parseYmd(day: string): Date {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function startOfWeekMonday(d: Date): Date {
  const next = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dow = next.getDay();
  const diff = dow === 0 ? -6 : 1 - dow;
  next.setDate(next.getDate() + diff);
  return next;
}

function weekKeyFromDay(day: string): string {
  return formatYmd(startOfWeekMonday(parseYmd(day)));
}

function weekLabel(monday: string): string {
  const start = parseYmd(monday);
  const end = addDays(start, 6);
  const fmt = (d: Date) =>
    `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
  return `${fmt(start)}~${fmt(end)}`;
}

function monthKeyFromDay(day: string): string {
  return day.slice(0, 7);
}

function monthLabel(ym: string): string {
  const [y, m] = ym.split('-');
  return `${y}.${m}`;
}

function dayLabel(day: string): string {
  return day.slice(5);
}

function parseRange(raw: string | null): RangeMode {
  if (raw === 'weekly' || raw === 'month') return raw;
  return 'week';
}

function rangeLookback(range: RangeMode): { from: string; to: string; bucket: BucketMode } {
  const today = getKstNow();
  const to = formatYmd(today);

  if (range === 'week') {
    return { from: formatYmd(addDays(today, -6)), to, bucket: 'day' };
  }

  if (range === 'weekly') {
    const thisMonday = startOfWeekMonday(today);
    const firstMonday = addDays(thisMonday, -7 * 11); // 12주
    return { from: formatYmd(firstMonday), to, bucket: 'week' };
  }

  const firstOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const firstOfStart = new Date(firstOfThisMonth.getFullYear(), firstOfThisMonth.getMonth() - 11, 1);
  return { from: formatYmd(firstOfStart), to, bucket: 'month' };
}

function buildEmptySeries(
  range: RangeMode,
  from: string,
  to: string,
): Array<{ key: string; label: string; count: number }> {
  const series: Array<{ key: string; label: string; count: number }> = [];

  if (range === 'week') {
    let cursor = parseYmd(from);
    const end = parseYmd(to);
    while (cursor <= end) {
      const key = formatYmd(cursor);
      series.push({ key, label: dayLabel(key), count: 0 });
      cursor = addDays(cursor, 1);
    }
    return series;
  }

  if (range === 'weekly') {
    let cursor = startOfWeekMonday(parseYmd(from));
    const endMonday = startOfWeekMonday(parseYmd(to));
    while (cursor <= endMonday) {
      const key = formatYmd(cursor);
      series.push({ key, label: weekLabel(key), count: 0 });
      cursor = addDays(cursor, 7);
    }
    return series;
  }

  let cursor = parseYmd(`${from.slice(0, 7)}-01`);
  const end = parseYmd(`${to.slice(0, 7)}-01`);
  while (cursor <= end) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`;
    series.push({ key, label: monthLabel(key), count: 0 });
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }
  return series;
}

function bucketKey(day: string, bucket: BucketMode): string {
  if (bucket === 'week') return weekKeyFromDay(day);
  if (bucket === 'month') return monthKeyFromDay(day);
  return day;
}

/**
 * GET /api/admin/analytics?range=week|weekly|month
 * - week: 최근 7일(일별)
 * - weekly: 최근 12주(주별)
 * - month: 최근 12개월(월별)
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const auth = await requireAdmin(context.request, context.env);
  if (isErrorResponse(auth)) return auth;

  try {
    const url = new URL(context.request.url);
    const range = parseRange(url.searchParams.get('range'));
    const { from, to, bucket } = rangeLookback(range);
    const today = to;

    const { results } = await context.env.DB.prepare(
      `SELECT day, event_type, event_key, count
       FROM site_analytics_daily
       WHERE day >= ?
       ORDER BY day ASC`,
    )
      .bind(from)
      .all<AnalyticsRow>();

    const rows = results || [];
    const seriesMap = new Map(
      buildEmptySeries(range, from, to).map((item) => [item.key, item]),
    );

    const tabs = new Map<string, number>();
    const ctas = new Map<string, number>();
    const devices = new Map<string, number>();
    let todayVisits = 0;

    for (const row of rows) {
      if (row.event_type === 'visit') {
        const key = bucketKey(row.day, bucket);
        const slot = seriesMap.get(key);
        if (slot) slot.count += row.count;
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

    const series = [...seriesMap.values()];
    const periodVisits = series.reduce((sum, row) => sum + row.count, 0);

    const rangeLabel =
      range === 'week' ? '최근 7일' : range === 'weekly' ? '최근 12주' : '최근 12개월';
    const chartTitle =
      range === 'week' ? '일별 방문' : range === 'weekly' ? '주간 방문' : '월별 방문';

    return json({
      success: true,
      range,
      bucket,
      rangeLabel,
      chartTitle,
      from,
      to: today,
      todayVisits,
      periodVisits,
      series,
      // 하위 호환
      visitsByDay: series.map((s) => ({ day: s.key, count: s.count, label: s.label })),
      tabs: sortDesc(tabs),
      ctas: sortDesc(ctas),
      devices: sortDesc(devices),
    });
  } catch (error: any) {
    return json({ error: '접속 현황을 불러오지 못했습니다.', details: error.message }, 500);
  }
};
