import { SHOP_LOCATION } from './location';
import { DIRECTOR } from './director';

/** 프로덕션 공개 URL (검색·OG·sitemap 기준) */
export const SITE_URL = 'https://grace.ai.kr';

export const SITE_NAME = '그레이스샵';
export const SITE_NAME_EN = 'Grace Shop';
export const SITE_TAGLINE = '눈썹 디자인 · 두피 커버 케어 전문 스튜디오';

export const SEO_DEFAULT = {
  title: '그레이스샵 | 대구 반영구 눈썹·두피커버 전문 스튜디오',
  description:
    '대구 남구 안지랑 그레이스샵. 엠보 눈썹·콤보 메이크업·두피 커버·헤어라인 쉐이딩 전문. 권영미 원장 1:1 프라이빗 예약제 뷰티 스튜디오.',
  keywords: [
    '그레이스샵',
    'Grace Shop',
    '대구 반영구',
    '대구 눈썹문신',
    '대구 엠보 눈썹',
    '대구 두피커버',
    '대구 SMP',
    '안지랑 반영구',
    '남구 눈썹 디자인',
    '헤어라인 쉐이딩',
    '콤보 메이크업',
    '권영미 원장',
    '프라이빗 뷰티 스튜디오',
  ].join(', '),
  ogImage: `${SITE_URL}/logo.png`,
  locale: 'ko_KR',
} as const;

/** 탭별 문서 제목·설명 (해시 라우팅 SPA용) */
export const TAB_SEO: Record<string, { title: string; description: string }> = {
  home: {
    title: SEO_DEFAULT.title,
    description: SEO_DEFAULT.description,
  },
  gallery: {
    title: '시술 갤러리 | 그레이스샵 대구 반영구·두피커버',
    description:
      '그레이스샵 실제 시술 사진 갤러리. 눈썹 디자인, 두피 커버, 헤어라인 등 전후 결과와 샵 분위기를 확인하세요.',
  },
  portfolio: {
    title: '전후사진 | 그레이스샵 눈썹·두피 시술 결과',
    description:
      '그레이스샵 반영구 눈썹·두피커버 전후 비교. 자연스러운 엠보·콤보·헤어라인 시술 결과를 확인하세요.',
  },
  reviews: {
    title: '고객 후기 | 그레이스샵 대구 반영구 리뷰',
    description:
      '그레이스샵을 방문한 고객 실제 후기. 눈썹 디자인·두피 커버 시술 만족도와 상담 경험을 확인하세요.',
  },
  services: {
    title: '시술 안내·가격 | 그레이스샵 대구',
    description:
      '그레이스샵 눈썹·아이라인·입술·두피·헤어라인·스킨 시술 안내와 가격. VAT 별도, 1:1 예약제.',
  },
  care: {
    title: '시술 후 케어 가이드 | 그레이스샵',
    description:
      '반영구·두피커버 시술 후 관리 방법과 리터치 시기 안내. 그레이스샵 케어 가이드.',
  },
  location: {
    title: `오시는 길 | ${SHOP_LOCATION.fullAddress}`,
    description: `그레이스샵 위치: ${SHOP_LOCATION.fullAddress}. 대구 1호선 안지랑역·대명역 인근, 카카오맵 길찾기.`,
  },
  profile: {
    title: `${DIRECTOR.nameKo} 원장 프로필 | 그레이스샵`,
    description:
      '그레이스샵 권영미 원장. 20년+ 경력, 월드K뷰티페스티벌·국제 미용대회 수상, 반영구·타투 전문.',
  },
};

/** AEO(답변 엔진)용 FAQ — JSON-LD + 페이지 본문 */
export const SEO_FAQS: Array<{ question: string; answer: string }> = [
  {
    question: '그레이스샵은 어디에 있나요?',
    answer: `그레이스샵은 ${SHOP_LOCATION.fullAddress}에 있습니다. 대구 지하철 1호선 안지랑역·대명역에서 도보로 이용 가능하며, 단지 내 주차가 가능합니다.`,
  },
  {
    question: '그레이스샵에서 어떤 시술을 하나요?',
    answer:
      '엠보 눈썹 디자인, 콤보 메이크업, 두피 커버(SMP), 헤어라인 쉐이딩, 아이라인·입술 반영구, 스킨·타투 관련 케어를 제공합니다. 100% 프라이빗 1:1 사전 예약제로 운영합니다.',
  },
  {
    question: '예약은 어떻게 하나요?',
    answer:
      '네이버 예약 또는 카카오톡 채널·상담 신청으로 예약할 수 있습니다. 방문 전 사전 예약이 필수입니다.',
  },
  {
    question: '그레이스샵 원장은 누구인가요?',
    answer: `${DIRECTOR.nameKo} 원장이 운영합니다. 전문 경력 20년 이상이며, 월드K뷰티페스티벌·국제 미용 기능경기대회 등 다수 수상·지도 이력이 있습니다.`,
  },
  {
    question: '시술 후 관리는 어떻게 하나요?',
    answer:
      '시술 직후부터 리터치 시기까지 단계별 케어 가이드를 안내합니다. 일반적으로 4~6주 후 리터치가 권장되며, 자세한 내용은 케어 가이드 메뉴에서 확인할 수 있습니다.',
  },
];

export function absoluteUrl(path = '/') {
  if (path.startsWith('http')) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function tabCanonical(tab?: string) {
  if (!tab || tab === 'home' || tab === 'admin') return `${SITE_URL}/`;
  return `${SITE_URL}/#${tab}`;
}
