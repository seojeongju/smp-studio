import type { Env } from '../../types';
import {
  buildSessionCookie,
  clearSessionCookie,
  createAdminSession,
  destroyAdminSession,
  getAdminPassword,
  json,
  parseCookies,
  requireAdmin,
  SESSION_COOKIE,
  isErrorResponse,
} from '../../lib/auth';

/**
 * GET /api/admin/auth — 로그인 상태 확인
 * POST /api/admin/auth — 로그인 { password }
 * DELETE /api/admin/auth — 로그아웃
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const result = await requireAdmin(context.request, context.env);
  if (isErrorResponse(result)) {
    return json({ authenticated: false }, 200);
  }
  return json({ authenticated: true });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json<{ password?: string }>();
    const password = body.password?.trim() || '';

    if (!password) {
      return json({ error: '비밀번호를 입력해 주세요.' }, 400);
    }

    if (password !== getAdminPassword(context.env)) {
      return json({ error: '비밀번호가 올바르지 않습니다.' }, 403);
    }

    const { token, maxAge } = await createAdminSession(context.env);

    return json(
      { success: true, authenticated: true },
      200,
      { 'Set-Cookie': buildSessionCookie(token, maxAge) }
    );
  } catch (error: any) {
    return json({ error: '로그인 처리 중 오류가 발생했습니다.', details: error.message }, 500);
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  try {
    const cookies = parseCookies(context.request);
    await destroyAdminSession(context.env, cookies[SESSION_COOKIE] || null);
    return json({ success: true }, 200, { 'Set-Cookie': clearSessionCookie() });
  } catch (error: any) {
    return json({ error: '로그아웃 처리 중 오류가 발생했습니다.', details: error.message }, 500);
  }
};
