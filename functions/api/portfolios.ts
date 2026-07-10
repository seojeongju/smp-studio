import type { Env } from '../types';
import { json } from '../lib/auth';
import type { PortfolioRow } from './admin/portfolios';

/**
 * GET /api/portfolios — 공개 포트폴리오
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const category = url.searchParams.get('category') || '';

    let query = `
      SELECT id, title, category, before_url, after_url, duration, point, image_aspect_ratio, sort_order
      FROM portfolios
      WHERE is_published = 1
    `;
    const params: string[] = [];

    if (category && category !== '전체') {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY sort_order ASC, created_at DESC';

    const stmt = context.env.DB.prepare(query);
    const { results } = params.length
      ? await stmt.bind(...params).all<PortfolioRow>()
      : await stmt.all<PortfolioRow>();

    return json({ success: true, portfolios: results || [] });
  } catch (error: any) {
    return json({ error: '포트폴리오를 불러오지 못했습니다.', details: error.message }, 500);
  }
};
