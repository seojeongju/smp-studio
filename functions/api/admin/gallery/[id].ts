import type { Env } from '../../../types';
import { isErrorResponse, json, requireAdmin } from '../../../lib/auth';
import type { GalleryImageRow } from '../gallery';

async function deleteR2IfNeeded(env: Env, url: string | null | undefined) {
  if (!url || !url.startsWith('/api/images/')) return;
  const key = url.replace('/api/images/', '');
  await env.MEDIA_BUCKET.delete(key);
}

/**
 * PUT /api/admin/gallery/:id
 * DELETE /api/admin/gallery/:id
 */
export const onRequestPut: PagesFunction<Env> = async (context) => {
  const auth = await requireAdmin(context.request, context.env);
  if (isErrorResponse(auth)) return auth;

  const id = context.params.id as string;
  if (!id) return json({ error: 'ID가 필요합니다.' }, 400);

  try {
    const existing = await context.env.DB.prepare(
      'SELECT * FROM gallery_images WHERE id = ?'
    )
      .bind(id)
      .first<GalleryImageRow>();

    if (!existing) return json({ error: '갤러리 사진을 찾을 수 없습니다.' }, 404);

    const body = await context.request.json<Partial<GalleryImageRow>>();
    const category = body.category?.trim();
    const imageUrl = body.image_url?.trim();

    if (!category || !imageUrl) {
      return json({ error: '카테고리와 이미지는 필수입니다.' }, 400);
    }

    await context.env.DB.prepare(
      `UPDATE gallery_images SET
        title = ?, category = ?, image_url = ?, caption = ?,
        sort_order = ?, is_published = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    )
      .bind(
        body.title?.trim() || null,
        category,
        imageUrl,
        body.caption?.trim() || null,
        Number(body.sort_order) || 0,
        body.is_published === 0 ? 0 : 1,
        id
      )
      .run();

    return json({ success: true });
  } catch (error: any) {
    return json({ error: '갤러리 수정에 실패했습니다.', details: error.message }, 500);
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const auth = await requireAdmin(context.request, context.env);
  if (isErrorResponse(auth)) return auth;

  const id = context.params.id as string;
  if (!id) return json({ error: 'ID가 필요합니다.' }, 400);

  try {
    const existing = await context.env.DB.prepare(
      'SELECT * FROM gallery_images WHERE id = ?'
    )
      .bind(id)
      .first<GalleryImageRow>();

    if (!existing) return json({ error: '갤러리 사진을 찾을 수 없습니다.' }, 404);

    await context.env.DB.prepare('DELETE FROM gallery_images WHERE id = ?').bind(id).run();
    await deleteR2IfNeeded(context.env, existing.image_url);

    return json({ success: true });
  } catch (error: any) {
    return json({ error: '갤러리 삭제에 실패했습니다.', details: error.message }, 500);
  }
};
