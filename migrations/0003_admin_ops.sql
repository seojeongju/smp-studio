-- Phase 2: 후기 숨김 + 운영 관리용 컬럼

ALTER TABLE reviews ADD COLUMN is_hidden INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_reviews_hidden ON reviews(is_hidden, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status, created_at DESC);
