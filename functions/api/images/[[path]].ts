import { Env } from '../../types';

/**
 * R2 버킷의 비공개 이미지 파일을 가져와서 브라우저에 스트리밍으로 안전하게 서빙하는 API
 * GET /api/images/reviews/UUID.png
 * GET /api/images/consulting/UUID.jpg
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { env, params } = context;

    // 경로 파라미터(배열)를 R2 오브젝트 Key 문자열로 조합
    const pathArray = params.path as string[];
    if (!pathArray || pathArray.length === 0) {
      return new Response(JSON.stringify({ error: '잘못된 경로 요정입니다.' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    const fileKey = pathArray.join('/');

    // R2 버킷에서 파일 조회
    const object = await env.MEDIA_BUCKET.get(fileKey);

    if (!object) {
      return new Response(JSON.stringify({ error: '요청한 이미지를 찾을 수 없습니다.' }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });
    }

    // HTTP 헤더 설정 (캐싱 및 파일 타입)
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('cache-control', 'public, max-age=31536000'); // 1년 캐싱으로 모바일 유저 로딩 최적화

    // 메모리 절약을 위해 R2 오브젝트의 body(ReadableStream)를 클라이언트로 직접 스트리밍 응답
    return new Response(object.body, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: '이미지를 불러오는 중 서버 오류가 발생했습니다.', details: error.message }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
};
