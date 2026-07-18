import { type CSSProperties, type ReactNode } from 'react';
import {
  getNaverBookingUrl,
  isNaverBookingConfigured,
  openNaverBooking,
} from '../constants/naver';

interface NaverBookingButtonProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** 미설정 시 숨김 (기본 false — 퀵바는 항상 보이고 대체 동작) */
  hideWhenUnavailable?: boolean;
  /** 예약 URL 미설정 시 대체 동작 (예: 1:1 상담) */
  onUnavailable?: () => void;
}

export function NaverBookingButton({
  children,
  className,
  style,
  hideWhenUnavailable = false,
  onUnavailable,
}: NaverBookingButtonProps) {
  const configured = isNaverBookingConfigured();
  const href = getNaverBookingUrl();

  if (!configured && hideWhenUnavailable && !onUnavailable) {
    return null;
  }

  const handleClick = (event: React.MouseEvent) => {
    if (!configured) {
      event.preventDefault();
      onUnavailable?.();
      return;
    }
    // a 태그 기본 동작으로 충분. JS open도 허용.
    if (!(event.currentTarget instanceof HTMLAnchorElement)) {
      event.preventDefault();
      openNaverBooking();
    }
  };

  if (configured && href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
        onClick={handleClick}
        aria-label="네이버 예약 바로가기"
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={handleClick}
      aria-label="네이버 예약 (준비 중)"
    >
      {children}
    </button>
  );
}
