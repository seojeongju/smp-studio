/** 경량 PWA: 설치 가능 + 안전한 캐시. 알림/설치 팝업은 띄우지 않음. */
export function registerPwa() {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;
  if (!import.meta.env.PROD) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // 등록 실패는 사이트 이용에 영향 없음
    });
  });
}
