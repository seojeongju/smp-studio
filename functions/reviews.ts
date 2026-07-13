import type { Env } from './types';

type ReviewRow = {
  id: string;
  name: string;
  rating: number;
  category: string;
  comment: string;
  created_at: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toIsoDate(value: string): string {
  const d = new Date(value.includes('T') ? value : value.replace(' ', 'T') + 'Z');
  if (Number.isNaN(d.getTime())) return value.slice(0, 10);
  return d.toISOString().slice(0, 10);
}

/**
 * GET /reviews — 검색엔진·크롤러용 서버 렌더 HTML
 * (SPA 해시 라우트와 달리 본문이 초기 HTML에 포함됨)
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;
  const siteUrl = 'https://grace.ai.kr';

  let reviews: ReviewRow[] = [];
  try {
    const { results } = await env.DB.prepare(
      `SELECT id, name, rating, category, comment, created_at
       FROM reviews
       WHERE COALESCE(is_hidden, 0) = 0
       ORDER BY created_at DESC
       LIMIT 40`
    ).all<ReviewRow>();
    reviews = results || [];
  } catch {
    reviews = [];
  }

  const count = reviews.length;
  const avg =
    count > 0
      ? Math.round((reviews.reduce((sum, r) => sum + Number(r.rating), 0) / count) * 10) / 10
      : 0;

  const reviewLd = reviews.slice(0, 12).map((r) => ({
    '@type': 'Review',
    author: { '@type': 'Person', name: r.name },
    datePublished: toIsoDate(r.created_at),
    reviewBody: r.comment,
    name: `${r.category} 후기`,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: String(r.rating),
      bestRating: '5',
      worstRating: '1',
    },
    itemReviewed: { '@id': `${siteUrl}/#business` },
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${siteUrl}/reviews`,
        url: `${siteUrl}/reviews`,
        name: '고객 후기 | 그레이스샵 대구 반영구 리뷰',
        description:
          '그레이스샵 실제 고객 후기. 눈썹 디자인·두피 커버·헤어라인 시술 만족도와 생생한 리뷰를 확인하세요.',
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${siteUrl}/#business` },
        inLanguage: 'ko-KR',
      },
      {
        '@type': 'BeautySalon',
        '@id': `${siteUrl}/#business`,
        name: '그레이스샵',
        url: `${siteUrl}/`,
        ...(count > 0
          ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: String(avg),
                reviewCount: String(count),
                bestRating: '5',
                worstRating: '1',
              },
            }
          : {}),
        review: reviewLd,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: '홈',
            item: `${siteUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: '고객 후기',
            item: `${siteUrl}/reviews`,
          },
        ],
      },
    ],
  };

  const reviewArticles = reviews
    .map((r) => {
      const stars = '★'.repeat(Math.max(1, Math.min(5, Number(r.rating))));
      return `<article class="review">
  <header>
    <h2>${escapeHtml(r.category)} · ${escapeHtml(r.name)}</h2>
    <p class="meta"><span aria-label="평점 ${r.rating}점">${stars}</span> · <time datetime="${escapeHtml(toIsoDate(r.created_at))}">${escapeHtml(toIsoDate(r.created_at))}</time></p>
  </header>
  <p>${escapeHtml(r.comment)}</p>
</article>`;
    })
    .join('\n');

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>고객 후기 | 그레이스샵 대구 눈썹문신·반영구 리뷰</title>
  <meta name="description" content="그레이스샵 대구 눈썹문신·엠보·콤보·남자 눈썹문신·두피문신(SMP)·헤어라인 실제 고객 후기. 안지랑·남구 반영구 리뷰를 확인하세요." />
  <meta name="robots" content="index, follow, max-snippet:-1" />
  <link rel="canonical" href="${siteUrl}/reviews" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="ko_KR" />
  <meta property="og:site_name" content="그레이스샵" />
  <meta property="og:title" content="고객 후기 | 그레이스샵 대구 반영구 리뷰" />
  <meta property="og:description" content="그레이스샵 실제 고객 후기. 눈썹·두피·헤어라인 시술 리뷰." />
  <meta property="og:url" content="${siteUrl}/reviews" />
  <meta property="og:image" content="${siteUrl}/logo.png" />
  <style>
    :root { color-scheme: light; }
    body { margin: 0; font-family: "Apple SD Gothic Neo", "Malgun Gothic", sans-serif; background: #faf6f0; color: #3a322c; line-height: 1.6; }
    header.site { padding: 20px 16px; background: #3a322c; color: #faf6f0; }
    header.site a { color: #faf6f0; }
    main { max-width: 720px; margin: 0 auto; padding: 24px 16px 48px; }
    h1 { font-size: 1.5rem; margin: 0 0 8px; }
    .summary { margin-bottom: 20px; color: #6b5f55; font-size: 0.95rem; }
    .review { background: #fff; border: 1px solid #e8e0d6; border-radius: 12px; padding: 16px; margin-bottom: 12px; }
    .review h2 { font-size: 1rem; margin: 0 0 6px; }
    .meta { margin: 0 0 10px; font-size: 0.85rem; color: #8a7d72; }
    .cta { display: inline-block; margin-top: 8px; padding: 12px 16px; background: #3a322c; color: #faf6f0; text-decoration: none; border-radius: 999px; font-weight: 700; font-size: 0.9rem; }
    footer { margin-top: 28px; font-size: 0.85rem; color: #8a7d72; }
  </style>
  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>
</head>
<body>
  <header class="site">
    <strong><a href="${siteUrl}/">그레이스샵</a></strong>
    · 대구 반영구 눈썹·두피커버
  </header>
  <main>
    <h1>그레이스샵 고객 후기</h1>
    <p class="summary">
      ${
        count > 0
          ? `실제 시술 고객 리뷰 ${count}건 · 평균 만족도 ${avg}/5점`
          : '등록된 고객 후기를 준비 중입니다.'
      }
    </p>
    <p><a class="cta" href="${siteUrl}/#reviews">앱에서 후기 작성·더보기</a></p>
    ${reviewArticles || '<p>아직 공개된 후기가 없습니다.</p>'}
    <footer>
      <p>주소: 대구광역시 남구 안지랑로 73 앞산리슈빌앤리마크 501동 지하1층 105호</p>
      <p><a href="${siteUrl}/">홈</a> · <a href="${siteUrl}/#services">시술 안내</a> · <a href="${siteUrl}/#location">오시는 길</a></p>
    </footer>
  </main>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
