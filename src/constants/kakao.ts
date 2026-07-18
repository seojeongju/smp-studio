export type PublicConfig = {
  kakaoAppKey: string | null;
  kakaoChannelId: string | null;
  naverBookingUrl: string | null;
  naverTalkUrl: string | null;
};

let cachedConfig: PublicConfig | null = null;
let loadPromise: Promise<PublicConfig> | null = null;

function buildTimeKakaoKey(): string | undefined {
  const key =
    import.meta.env.VITE_KAKAO_APP_KEY || import.meta.env.VITE_KAKAO_MAP_APP_KEY;
  return key?.trim() || undefined;
}

function buildTimeChannelId(): string {
  return (import.meta.env.VITE_KAKAO_CHANNEL_ID as string | undefined)?.trim() || '';
}

/** 빌드 타임 키 (로컬 .env) — 런타임 로드 전 동기 폴백 */
export function getKakaoAppKey(): string | undefined {
  return cachedConfig?.kakaoAppKey || buildTimeKakaoKey() || undefined;
}

export const KAKAO_CHANNEL = {
  name: '그레이스샵',
  get publicId(): string {
    return cachedConfig?.kakaoChannelId || buildTimeChannelId();
  },
};

export function isKakaoChannelConfigured(): boolean {
  return Boolean(KAKAO_CHANNEL.publicId);
}

export function getKakaoChannelChatUrl(): string | null {
  return KAKAO_CHANNEL.publicId
    ? `https://pf.kakao.com/${KAKAO_CHANNEL.publicId}/chat`
    : null;
}

export function getKakaoChannelHomeUrl(): string | null {
  return KAKAO_CHANNEL.publicId
    ? `https://pf.kakao.com/${KAKAO_CHANNEL.publicId}`
    : null;
}

async function fetchJsonConfig(url: string): Promise<Partial<PublicConfig> | null> {
  try {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json') && !ct.includes('text/json')) {
      // SPA HTML 폴백 응답을 JSON으로 오인하지 않음
      const text = await res.text();
      if (!text.trimStart().startsWith('{')) return null;
      return JSON.parse(text) as Partial<PublicConfig>;
    }
    return (await res.json()) as Partial<PublicConfig>;
  } catch {
    return null;
  }
}

/** /api/config → /config.json → 빌드 타임 순으로 런타임 키 로드 (지도·채널·네이버예약 공통) */
export async function loadPublicConfig(): Promise<PublicConfig> {
  if (cachedConfig) return cachedConfig;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const fallback: PublicConfig = {
      kakaoAppKey: buildTimeKakaoKey() || null,
      kakaoChannelId: buildTimeChannelId() || null,
      naverBookingUrl:
        (import.meta.env.VITE_NAVER_BOOKING_URL as string | undefined)?.trim() || null,
      naverTalkUrl:
        (import.meta.env.VITE_NAVER_TALK_URL as string | undefined)?.trim() ||
        (import.meta.env.VITE_NAVER_TALK_ID
          ? `https://talk.naver.com/${String(import.meta.env.VITE_NAVER_TALK_ID).replace(/^\/+/, '')}`
          : null),
    };

    const fromApi = await fetchJsonConfig('/api/config');
    const needStatic =
      !fromApi?.kakaoAppKey ||
      fromApi.naverBookingUrl === undefined ||
      fromApi.naverTalkUrl === undefined;
    const fromStatic = needStatic ? await fetchJsonConfig('/config.json') : null;
    const data = {
      kakaoAppKey: fromApi?.kakaoAppKey || fromStatic?.kakaoAppKey,
      kakaoChannelId: fromApi?.kakaoChannelId || fromStatic?.kakaoChannelId,
      naverBookingUrl: fromApi?.naverBookingUrl || fromStatic?.naverBookingUrl,
      naverTalkUrl: fromApi?.naverTalkUrl || fromStatic?.naverTalkUrl,
    };

    cachedConfig = {
      kakaoAppKey: data.kakaoAppKey || fallback.kakaoAppKey,
      kakaoChannelId: data.kakaoChannelId || fallback.kakaoChannelId,
      naverBookingUrl: data.naverBookingUrl || fallback.naverBookingUrl,
      naverTalkUrl: data.naverTalkUrl || fallback.naverTalkUrl,
    };
    loadPromise = null;
    return cachedConfig;
  })();

  return loadPromise;
}
