import type { Env } from '../../types';
import { isErrorResponse, json, requireAdmin } from '../../lib/auth';

export interface AdminReviewRow {
  id: string;
  name: string;
  rating: number;
  category: string;
  comment: string;
  image_url_1: string | null;
  image_url_2: string | null;
  is_hidden: number;
  created_at: string;
}

/**
 * GET /api/admin/reviews — 전체 후기 (숨김 포함)
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const auth = await requireAdmin(context.request, context.env);
  if (isErrorResponse(auth)) return auth;

  try {
    const url = new URL(context.request.url);
    const filter = url.searchParams.get('filter') || 'all'; // all | visible | hidden
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50', 10), 100);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    let query = `
      SELECT id, name, rating, category, comment, image_url_1, image_url_2,
             COALESCE(is_hidden, 0) as is_hidden, created_at
      FROM reviews
    `;
    const params: number[] = [];

    if (filter === 'visible') {
      query += ' WHERE COALESCE(is_hidden, 0) = 0';
    } else if (filter === 'hidden') {
      query += ' WHERE COALESCE(is_hidden, 0) = 1';
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const { results } = await context.env.DB.prepare(query)
      .bind(...params)
      .all<AdminReviewRow>();

    return json({ success: true, reviews: results || [] });
  } catch (error: any) {
    return json({ error: '후기를 불러오지 못했습니다.', details: error.message }, 500);
  }
};
