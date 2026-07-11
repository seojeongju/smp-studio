import type { Env } from '../types';
import { json } from '../lib/auth';
import type { ServicePriceRow } from './admin/prices';

/**
 * GET /api/prices — 공개 단가표 (활성만)
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { results } = await context.env.DB.prepare(
      `SELECT id, category_id, category_label, category_subtitle, name, price_label, price_kind, note, duration, popular, sort_order
       FROM service_prices
       WHERE is_active = 1
       ORDER BY category_id ASC, sort_order ASC, name ASC`
    ).all<ServicePriceRow>();

    return json({
      success: true,
      notice: '모든 시술 VAT 10% 별도',
      prices: results || [],
    });
  } catch (error: any) {
    return json({ error: '단가표를 불러오지 못했습니다.', details: error.message }, 500);
  }
};
