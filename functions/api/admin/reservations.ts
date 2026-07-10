import type { Env } from '../../types';
import { isErrorResponse, json, requireAdmin } from '../../lib/auth';

export interface ReservationRow {
  id: string;
  client_name: string;
  phone: string;
  service_type: string;
  preferred_date: string;
  preferred_time: string;
  has_previous_tattoo: number;
  note: string | null;
  status: string;
  created_at: string;
}

/**
 * GET /api/admin/reservations — 상담 신청 목록
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const auth = await requireAdmin(context.request, context.env);
  if (isErrorResponse(auth)) return auth;

  try {
    const url = new URL(context.request.url);
    const status = url.searchParams.get('status') || 'all';
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50', 10), 100);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    let query = `SELECT * FROM reservations`;
    const params: Array<string | number> = [];

    if (status !== 'all') {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const { results } = await context.env.DB.prepare(query)
      .bind(...params)
      .all<ReservationRow>();

    return json({ success: true, reservations: results || [] });
  } catch (error: any) {
    return json({ error: '상담 신청을 불러오지 못했습니다.', details: error.message }, 500);
  }
};
