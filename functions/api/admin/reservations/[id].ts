import type { Env } from '../../../types';
import { isErrorResponse, json, requireAdmin } from '../../../lib/auth';

const ALLOWED_STATUS = new Set(['pending', 'confirmed', 'cancelled', 'done']);

/**
 * PUT /api/admin/reservations/:id — 상태 변경 { status }
 */
export const onRequestPut: PagesFunction<Env> = async (context) => {
  const auth = await requireAdmin(context.request, context.env);
  if (isErrorResponse(auth)) return auth;

  const id = context.params.id as string;
  if (!id) return json({ error: 'ID가 필요합니다.' }, 400);

  try {
    const body = await context.request.json<{ status?: string }>();
    const status = body.status?.trim();

    if (!status || !ALLOWED_STATUS.has(status)) {
      return json({
        error: 'status는 pending, confirmed, cancelled, done 중 하나여야 합니다.',
      }, 400);
    }

    const existing = await context.env.DB.prepare(
      'SELECT id FROM reservations WHERE id = ?'
    )
      .bind(id)
      .first();

    if (!existing) return json({ error: '상담 신청을 찾을 수 없습니다.' }, 404);

    await context.env.DB.prepare(
      'UPDATE reservations SET status = ? WHERE id = ?'
    )
      .bind(status, id)
      .run();

    return json({ success: true, status });
  } catch (error: any) {
    return json({ error: '상태 변경에 실패했습니다.', details: error.message }, 500);
  }
};

/**
 * DELETE /api/admin/reservations/:id
 */
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const auth = await requireAdmin(context.request, context.env);
  if (isErrorResponse(auth)) return auth;

  const id = context.params.id as string;
  if (!id) return json({ error: 'ID가 필요합니다.' }, 400);

  try {
    const result = await context.env.DB.prepare(
      'DELETE FROM reservations WHERE id = ?'
    )
      .bind(id)
      .run();

    if (!result.meta.changes) {
      return json({ error: '상담 신청을 찾을 수 없습니다.' }, 404);
    }

    return json({ success: true });
  } catch (error: any) {
    return json({ error: '삭제에 실패했습니다.', details: error.message }, 500);
  }
};
