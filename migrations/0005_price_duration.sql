-- 케어안내(단가표) 소요시간 필드
ALTER TABLE service_prices ADD COLUMN duration TEXT;

-- 기존 시드 항목 기본 소요시간
UPDATE service_prices SET duration = '90분 소요' WHERE id IN ('sp-brow-01', 'sp-brow-02', 'sp-brow-03');
UPDATE service_prices SET duration = '120분 소요' WHERE id = 'sp-brow-04';
UPDATE service_prices SET duration = '세션당 120분' WHERE id = 'sp-scalp-01';
UPDATE service_prices SET duration = '90분 소요' WHERE id = 'sp-scalp-02';
UPDATE service_prices SET duration = '60분 소요' WHERE id = 'sp-skin-01';
UPDATE service_prices SET duration = '약 30~40분' WHERE id = 'sp-skin-02';
