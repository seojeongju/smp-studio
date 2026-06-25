const KAKAO_SDK_URL = 'https://dapi.kakao.com/v2/maps/sdk.js';

let loadPromise: Promise<typeof kakao> | null = null;

export function loadKakaoMapSdk(appKey: string): Promise<typeof kakao> {
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    const init = () => {
      window.kakao.maps.load(() => resolve(window.kakao));
    };

    if (window.kakao?.maps) {
      init();
      return;
    }

    const script = document.createElement('script');
    script.src = `${KAKAO_SDK_URL}?appkey=${encodeURIComponent(appKey)}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = init;
    script.onerror = () => {
      loadPromise = null;
      reject(new Error('카카오맵 SDK를 불러오지 못했습니다.'));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}
