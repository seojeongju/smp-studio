export type PriceKind = 'fixed' | 'from';

export interface ServicePrice {
  id: string;
  category_id: string;
  category_label: string;
  category_subtitle: string;
  name: string;
  price_label: string;
  price_kind: PriceKind;
  note: string | null;
  popular: number;
  sort_order: number;
  is_active?: number;
}

export interface PriceCategory {
  id: string;
  label: string;
  subtitle: string;
  items: Array<{
    id: string;
    name: string;
    priceLabel: string;
    kind: PriceKind;
    note?: string;
    popular?: boolean;
  }>;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  before_url: string;
  after_url: string;
  duration: string | null;
  point: string | null;
  image_aspect_ratio: string | null;
  sort_order: number;
  is_published?: number;
}

export const SERVICE_PRICE_NOTICE = '모든 시술 VAT 10% 별도';

export const PRICE_CATEGORY_PRESETS = [
  { id: 'brow', label: '눈썹 · 아이라인 · 입술', subtitle: 'Permanent Makeup' },
  { id: 'scalp', label: '두피 · 헤어라인', subtitle: 'Scalp & Hairline' },
  { id: 'skin', label: '스킨 · 레이저 · 타투', subtitle: 'Skin Care & Tattoo' },
] as const;

export const PORTFOLIO_CATEGORY_OPTIONS = [
  '눈썹 디자인',
  '두피 케어',
  '브로우 메이크업',
  '헤어라인',
  '아이라인',
  '입술',
  '기타',
] as const;

export const GALLERY_CATEGORY_OPTIONS = [
  '눈썹 디자인',
  '두피 케어',
  '헤어라인',
  '아이라인',
  '입술',
  '스킨케어',
  '타투',
  '샵 전경',
  '기타',
] as const;

export interface GalleryImage {
  id: string;
  title: string | null;
  category: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  is_published?: number;
  created_at?: string;
}

/** API 단가 행 → 카테고리 그룹 */
export function groupPricesByCategory(prices: ServicePrice[]): PriceCategory[] {
  const map = new Map<string, PriceCategory>();

  for (const row of prices) {
    if (!map.has(row.category_id)) {
      map.set(row.category_id, {
        id: row.category_id,
        label: row.category_label,
        subtitle: row.category_subtitle,
        items: [],
      });
    }
    map.get(row.category_id)!.items.push({
      id: row.id,
      name: row.name,
      priceLabel: row.price_label,
      kind: row.price_kind,
      note: row.note || undefined,
      popular: !!row.popular,
    });
  }

  return Array.from(map.values());
}

/** 폴백용 정적 단가 (API 실패 시) */
export const FALLBACK_PRICE_CATEGORIES: PriceCategory[] = [
  {
    id: 'brow',
    label: '눈썹 · 아이라인 · 입술',
    subtitle: 'Permanent Makeup',
    items: [
      { id: 'fb-1', name: '여자눈썹', priceLabel: '150,000', kind: 'fixed', popular: true },
      { id: 'fb-2', name: '남자눈썹', priceLabel: '200,000', kind: 'fixed' },
      { id: 'fb-3', name: '아이라인', priceLabel: '150,000', kind: 'fixed' },
      { id: 'fb-4', name: '입술', priceLabel: '300,000', kind: 'fixed' },
    ],
  },
  {
    id: 'scalp',
    label: '두피 · 헤어라인',
    subtitle: 'Scalp & Hairline',
    items: [
      { id: 'fb-5', name: 'SMP 두피문신', priceLabel: '500,000', kind: 'from', popular: true, note: '면적·밀도에 따라 상담 후 확정' },
      { id: 'fb-6', name: '헤어라인', priceLabel: '250,000', kind: 'from', note: '라인·범위에 따라 상담 후 확정' },
    ],
  },
  {
    id: 'skin',
    label: '스킨 · 레이저 · 타투',
    subtitle: 'Skin Care & Tattoo',
    items: [
      { id: 'fb-7', name: 'MTS', priceLabel: '100,000', kind: 'fixed' },
      { id: 'fb-8', name: '미백레이저 5회', priceLabel: '250,000', kind: 'fixed', note: '5회 패키지' },
      { id: 'fb-9', name: '점', priceLabel: '20,000', kind: 'from' },
      { id: 'fb-10', name: '미니타투', priceLabel: '60,000', kind: 'from' },
      { id: 'fb-11', name: '문신제거', priceLabel: '100,000', kind: 'from', note: '크기·색소에 따라 상담 후 확정' },
    ],
  },
];

export const FALLBACK_PORTFOLIOS: PortfolioItem[] = [
  {
    id: 'pf-01',
    title: '여성 자연 눈썹 디자인 (엠보 메이크업)',
    category: '눈썹 디자인',
    before_url: '/eyebrow-before.png',
    after_url: '/eyebrow-after.png',
    duration: '90분 소요',
    point: '모근 결을 한 올씩 표현하는 엠보 기법으로 지극히 자연스러운 눈썹 결을 완성했습니다.',
    image_aspect_ratio: null,
    sort_order: 1,
  },
  {
    id: 'pf-02',
    title: '정수리 두피 커버 디자인 케어',
    category: '두피 케어',
    before_url: '/smp-before.png',
    after_url: '/smp-after.png',
    duration: '세션당 120분',
    point: '실제 모근 크기와 동일한 초미세 도팅으로 두피의 빈틈을 자연스럽게 채웠습니다.',
    image_aspect_ratio: '3 / 4',
    sort_order: 2,
  },
  {
    id: 'pf-03',
    title: '남성 골격 맞춤 브로우 메이크업',
    category: '브로우 메이크업',
    before_url: '/men-eyebrow-before.png',
    after_url: '/men-eyebrow-after.png',
    duration: '90분 소요',
    point: '두상 골격과 근육 움직임을 분석해 과장되지 않은 정돈된 남성 눈썹을 디자인했습니다.',
    image_aspect_ratio: null,
    sort_order: 3,
  },
];
