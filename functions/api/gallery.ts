import type { Env } from '../types';
import { json } from '../lib/auth';
import type { GalleryImageRow } from './admin/gallery';

/**
 * GET /api/gallery — 공개 시술 사진
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const category = url.searchParams.get('category') || '';

    let query = `
      SELECT id, title, category, image_url, caption, sort_order, created_at
      FROM gallery_images
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
      ? await stmt.bind(...params).all<GalleryImageRow>()
      : await stmt.all<GalleryImageRow>();

    return json({ success: true, images: results || [] });
  } catch (error: any) {
    return json({ error: '갤러리를 불러오지 못했습니다.', details: error.message }, 500);
  }
};
