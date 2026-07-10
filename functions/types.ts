export interface Env {
  // D1 Database 바인딩
  DB: D1Database;
  // R2 Object Storage 바인딩
  MEDIA_BUCKET: R2Bucket;
  // Discord 알림 수신 웹훅 URL (선택)
  DISCORD_WEBHOOK_URL?: string;
  // 관리자 로그인 비밀번호 (미설정 시 개발용 기본값 사용)
  ADMIN_PASSWORD?: string;
}
