import type { ServicePrice } from '../constants/services';

/** 포트폴리오/진단 결과 → 단가표 시술명 매칭 우선순위 */
const DURATION_ALIASES: Array<{
  test: (category: string, title?: string) => boolean;
  names: string[];
}> = [
  {
    test: (category, title = '') =>
      category.includes('브로우') || title.includes('남성') || title.includes('남자'),
    names: ['남자눈썹'],
  },
  {
    test: (category) => category.includes('눈썹'),
    names: ['여자눈썹'],
  },
  {
    test: (category) => category.includes('두피') || category.includes('SMP'),
    names: ['SMP 두피문신', '두피'],
  },
  {
    test: (category) => category.includes('헤어라인'),
    names: ['헤어라인'],
  },
  {
    test: (category) => category.includes('아이라인'),
    names: ['아이라인'],
  },
  {
    test: (category) => category.includes('입술'),
    names: ['입술'],
  },
  {
    test: (category) => category.includes('스킨') || category.includes('MTS'),
    names: ['MTS'],
  },
];

function normalize(text: string) {
  return text.replace(/\s+/g, '').toLowerCase();
}

/** 단가표에서 시술명으로 소요시간 찾기 */
export function findPriceDurationByName(
  prices: ServicePrice[],
  names: string[]
): string | undefined {
  for (const name of names) {
    const hit = prices.find(
      (p) =>
        p.duration?.trim() &&
        (normalize(p.name) === normalize(name) || normalize(p.name).includes(normalize(name)))
    );
    if (hit?.duration?.trim()) return hit.duration.trim();
  }
  return undefined;
}

/** 포트폴리오 카테고리·제목에 대응하는 케어안내 소요시간 */
export function resolveServiceDuration(
  prices: ServicePrice[],
  opts: { category?: string; title?: string; fallback?: string | null }
): string | undefined {
  const category = opts.category || '';
  const title = opts.title || '';

  for (const rule of DURATION_ALIASES) {
    if (!rule.test(category, title)) continue;
    const found = findPriceDurationByName(prices, rule.names);
    if (found) return found;
  }

  // 직접 시술명 매칭 (제목·카테고리에 단가명이 포함된 경우)
  for (const price of prices) {
    if (!price.duration?.trim()) continue;
    const n = normalize(price.name);
    if (!n) continue;
    if (normalize(category).includes(n) || normalize(title).includes(n)) {
      return price.duration.trim();
    }
  }

  return opts.fallback?.trim() || undefined;
}

/** 자가진단 결과 키 → 단가 시술명 */
export const DIAGNOSTIC_DURATION_NAMES: Record<string, string[]> = {
  eyebrow_new: ['여자눈썹'],
  eyebrow_cover: ['여자눈썹'],
  smp_crown: ['SMP 두피문신', '두피'],
  smp_hairline: ['헤어라인'],
  smp_full: ['SMP 두피문신', '두피'],
};
