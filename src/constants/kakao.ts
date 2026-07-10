export type PublicConfig = {
  kakaoAppKey: string | null;
  kakaoChannelId: string | null;
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

/** /api/config 에서 런타임 키를 불러와 캐시 (지도·채널 공통) */
export async function loadPublicConfig(): Promise<PublicConfig> {
  if (cachedConfig) return cachedConfig;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const fallback: PublicConfig = {
      kakaoAppKey: buildTimeKakaoKey() || null,
      kakaoChannelId: buildTimeChannelId() || null,
    };

    try {
      const res = await fetch('/api/config');
      if (!res.ok) {
        cachedConfig = fallback;
        return cachedConfig;
      }
      const data = await res.json();
      cachedConfig = {
        kakaoAppKey: data.kakaoAppKey || fallback.kakaoAppKey,
        kakaoChannelId: data.kakaoChannelId || fallback.kakaoChannelId,
      };
      return cachedConfig;
    } catch {
      cachedConfig = fallback;
      return cachedConfig;
    } finally {
      loadPromise = null;
    }
  })();

  return loadPromise;
}
