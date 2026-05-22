import { Env } from '../types';

// D1 데이터베이스 쿼리 결과에 대한 타입 안정성 확보를 위한 인터페이스 정의
export interface Review {
  id: string;
  name: string;
  password_hash: string;
  rating: number;
  category: string;
  comment: string;
  image_url_1: string | null;
  image_url_2: string | null;
  created_at: string;
}

/**
 * 평문 비밀번호를 Edge Web Crypto API를 사용해 SHA-256 해시로 변환하는 헬퍼 함수
 */
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * 리뷰 목록 조회 (GET /api/reviews)
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { env, request } = context;
    const url = new URL(request.url);

    // 쿼리 파라미터 파싱
    const category = url.searchParams.get('category') || '';
    const sort = url.searchParams.get('sort') || 'latest'; // latest, highest
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20', 10), 50); // 최대 50개 제한으로 D1 데이터량 제어
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    let query = 'SELECT id, name, rating, category, comment, image_url_1, image_url_2, created_at FROM reviews';
    const params: any[] = [];

    // 필터 조건 추가
    if (category && category !== '전체') {
      query += ' WHERE category = ?';
      params.push(category);
    }

    // 정렬 조건 추가
    if (sort === 'highest') {
      query += ' ORDER BY rating DESC, created_at DESC';
    } else {
      query += ' ORDER BY created_at DESC';
    }

    // 페이징 제한 추가 (성능 최적화)
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    // D1 데이터베이스 조회
    const { results } = await env.DB.prepare(query)
      .bind(...params)
      .all<Omit<Review, 'password_hash'>>();

    return new Response(JSON.stringify({ success: true, reviews: results }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: '리뷰를 조회하는 중 에러가 발생했습니다.', details: error.message }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
};

/**
 * 리뷰 등록 (POST /api/reviews)
 */
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { env, request } = context;
    const body = await request.json<any>();

    const { name, password, rating, category, comment, image_url_1, image_url_2 } = body;

    // 필수값 유효성 검증
    if (!name || !password || !rating || !category || !comment) {
      return new Response(JSON.stringify({ error: '필수 작성 항목이 누락되었습니다.' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    // 평점 범위 검증
    if (rating < 1 || rating > 5) {
      return new Response(JSON.stringify({ error: '평점은 1점에서 5점 사이여야 합니다.' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    // 비밀번호 해싱
    const passwordHash = await hashPassword(password);
    const id = crypto.randomUUID();

    // D1 데이터베이스 삽입
    await env.DB.prepare(
      `INSERT INTO reviews (id, name, password_hash, rating, category, comment, image_url_1, image_url_2)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(id, name, passwordHash, rating, category, comment, image_url_1 || null, image_url_2 || null)
      .run();

    return new Response(JSON.stringify({ success: true, reviewId: id }), {
      status: 201,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: '리뷰를 작성하는 중 서버 에러가 발생했습니다.', details: error.message }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
};

/**
 * 리뷰 삭제 (DELETE /api/reviews)
 */
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  try {
    const { env, request } = context;
    const body = await request.json<any>();
    const { id, password } = body;

    if (!id || !password) {
      return new Response(JSON.stringify({ error: '리뷰 ID와 비밀번호가 필요합니다.' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    // 삭제할 리뷰 및 비밀번호 해시 조회
    const review = await env.DB.prepare(
      'SELECT id, password_hash, image_url_1, image_url_2 FROM reviews WHERE id = ?'
    )
      .bind(id)
      .first<Review>();

    if (!review) {
      return new Response(JSON.stringify({ error: '해당 리뷰가 존재하지 않습니다.' }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });
    }

    // 비밀번호 해시값 일치 검증
    const inputHash = await hashPassword(password);
    if (review.password_hash !== inputHash) {
      return new Response(JSON.stringify({ error: '비밀번호가 일치하지 않습니다.' }), {
        status: 403,
        headers: { 'content-type': 'application/json' },
      });
    }

    // D1 데이터베이스에서 리뷰 행 삭제
    await env.DB.prepare('DELETE FROM reviews WHERE id = ?').bind(id).run();

    // 연동된 R2 스토리지의 리뷰 이미지도 함께 비동기로 삭제하여 스토리지 낭비 방지
    const deletePromises: Promise<any>[] = [];
    if (review.image_url_1 && review.image_url_1.startsWith('/api/images/')) {
      const key = review.image_url_1.replace('/api/images/', '');
      deletePromises.push(env.MEDIA_BUCKET.delete(key));
    }
    if (review.image_url_2 && review.image_url_2.startsWith('/api/images/')) {
      const key = review.image_url_2.replace('/api/images/', '');
      deletePromises.push(env.MEDIA_BUCKET.delete(key));
    }

    if (deletePromises.length > 0) {
      await Promise.all(deletePromises);
    }

    return new Response(JSON.stringify({ success: true, message: '리뷰가 정상적으로 삭제되었습니다.' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: '리뷰를 삭제하는 중 서버 에러가 발생했습니다.', details: error.message }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
};
