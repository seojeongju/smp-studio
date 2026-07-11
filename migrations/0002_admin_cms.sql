-- Phase 1 CMS: 관리자 세션, 단가표, 포트폴리오

CREATE TABLE IF NOT EXISTS admin_sessions (
    token TEXT PRIMARY KEY,
    expires_at TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);

CREATE TABLE IF NOT EXISTS service_prices (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL,
    category_label TEXT NOT NULL,
    category_subtitle TEXT NOT NULL,
    name TEXT NOT NULL,
    price_label TEXT NOT NULL,
    price_kind TEXT NOT NULL CHECK(price_kind IN ('fixed', 'from')),
    note TEXT,
    popular INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_service_prices_category ON service_prices(category_id, sort_order);

CREATE TABLE IF NOT EXISTS portfolios (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    before_url TEXT NOT NULL,
    after_url TEXT NOT NULL,
    duration TEXT,
    point TEXT,
    image_aspect_ratio TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_published INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_portfolios_published ON portfolios(is_published, sort_order);

-- 단가표 시드 (현재 공개 가격표)
INSERT OR IGNORE INTO service_prices (id, category_id, category_label, category_subtitle, name, price_label, price_kind, note, popular, sort_order) VALUES
('sp-brow-01', 'brow', '눈썹 · 아이라인 · 입술', 'Permanent Makeup', '여자눈썹', '150,000', 'fixed', NULL, 1, 1),
('sp-brow-02', 'brow', '눈썹 · 아이라인 · 입술', 'Permanent Makeup', '남자눈썹', '200,000', 'fixed', NULL, 0, 2),
('sp-brow-03', 'brow', '눈썹 · 아이라인 · 입술', 'Permanent Makeup', '아이라인', '150,000', 'fixed', NULL, 0, 3),
('sp-brow-04', 'brow', '눈썹 · 아이라인 · 입술', 'Permanent Makeup', '입술', '300,000', 'fixed', NULL, 0, 4),
('sp-scalp-01', 'scalp', '두피 · 헤어라인', 'Scalp & Hairline', 'SMP 두피문신', '500,000', 'from', '면적·밀도에 따라 상담 후 확정', 1, 1),
('sp-scalp-02', 'scalp', '두피 · 헤어라인', 'Scalp & Hairline', '헤어라인', '250,000', 'from', '라인·범위에 따라 상담 후 확정', 0, 2),
('sp-skin-01', 'skin', '스킨 · 레이저 · 타투', 'Skin Care & Tattoo', 'MTS', '100,000', 'fixed', NULL, 0, 1),
('sp-skin-02', 'skin', '스킨 · 레이저 · 타투', 'Skin Care & Tattoo', '미백레이저 5회', '250,000', 'fixed', '5회 패키지', 0, 2),
('sp-skin-03', 'skin', '스킨 · 레이저 · 타투', 'Skin Care & Tattoo', '점', '20,000', 'from', NULL, 0, 3),
('sp-skin-04', 'skin', '스킨 · 레이저 · 타투', 'Skin Care & Tattoo', '미니타투', '60,000', 'from', NULL, 0, 4),
('sp-skin-05', 'skin', '스킨 · 레이저 · 타투', 'Skin Care & Tattoo', '문신제거', '100,000', 'from', '크기·색소에 따라 상담 후 확정', 0, 5);

-- 기존 갤러리 포트폴리오 시드
INSERT OR IGNORE INTO portfolios (id, title, category, before_url, after_url, duration, point, image_aspect_ratio, sort_order, is_published) VALUES
('pf-01', '여성 자연 눈썹 디자인 (엠보 메이크업)', '눈썹 디자인', '/eyebrow-before-v2.png', '/eyebrow-after-v2.png', '90분 소요', '모근 결을 한 올씩 표현하는 엠보 기법으로 지극히 자연스러운 눈썹 결을 완성했습니다.', NULL, 1, 1),
('pf-02', '정수리 두피 커버 디자인 케어', '두피 케어', '/smp-before.png', '/smp-after.png', '세션당 120분', '실제 모근 크기와 동일한 초미세 도팅으로 두피의 빈틈을 자연스럽게 채웠습니다.', '3 / 4', 2, 1),
('pf-03', '남성 골격 맞춤 브로우 메이크업', '브로우 메이크업', '/men-eyebrow-before-v2.png', '/men-eyebrow-after-v2.png', '90분 소요', '두상 골격과 근육 움직임을 분석해 과장되지 않은 정돈된 남성 눈썹을 디자인했습니다.', NULL, 3, 1);
