import { type CSSProperties, type ReactNode } from 'react';
import { getNaverTalkUrl, isNaverTalkConfigured, openNaverTalk } from '../constants/naver';
import { trackCta } from '../utils/analytics';

interface NaverTalkButtonProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  hideWhenUnavailable?: boolean;
  onUnavailable?: () => void;
}

export function NaverTalkButton({
  children,
  className,
  style,
  hideWhenUnavailable = false,
  onUnavailable,
}: NaverTalkButtonProps) {
  const configured = isNaverTalkConfigured();
  const href = getNaverTalkUrl();

  if (!configured && hideWhenUnavailable && !onUnavailable) {
    return null;
  }

  const handleClick = (event: React.MouseEvent) => {
    if (!configured) {
      event.preventDefault();
      onUnavailable?.();
      return;
    }
    if (event.currentTarget instanceof HTMLAnchorElement) {
      trackCta('talk');
      return;
    }
    event.preventDefault();
    openNaverTalk();
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
        aria-label="네이버 톡톡 상담"
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
      aria-label="네이버 톡톡 상담 (준비 중)"
    >
      {children}
    </button>
  );
}
