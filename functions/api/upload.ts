import { Env } from '../types';
import { isErrorResponse, requireAdmin } from '../lib/auth';

/**
 * Cloudflare R2 버킷에 이미지를 업로드하는 API
 * POST /api/upload
 */
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;

    // Content-Type 확인
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return new Response(
        JSON.stringify({ error: '올바르지 않은 Content-Type입니다. (multipart/form-data 필요)' }),
        { status: 400, headers: { 'content-type': 'application/json' } }
      );
    }

    // 폼 데이터 파싱
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const rawFolder = (formData.get('folder') as string) || 'reviews';
    const allowedFolders = ['reviews', 'consulting', 'portfolio', 'gallery'];
    const folder = allowedFolders.includes(rawFolder) ? rawFolder : 'reviews';

    // 포트폴리오·갤러리 업로드는 관리자만 가능
    if (folder === 'portfolio' || folder === 'gallery') {
      const auth = await requireAdmin(request, env);
      if (isErrorResponse(auth)) return auth;
    }

    if (!file) {
      return new Response(
        JSON.stringify({ error: '업로드할 파일이 존재하지 않습니다.' }),
        { status: 400, headers: { 'content-type': 'application/json' } }
      );
    }

    // 허용할 이미지 확장자 검증
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!allowedExtensions.includes(fileExtension)) {
      return new Response(
        JSON.stringify({ error: '허용되지 않는 파일 형식입니다. (jpg, jpeg, png, webp, gif만 가능)' }),
        { status: 400, headers: { 'content-type': 'application/json' } }
      );
    }

    // 파일 사이즈 제한 (최대 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return new Response(
        JSON.stringify({ error: '파일 크기가 너무 큽니다. (최대 5MB)' }),
        { status: 400, headers: { 'content-type': 'application/json' } }
      );
    }

    // 고유 파일 키(파일명) 생성
    const uniqueId = crypto.randomUUID();
    const fileKey = `${folder}/${uniqueId}.${fileExtension}`;

    // R2 Object Storage에 업로드
    await env.MEDIA_BUCKET.put(fileKey, file, {
      httpMetadata: {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000', // 1년 캐싱
      },
    });

    // 업로드 성공 후 파일 키 반환
    return new Response(
      JSON.stringify({
        success: true,
        key: fileKey,
        url: `/api/images/${fileKey}`, // 프록시 서빙 주소
      }),
      { status: 200, headers: { 'content-type': 'application/json' } }
    );
  } catch (error: any) {
    // 에러 상황을 명확하게 처리 및 로깅
    console.error('Image upload error:', error);
    return new Response(
      JSON.stringify({ error: '이미지 업로드 중 서버 에러가 발생했습니다.', details: error.message }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
};
