async function parseJson<T>(res: Response): Promise<T> {
  const data = await res.json();
  return data as T;
}

export async function checkAdminAuth(): Promise<boolean> {
  const res = await fetch('/api/admin/auth', { credentials: 'include' });
  if (!res.ok) return false;
  const data = await parseJson<{ authenticated?: boolean }>(res);
  return !!data.authenticated;
}

export async function adminLogin(password: string): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch('/api/admin/auth', {
    method: 'POST',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const data = await parseJson<{ success?: boolean; error?: string }>(res);
  if (!res.ok) return { ok: false, error: data.error || '로그인에 실패했습니다.' };
  return { ok: true };
}

export async function adminLogout(): Promise<void> {
  await fetch('/api/admin/auth', { method: 'DELETE', credentials: 'include' });
}

export async function uploadImage(file: File, folder: 'portfolio' | 'gallery' | 'reviews' | 'consulting') {
  const form = new FormData();
  form.append('file', file);
  form.append('folder', folder);
  const res = await fetch('/api/upload', {
    method: 'POST',
    credentials: 'include',
    body: form,
  });
  const data = await parseJson<{ success?: boolean; url?: string; error?: string }>(res);
  if (!res.ok || !data.url) {
    throw new Error(data.error || '이미지 업로드에 실패했습니다.');
  }
  return data.url;
}
