/** 숫자만 추출 (콤마·원·공백 제거) */
export function parsePriceDigits(value: string): string {
  return value.replace(/[^\d]/g, '');
}

/** 천 단위 콤마 포맷 (빈 값이면 '') */
export function formatPriceNumber(value: string | number | null | undefined): string {
  const digits = String(value ?? '').replace(/[^\d]/g, '');
  if (!digits) return '';
  return Number(digits).toLocaleString('ko-KR');
}

/** 입력 중 자동 자릿수 포맷 */
export function formatPriceInput(raw: string): string {
  return formatPriceNumber(raw);
}

/** 고객 화면용 가격 표기 */
export function formatPriceDisplay(
  priceLabel: string,
  kind: 'fixed' | 'from' = 'fixed',
): string {
  const formatted = formatPriceNumber(priceLabel) || priceLabel;
  return kind === 'from' ? `${formatted}원~` : `${formatted}원`;
}
