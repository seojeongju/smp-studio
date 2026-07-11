import type { Env } from '../../types';
import { isErrorResponse, json, requireAdmin } from '../../lib/auth';

export interface ServicePriceRow {
  id: string;
  category_id: string;
  category_label: string;
  category_subtitle: string;
  name: string;
  price_label: string;
  price_kind: 'fixed' | 'from';
  note: string | null;
  duration: string | null;
  popular: number;
  sort_order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

/**
 * GET /api/admin/prices — 전체 단가 (비활성 포함)
 * POST /api/admin/prices — 생성
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const auth = await requireAdmin(context.request, context.env);
  if (isErrorResponse(auth)) return auth;

  try {
    const { results } = await context.env.DB.prepare(
      `SELECT * FROM service_prices
       ORDER BY category_id ASC, sort_order ASC, name ASC`
    ).all<ServicePriceRow>();

    return json({ success: true, prices: results || [] });
  } catch (error: any) {
    return json({ error: '단가표를 불러오지 못했습니다.', details: error.message }, 500);
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const auth = await requireAdmin(context.request, context.env);
  if (isErrorResponse(auth)) return auth;

  try {
    const body = await context.request.json<Partial<ServicePriceRow>>();
    const name = body.name?.trim();
    const priceLabel = body.price_label?.trim();
    const priceKind = body.price_kind;
    const categoryId = body.category_id?.trim();
    const categoryLabel = body.category_label?.trim();
    const categorySubtitle = body.category_subtitle?.trim() || '';

    if (!name || !priceLabel || !priceKind || !categoryId || !categoryLabel) {
      return json({ error: '필수 항목이 누락되었습니다.' }, 400);
    }
    if (priceKind !== 'fixed' && priceKind !== 'from') {
      return json({ error: 'price_kind는 fixed 또는 from 이어야 합니다.' }, 400);
    }

    const id = crypto.randomUUID();
    await context.env.DB.prepare(
      `INSERT INTO service_prices
        (id, category_id, category_label, category_subtitle, name, price_label, price_kind, note, duration, popular, sort_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        id,
        categoryId,
        categoryLabel,
        categorySubtitle,
        name,
        priceLabel,
        priceKind,
        body.note?.trim() || null,
        (body as { duration?: string | null }).duration?.trim() || null,
        body.popular ? 1 : 0,
        Number(body.sort_order) || 0,
        body.is_active === 0 ? 0 : 1
      )
      .run();

    return json({ success: true, id }, 201);
  } catch (error: any) {
    return json({ error: '단가 등록에 실패했습니다.', details: error.message }, 500);
  }
};
