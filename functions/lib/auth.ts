import type { Env } from '../types';

export const SESSION_COOKIE = 'admin_session';
const SESSION_DAYS = 7;

export function json(data: unknown, status = 200, headers: HeadersInit = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
  });
}

export function getAdminPassword(env: Env): string {
  return env.ADMIN_PASSWORD?.trim() || 'graceshop';
}

export function parseCookies(request: Request): Record<string, string> {
  const header = request.headers.get('Cookie') || '';
  const out: Record<string, string> = {};
  for (const part of header.split(';')) {
    const [rawKey, ...rest] = part.trim().split('=');
    if (!rawKey) continue;
    out[rawKey] = decodeURIComponent(rest.join('=') || '');
  }
  return out;
}

export function buildSessionCookie(token: string, maxAgeSeconds: number): string {
  const secure = true;
  return [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAgeSeconds}`,
    secure ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ');
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure`;
}

export async function createAdminSession(env: Env): Promise<{ token: string; maxAge: number }> {
  const token = crypto.randomUUID() + crypto.randomUUID().replace(/-/g, '');
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  const expiresAt = new Date(Date.now() + maxAge * 1000).toISOString();

  await env.DB.prepare(
    'INSERT INTO admin_sessions (token, expires_at) VALUES (?, ?)'
  )
    .bind(token, expiresAt)
    .run();

  return { token, maxAge };
}

export async function destroyAdminSession(env: Env, token: string | null): Promise<void> {
  if (!token) return;
  await env.DB.prepare('DELETE FROM admin_sessions WHERE token = ?').bind(token).run();
}

export async function requireAdmin(request: Request, env: Env): Promise<string | Response> {
  const cookies = parseCookies(request);
  const token = cookies[SESSION_COOKIE];
  if (!token) {
    return json({ error: '관리자 로그인이 필요합니다.' }, 401);
  }

  const session = await env.DB.prepare(
    'SELECT token, expires_at FROM admin_sessions WHERE token = ?'
  )
    .bind(token)
    .first<{ token: string; expires_at: string }>();

  if (!session) {
    return json({ error: '세션이 만료되었거나 유효하지 않습니다.' }, 401);
  }

  if (new Date(session.expires_at).getTime() < Date.now()) {
    await destroyAdminSession(env, token);
    return json({ error: '세션이 만료되었습니다. 다시 로그인해 주세요.' }, 401);
  }

  return token;
}

export function isErrorResponse(value: string | Response): value is Response {
  return typeof value !== 'string';
}
