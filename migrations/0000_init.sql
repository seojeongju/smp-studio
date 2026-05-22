-- D1 데이터베이스 초기 마이그레이션 스크립트

-- 1. 리뷰 테이블 생성
CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,               -- UUID
    name TEXT NOT NULL,                -- 작성자 이름
    password_hash TEXT NOT NULL,       -- 삭제용 비밀번호 해시
    rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5), -- 평점 (1~5점)
    category TEXT NOT NULL,            -- 시술 카테고리 (자연눈썹, SMP 등)
    comment TEXT NOT NULL,             -- 후기 본문
    image_url_1 TEXT,                  -- R2 스토리지 내 이미지 1 경로
    image_url_2 TEXT,                  -- R2 스토리지 내 이미지 2 경로
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP -- 작성일시
);

-- 리뷰 테이블 정렬 속도 향상을 위한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews(created_at DESC);

-- 2. 1:1 상담 견적 및 예약 테이블 생성
CREATE TABLE IF NOT EXISTS reservations (
    id TEXT PRIMARY KEY,               -- UUID
    client_name TEXT NOT NULL,         -- 고객 이름
    phone TEXT NOT NULL,               -- 연락처
    service_type TEXT NOT NULL,        -- 희망 시술 부위
    preferred_date TEXT NOT NULL,      -- 희망 날짜 (YYYY-MM-DD)
    preferred_time TEXT NOT NULL,      -- 희망 시간 (HH:MM)
    has_previous_tattoo INTEGER NOT NULL DEFAULT 0, -- 잔흔 여부 (0: 없음, 1: 있음)
    note TEXT,                         -- 요청 사항 / 상세 고민 내용
    status TEXT DEFAULT 'pending',     -- 예약 상태 (pending: 대기, confirmed: 확정, cancelled: 취소)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP -- 신청 일시
);

-- 날짜 검색 속도 향상을 위한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(preferred_date);
