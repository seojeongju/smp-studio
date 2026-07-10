import {
  KAKAO_CHANNEL,
  getKakaoAppKey,
  getKakaoChannelChatUrl,
  getKakaoChannelHomeUrl,
  isKakaoChannelConfigured,
  loadPublicConfig,
} from '../constants/kakao';

const KAKAO_JS_SDK_URL =
  'https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js';

let jsSdkPromise: Promise<KakaoSDK> | null = null;

function initKakaoSdk(appKey?: string): KakaoSDK {
  const key = appKey || getKakaoAppKey();
  if (!key) {
    throw new Error('카카오 JavaScript 키가 설정되지 않았습니다.');
  }
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(key);
  }
  return window.Kakao;
}

export async function loadKakaoJsSdk(): Promise<KakaoSDK> {
  if (jsSdkPromise) {
    return jsSdkPromise;
  }

  const config = await loadPublicConfig();
  const appKey = config.kakaoAppKey || undefined;

  jsSdkPromise = new Promise((resolve, reject) => {
    if (window.Kakao) {
      try {
        resolve(initKakaoSdk(appKey));
      } catch (error) {
        jsSdkPromise = null;
        reject(error);
      }
      return;
    }

    const script = document.createElement('script');
    script.src = KAKAO_JS_SDK_URL;
    script.async = true;
    script.onload = () => {
      try {
        resolve(initKakaoSdk(appKey));
      } catch (error) {
        jsSdkPromise = null;
        reject(error);
      }
    };
    script.onerror = () => {
      jsSdkPromise = null;
      reject(new Error('카카오 JavaScript SDK를 불러오지 못했습니다.'));
    };
    document.head.appendChild(script);
  });

  return jsSdkPromise;
}

export type KakaoChannelAction = 'chat' | 'add' | 'follow';

export type KakaoChannelActionResult =
  | { ok: true }
  | { ok: false; reason: 'not_configured' | 'sdk_failed' };

function getFallbackUrl(action: KakaoChannelAction): string | null {
  if (action === 'chat') return getKakaoChannelChatUrl();
  return getKakaoChannelHomeUrl();
}

export async function runKakaoChannelAction(
  action: KakaoChannelAction,
): Promise<KakaoChannelActionResult> {
  if (!isKakaoChannelConfigured()) {
    return { ok: false, reason: 'not_configured' };
  }

  const channelId = KAKAO_CHANNEL.publicId;
  const appKey = getKakaoAppKey();

  if (appKey) {
    try {
      const Kakao = await loadKakaoJsSdk();
      if (action === 'chat') {
        Kakao.Channel.chat({ channelPublicId: channelId });
        return { ok: true };
      }
      if (action === 'add') {
        Kakao.Channel.addChannel({ channelPublicId: channelId });
        return { ok: true };
      }
      await Kakao.Channel.followChannel({ channelPublicId: channelId });
      return { ok: true };
    } catch {
      /* SDK 실패 시 링크로 폴백 */
    }
  }

  const fallbackUrl = getFallbackUrl(action);
  if (fallbackUrl) {
    window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    return { ok: true };
  }

  return { ok: false, reason: 'sdk_failed' };
}
