import { type CSSProperties, type ReactNode } from 'react';
import { runKakaoChannelAction, type KakaoChannelAction } from '../utils/kakaoSdk';
import {
  getKakaoChannelChatUrl,
  getKakaoChannelHomeUrl,
  isKakaoChannelConfigured,
} from '../constants/kakao';

interface KakaoChannelButtonProps {
  action?: KakaoChannelAction;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** a 태그로 렌더링 (SEO·우클릭 새 탭 등) */
  asLink?: boolean;
  /** 채널 미연동 시 숨김 (기본값) */
  hideWhenUnavailable?: boolean;
  /** 채널 미연동 시 클릭 콜백 (예: 1:1 상담 시트 열기) */
  onUnavailable?: () => void;
}

function getHref(action: KakaoChannelAction): string | undefined {
  const url = action === 'chat' ? getKakaoChannelChatUrl() : getKakaoChannelHomeUrl();
  return url ?? undefined;
}

export function KakaoChannelButton({
  action = 'chat',
  children,
  className,
  style,
  asLink = false,
  hideWhenUnavailable = true,
  onUnavailable,
}: KakaoChannelButtonProps) {
  const configured = isKakaoChannelConfigured();

  if (!configured && hideWhenUnavailable && !onUnavailable) {
    return null;
  }

  const href = getHref(action);

  const handleClick = async (event: React.MouseEvent) => {
    if (!configured) {
      event.preventDefault();
      onUnavailable?.();
      return;
    }

    if (asLink) {
      event.preventDefault();
    }
    await runKakaoChannelAction(action);
  };

  if (asLink && configured && href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={className} style={style} onClick={handleClick}>
      {children}
    </button>
  );
}
