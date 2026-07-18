-- 사이트 접속·메뉴·CTA 일별 집계 (개인정보 비저장)
CREATE TABLE IF NOT EXISTS site_analytics_daily (
  day TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_key TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, event_type, event_key)
);

CREATE INDEX IF NOT EXISTS idx_analytics_day ON site_analytics_daily (day);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON site_analytics_daily (event_type, day);
