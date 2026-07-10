import type { Env } from '../../../types';
import { isErrorResponse, json, requireAdmin } from '../../../lib/auth';

/**
 * PUT /api/admin/reviews/:id — 숨김/공개 토글 { is_hidden: 0|1 }
 * DELETE /api/admin/reviews/:id — 관리자 강제 삭제
 */
export const onRequestPut: PagesFunction<Env> = async (context) => {
  const auth = await requireAdmin(context.request, context.env);
  if (isErrorResponse(auth)) return auth;

  const id = context.params.id as string;
  if (!id) return json({ error: 'ID가 필요합니다.' }, 400);

  try {
    const body = await context.request.json<{ is_hidden?: number | boolean }>();
    const isHidden = body.is_hidden === true || body.is_hidden === 1 ? 1 : 0;

    const existing = await context.env.DB.prepare(
      'SELECT id FROM reviews WHERE id = ?'
    )
      .bind(id)
      .first();

    if (!existing) return json({ error: '후기를 찾을 수 없습니다.' }, 404);

    await context.env.DB.prepare(
      'UPDATE reviews SET is_hidden = ? WHERE id = ?'
    )
      .bind(isHidden, id)
      .run();

    return json({ success: true, is_hidden: isHidden });
  } catch (error: any) {
    return json({ error: '후기 상태 변경에 실패했습니다.', details: error.message }, 500);
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const auth = await requireAdmin(context.request, context.env);
  if (isErrorResponse(auth)) return auth;

  const id = context.params.id as string;
  if (!id) return json({ error: 'ID가 필요합니다.' }, 400);

  try {
    const review = await context.env.DB.prepare(
      'SELECT id, image_url_1, image_url_2 FROM reviews WHERE id = ?'
    )
      .bind(id)
      .first<{ id: string; image_url_1: string | null; image_url_2: string | null }>();

    if (!review) return json({ error: '후기를 찾을 수 없습니다.' }, 404);

    await context.env.DB.prepare('DELETE FROM reviews WHERE id = ?').bind(id).run();

    const deletes: Promise<unknown>[] = [];
    if (review.image_url_1?.startsWith('/api/images/')) {
      deletes.push(context.env.MEDIA_BUCKET.delete(review.image_url_1.replace('/api/images/', '')));
    }
    if (review.image_url_2?.startsWith('/api/images/')) {
      deletes.push(context.env.MEDIA_BUCKET.delete(review.image_url_2.replace('/api/images/', '')));
    }
    if (deletes.length) await Promise.all(deletes);

    return json({ success: true });
  } catch (error: any) {
    return json({ error: '후기 삭제에 실패했습니다.', details: error.message }, 500);
  }
};
