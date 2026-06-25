import { MessageCircle } from 'lucide-react';
import { isKakaoChannelConfigured } from '../constants/kakao';
import { runKakaoChannelAction } from '../utils/kakaoSdk';

interface KakaoChannelFabProps {
  /** 채널 미연동 시 대체 동작 (예: 1:1 상담 시트) */
  onUnavailable?: () => void;
}

export function KakaoChannelFab({ onUnavailable }: KakaoChannelFabProps) {
  const configured = isKakaoChannelConfigured();

  const handleClick = async () => {
    const result = await runKakaoChannelAction('chat');
    if (!result.ok && result.reason === 'not_configured') {
      onUnavailable?.();
    }
  };

  return (
    <button
      type="button"
      className="kakao-channel-fab"
      onClick={handleClick}
      aria-label={configured ? '카카오톡 채널 문의하기' : '1:1 상담 신청하기'}
    >
      <MessageCircle size={22} strokeWidth={2.25} />
      {!configured && <span className="kakao-channel-fab__hint">상담</span>}
    </button>
  );
}
