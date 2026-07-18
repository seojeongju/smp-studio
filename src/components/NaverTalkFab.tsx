import { MessageCircle } from 'lucide-react';
import { isNaverTalkConfigured, openNaverTalk } from '../constants/naver';

interface NaverTalkFabProps {
  onUnavailable?: () => void;
}

export function NaverTalkFab({ onUnavailable }: NaverTalkFabProps) {
  const configured = isNaverTalkConfigured();

  const handleClick = () => {
    if (!openNaverTalk()) {
      onUnavailable?.();
    }
  };

  return (
    <button
      type="button"
      className="naver-talk-fab"
      onClick={handleClick}
      aria-label={configured ? '네이버 톡톡 상담하기' : '1:1 상담 신청하기'}
    >
      <MessageCircle size={22} strokeWidth={2.25} />
      {!configured && <span className="naver-talk-fab__hint">상담</span>}
    </button>
  );
}
