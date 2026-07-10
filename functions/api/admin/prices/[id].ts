import type { Env } from '../../../types';
import { isErrorResponse, json, requireAdmin } from '../../../lib/auth';
import type { ServicePriceRow } from '../prices';

/**
 * PUT /api/admin/prices/:id
 * DELETE /api/admin/prices/:id
 */
export const onRequestPut: PagesFunction<Env> = async (context) => {
  const auth = await requireAdmin(context.request, context.env);
  if (isErrorResponse(auth)) return auth;

  const id = context.params.id as string;
  if (!id) return json({ error: 'ID가 필요합니다.' }, 400);

  try {
    const existing = await context.env.DB.prepare(
      'SELECT id FROM service_prices WHERE id = ?'
    )
      .bind(id)
      .first();

    if (!existing) return json({ error: '해당 단가를 찾을 수 없습니다.' }, 404);

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

    await context.env.DB.prepare(
      `UPDATE service_prices SET
        category_id = ?, category_label = ?, category_subtitle = ?,
        name = ?, price_label = ?, price_kind = ?, note = ?,
        popular = ?, sort_order = ?, is_active = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    )
      .bind(
        categoryId,
        categoryLabel,
        categorySubtitle,
        name,
        priceLabel,
        priceKind,
        body.note?.trim() || null,
        body.popular ? 1 : 0,
        Number(body.sort_order) || 0,
        body.is_active === 0 ? 0 : 1,
        id
      )
      .run();

    return json({ success: true });
  } catch (error: any) {
    return json({ error: '단가 수정에 실패했습니다.', details: error.message }, 500);
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const auth = await requireAdmin(context.request, context.env);
  if (isErrorResponse(auth)) return auth;

  const id = context.params.id as string;
  if (!id) return json({ error: 'ID가 필요합니다.' }, 400);

  try {
    const result = await context.env.DB.prepare(
      'DELETE FROM service_prices WHERE id = ?'
    )
      .bind(id)
      .run();

    if (!result.meta.changes) {
      return json({ error: '해당 단가를 찾을 수 없습니다.' }, 404);
    }

    return json({ success: true });
  } catch (error: any) {
    return json({ error: '단가 삭제에 실패했습니다.', details: error.message }, 500);
  }
};
