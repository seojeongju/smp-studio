import type { Env } from '../../types';
import { isErrorResponse, json, requireAdmin } from '../../lib/auth';

export interface PortfolioRow {
  id: string;
  title: string;
  category: string;
  before_url: string;
  after_url: string;
  duration: string | null;
  point: string | null;
  image_aspect_ratio: string | null;
  sort_order: number;
  is_published: number;
  created_at: string;
  updated_at: string;
}

/**
 * GET /api/admin/portfolios — 전체 (비공개 포함)
 * POST /api/admin/portfolios — 생성
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const auth = await requireAdmin(context.request, context.env);
  if (isErrorResponse(auth)) return auth;

  try {
    const { results } = await context.env.DB.prepare(
      `SELECT * FROM portfolios ORDER BY sort_order ASC, created_at DESC`
    ).all<PortfolioRow>();

    return json({ success: true, portfolios: results || [] });
  } catch (error: any) {
    return json({ error: '포트폴리오를 불러오지 못했습니다.', details: error.message }, 500);
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const auth = await requireAdmin(context.request, context.env);
  if (isErrorResponse(auth)) return auth;

  try {
    const body = await context.request.json<Partial<PortfolioRow>>();
    const title = body.title?.trim();
    const category = body.category?.trim();
    const beforeUrl = body.before_url?.trim();
    const afterUrl = body.after_url?.trim();

    if (!title || !category || !beforeUrl || !afterUrl) {
      return json({ error: '제목, 카테고리, 전·후 사진은 필수입니다.' }, 400);
    }

    const id = crypto.randomUUID();
    await context.env.DB.prepare(
      `INSERT INTO portfolios
        (id, title, category, before_url, after_url, duration, point, image_aspect_ratio, sort_order, is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        id,
        title,
        category,
        beforeUrl,
        afterUrl,
        body.duration?.trim() || null,
        body.point?.trim() || null,
        body.image_aspect_ratio?.trim() || null,
        Number(body.sort_order) || 0,
        body.is_published === 0 ? 0 : 1
      )
      .run();

    return json({ success: true, id }, 201);
  } catch (error: any) {
    return json({ error: '포트폴리오 등록에 실패했습니다.', details: error.message }, 500);
  }
};
