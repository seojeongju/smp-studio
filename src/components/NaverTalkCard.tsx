import { Clock, MessageCircle } from 'lucide-react';
import { NaverTalkButton } from './NaverTalkButton';
import { NAVER_TALK, isNaverTalkConfigured } from '../constants/naver';

interface NaverTalkCardProps {
  onAlternateContact?: () => void;
}

export function NaverTalkCard({ onAlternateContact }: NaverTalkCardProps) {
  const configured = isNaverTalkConfigured();

  return (
    <div
      className="card hover-lift"
      style={{
        marginBottom: '20px',
        padding: '18px 16px',
        background: configured
          ? 'linear-gradient(135deg, #F3FBF6 0%, #E8F8EF 100%)'
          : 'linear-gradient(135deg, #FAFAFA 0%, #F5F0EB 100%)',
        border: configured
          ? '1px solid rgba(3, 199, 90, 0.28)'
          : '1px solid var(--color-border)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span
          style={{
            fontSize: '9px',
            fontWeight: 800,
            backgroundColor: configured ? '#03C75A' : 'var(--color-text-muted)',
            color: '#fff',
            padding: '2px 6px',
            borderRadius: '4px',
            letterSpacing: '0.5px',
          }}
        >
          {configured ? 'TALKTALK' : 'SOON'}
        </span>
        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-main)' }}>
          네이버 톡톡 상담
        </span>
      </div>

      <p
        style={{
          fontSize: '12px',
          color: 'var(--color-text-muted)',
          lineHeight: 1.6,
          marginBottom: '14px',
        }}
      >
        {configured ? (
          <>
            {NAVER_TALK.name} 네이버 톡톡으로 실시간 케어 상담·문의를 바로 받아보세요.
            앱 설치 없이 네이버 계정으로 대화할 수 있습니다.
          </>
        ) : (
          <>
            {NAVER_TALK.name} 네이버 톡톡 실시간 상담을 준비 중입니다.
            <br />
            개설 완료 후 이 자리에서 바로 채팅 상담이 연결됩니다.
          </>
        )}
      </p>

      {configured ? (
        <NaverTalkButton
          hideWhenUnavailable={false}
          style={{
            width: '100%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            backgroundColor: '#03C75A',
            color: '#fff',
            border: 'none',
            padding: '11px 12px',
            borderRadius: '12px',
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(3,199,90,0.22)',
            textDecoration: 'none',
          }}
        >
          <MessageCircle size={16} />
          톡톡 1:1 실시간 상담
        </NaverTalkButton>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '11px 12px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-text-muted)',
              fontSize: '12.5px',
              fontWeight: 600,
            }}
          >
            <Clock size={15} />
            톡톡 개설 예정
          </div>
          {onAlternateContact && (
            <button
              type="button"
              onClick={onAlternateContact}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                backgroundColor: 'var(--color-text-main)',
                color: 'var(--color-primary-light)',
                border: 'none',
                padding: '11px 12px',
                borderRadius: '12px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <MessageCircle size={15} />
              1:1 상담 신청하기
            </button>
          )}
        </div>
      )}
    </div>
  );
}
