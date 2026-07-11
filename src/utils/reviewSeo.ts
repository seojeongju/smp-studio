import { SITE_URL, SITE_NAME } from '../constants/seo';

export type SeoReview = {
  name: string;
  rating: number;
  category: string;
  comment: string;
  created_at: string;
};

const SCRIPT_ID = 'grace-review-jsonld';

function toIsoDate(value: string): string {
  const normalized = value.includes('T') ? value : `${value.replace(' ', 'T')}Z`;
  const d = new Date(normalized);
  if (Number.isNaN(d.getTime())) return value.slice(0, 10);
  return d.toISOString().slice(0, 10);
}

/** 후기 목록으로 AggregateRating + Review JSON-LD 주입 */
export function applyReviewJsonLd(reviews: SeoReview[]) {
  if (typeof document === 'undefined') return;

  const visible = reviews.filter((r) => r.comment?.trim());
  if (visible.length === 0) {
    document.getElementById(SCRIPT_ID)?.remove();
    return;
  }

  const avg =
    Math.round(
      (visible.reduce((sum, r) => sum + Number(r.rating), 0) / visible.length) * 10
    ) / 10;

  const payload = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BeautySalon',
        '@id': `${SITE_URL}/#business`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: String(avg),
          reviewCount: String(visible.length),
          bestRating: '5',
          worstRating: '1',
        },
        review: visible.slice(0, 10).map((r) => ({
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
        })),
      },
    ],
  };

  let el = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = SCRIPT_ID;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(payload);
}

/** 앱 시작 시 후기 JSON-LD 로드 */
export async function loadAndApplyReviewJsonLd() {
  try {
    const res = await fetch('/api/reviews?limit=20&sort=latest', { cache: 'no-cache' });
    if (!res.ok) return;
    const data = (await res.json()) as { success?: boolean; reviews?: SeoReview[] };
    if (data.success && data.reviews) {
      applyReviewJsonLd(data.reviews);
    }
  } catch {
    /* 검색용 부가 기능 — 실패해도 UI에 영향 없음 */
  }
}
