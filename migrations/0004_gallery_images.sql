-- 시술 사진 갤러리 (전후 포트폴리오와 별도)

CREATE TABLE IF NOT EXISTS gallery_images (
    id TEXT PRIMARY KEY,
    title TEXT,
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_published INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_gallery_published
  ON gallery_images(is_published, sort_order, created_at DESC);
