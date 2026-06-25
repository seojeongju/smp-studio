import { Clock, MessageCircle, UserPlus } from 'lucide-react';
import { KakaoChannelButton } from './KakaoChannelButton';
import { KAKAO_CHANNEL, isKakaoChannelConfigured } from '../constants/kakao';

interface KakaoChannelCardProps {
  /** 채널 오픈 전 대체 문의 동작 (예: 1:1 상담 시트) */
  onAlternateContact?: () => void;
}

export function KakaoChannelCard({ onAlternateContact }: KakaoChannelCardProps) {
  const configured = isKakaoChannelConfigured();

  return (
    <div
      className="card hover-lift"
      style={{
        marginBottom: '20px',
        padding: '18px 16px',
        background: configured
          ? 'linear-gradient(135deg, #FFFDF5 0%, #FFF9E0 100%)'
          : 'linear-gradient(135deg, #FAFAFA 0%, #F5F0EB 100%)',
        border: configured
          ? '1px solid rgba(254, 229, 0, 0.35)'
          : '1px solid var(--color-border)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span
          style={{
            fontSize: '9px',
            fontWeight: 800,
            backgroundColor: configured ? '#FEE500' : 'var(--color-text-muted)',
            color: configured ? '#191919' : '#fff',
            padding: '2px 6px',
            borderRadius: '4px',
            letterSpacing: '0.5px',
          }}
        >
          {configured ? 'OFFICIAL' : 'SOON'}
        </span>
        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-main)' }}>
          카카오톡 채널
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
            {KAKAO_CHANNEL.name} 공식 채널을 추가하고 예약·케어 문의를 카카오톡으로 바로 받아보세요.
          </>
        ) : (
          <>
            {KAKAO_CHANNEL.name} 카카오톡 공식 채널을 준비 중입니다.
            <br />
            채널 오픈 후 카카오톡으로 간편 예약·상담이 가능해집니다.
          </>
        )}
      </p>

      {configured ? (
        <div style={{ display: 'flex', gap: '8px' }}>
          <KakaoChannelButton
            action="chat"
            hideWhenUnavailable={false}
            style={{
              flex: 1.4,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              backgroundColor: '#FEE500',
              color: '#191919',
              border: 'none',
              padding: '11px 12px',
              borderRadius: '12px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(254,229,0,0.2)',
            }}
          >
            <MessageCircle size={16} />
            1:1 채팅 상담
          </KakaoChannelButton>

          <KakaoChannelButton
            action="follow"
            hideWhenUnavailable={false}
            style={{
              flex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              backgroundColor: 'var(--color-card)',
              color: 'var(--color-text-main)',
              border: '1px solid var(--color-border)',
              padding: '11px 10px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <UserPlus size={15} />
            채널 추가
          </KakaoChannelButton>
        </div>
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
            채널 오픈 예정
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
