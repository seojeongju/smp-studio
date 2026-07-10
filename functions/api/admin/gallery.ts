import type { Env } from '../../types';
import { isErrorResponse, json, requireAdmin } from '../../lib/auth';

export interface GalleryImageRow {
  id: string;
  title: string | null;
  category: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  is_published: number;
  created_at: string;
  updated_at: string;
}

/**
 * GET /api/admin/gallery — 전체 (비공개 포함)
 * POST /api/admin/gallery — 생성
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const auth = await requireAdmin(context.request, context.env);
  if (isErrorResponse(auth)) return auth;

  try {
    const { results } = await context.env.DB.prepare(
      `SELECT * FROM gallery_images
       ORDER BY sort_order ASC, created_at DESC`
    ).all<GalleryImageRow>();

    return json({ success: true, images: results || [] });
  } catch (error: any) {
    return json({ error: '갤러리를 불러오지 못했습니다.', details: error.message }, 500);
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const auth = await requireAdmin(context.request, context.env);
  if (isErrorResponse(auth)) return auth;

  try {
    const body = await context.request.json<Partial<GalleryImageRow>>();
    const category = body.category?.trim();
    const imageUrl = body.image_url?.trim();

    if (!category || !imageUrl) {
      return json({ error: '카테고리와 이미지는 필수입니다.' }, 400);
    }

    const id = crypto.randomUUID();
    await context.env.DB.prepare(
      `INSERT INTO gallery_images
        (id, title, category, image_url, caption, sort_order, is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        id,
        body.title?.trim() || null,
        category,
        imageUrl,
        body.caption?.trim() || null,
        Number(body.sort_order) || 0,
        body.is_published === 0 ? 0 : 1
      )
      .run();

    return json({ success: true, id }, 201);
  } catch (error: any) {
    return json({ error: '갤러리 등록에 실패했습니다.', details: error.message }, 500);
  }
};
