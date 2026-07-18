/** 세션당 고정 시드로 상위 후기만 섞어, 새로고침마다 전체 랜덤이 되지 않게 함 */

const SESSION_SEED_KEY = 'grace_review_shuffle_seed_v1';
const DEFAULT_TOP_N = 8;

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function getReviewShuffleSeed(): number {
  if (typeof window === 'undefined') return 1;
  try {
    const existing = sessionStorage.getItem(SESSION_SEED_KEY);
    if (existing) return Number(existing) || 1;
    const seed = (Date.now() ^ (Math.random() * 0x7fffffff)) >>> 0 || 1;
    sessionStorage.setItem(SESSION_SEED_KEY, String(seed));
    return seed;
  } catch {
    return (Date.now() % 1000000) + 1;
  }
}

/**
 * API 정렬(최신/고평점)은 유지한 채, 앞쪽 topN개만 세션 단위로 섞습니다.
 * SEO용 원본 배열은 건드리지 않도록 새 배열을 반환합니다.
 */
export function shuffleTopReviews<T>(reviews: T[], topN = DEFAULT_TOP_N): T[] {
  if (!reviews.length || topN <= 1) return reviews;

  const n = Math.min(topN, reviews.length);
  const head = reviews.slice(0, n);
  const tail = reviews.slice(n);
  const rand = mulberry32(getReviewShuffleSeed());

  for (let i = head.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = head[i];
    head[i] = head[j];
    head[j] = tmp;
  }

  return [...head, ...tail];
}
