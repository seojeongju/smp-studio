export interface Env {
  // D1 Database 바인딩
  DB: D1Database;
  // R2 Object Storage 바인딩
  MEDIA_BUCKET: R2Bucket;
  // Discord 알림 수신 웹훅 URL (선택)
  DISCORD_WEBHOOK_URL?: string;
  // 관리자 로그인 비밀번호 (미설정 시 개발용 기본값 사용)
  ADMIN_PASSWORD?: string;
  // 카카오 JavaScript 키 (런타임 — Pages Variables에 설정)
  KAKAO_APP_KEY?: string;
  VITE_KAKAO_APP_KEY?: string;
  VITE_KAKAO_MAP_APP_KEY?: string;
  // 카카오톡 채널 ID (런타임)
  KAKAO_CHANNEL_ID?: string;
  VITE_KAKAO_CHANNEL_ID?: string;
}
