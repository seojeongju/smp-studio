export interface Env {
  // D1 Database 바인딩
  DB: D1Database;
  // R2 Object Storage 바인딩
  MEDIA_BUCKET: R2Bucket;
  // Discord 알림 수신 웹훅 URL (선택)
  DISCORD_WEBHOOK_URL?: string;
}
