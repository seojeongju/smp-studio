import type { Env } from '../../../types';
import { isErrorResponse, json, requireAdmin } from '../../../lib/auth';
import type { PortfolioRow } from '../portfolios';

async function deleteR2IfNeeded(env: Env, url: string | null | undefined) {
  if (!url || !url.startsWith('/api/images/')) return;
  const key = url.replace('/api/images/', '');
  await env.MEDIA_BUCKET.delete(key);
}

/**
 * PUT /api/admin/portfolios/:id
 * DELETE /api/admin/portfolios/:id
 */
export const onRequestPut: PagesFunction<Env> = async (context) => {
  const auth = await requireAdmin(context.request, context.env);
  if (isErrorResponse(auth)) return auth;

  const id = context.params.id as string;
  if (!id) return json({ error: 'ID가 필요합니다.' }, 400);

  try {
    const existing = await context.env.DB.prepare(
      'SELECT * FROM portfolios WHERE id = ?'
    )
      .bind(id)
      .first<PortfolioRow>();

    if (!existing) return json({ error: '포트폴리오를 찾을 수 없습니다.' }, 404);

    const body = await context.request.json<Partial<PortfolioRow>>();
    const title = body.title?.trim();
    const category = body.category?.trim();
    const beforeUrl = body.before_url?.trim();
    const afterUrl = body.after_url?.trim();

    if (!title || !category || !beforeUrl || !afterUrl) {
      return json({ error: '제목, 카테고리, 전·후 사진은 필수입니다.' }, 400);
    }

    await context.env.DB.prepare(
      `UPDATE portfolios SET
        title = ?, category = ?, before_url = ?, after_url = ?,
        duration = ?, point = ?, image_aspect_ratio = ?,
        sort_order = ?, is_published = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    )
      .bind(
        title,
        category,
        beforeUrl,
        afterUrl,
        body.duration?.trim() || null,
        body.point?.trim() || null,
        body.image_aspect_ratio?.trim() || null,
        Number(body.sort_order) || 0,
        body.is_published === 0 ? 0 : 1,
        id
      )
      .run();

    return json({ success: true });
  } catch (error: any) {
    return json({ error: '포트폴리오 수정에 실패했습니다.', details: error.message }, 500);
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const auth = await requireAdmin(context.request, context.env);
  if (isErrorResponse(auth)) return auth;

  const id = context.params.id as string;
  if (!id) return json({ error: 'ID가 필요합니다.' }, 400);

  try {
    const existing = await context.env.DB.prepare(
      'SELECT * FROM portfolios WHERE id = ?'
    )
      .bind(id)
      .first<PortfolioRow>();

    if (!existing) return json({ error: '포트폴리오를 찾을 수 없습니다.' }, 404);

    await context.env.DB.prepare('DELETE FROM portfolios WHERE id = ?').bind(id).run();

    await Promise.all([
      deleteR2IfNeeded(context.env, existing.before_url),
      deleteR2IfNeeded(context.env, existing.after_url),
    ]);

    return json({ success: true });
  } catch (error: any) {
    return json({ error: '포트폴리오 삭제에 실패했습니다.', details: error.message }, 500);
  }
};
