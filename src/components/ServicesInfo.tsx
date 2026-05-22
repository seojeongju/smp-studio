import React from 'react';
import { Clock, ShieldCheck } from 'lucide-react';

interface ServiceItem {
  name: string;
  price: string;
  duration: string;
  features: string[];
}

interface ServiceCategory {
  title: string;
  items: ServiceItem[];
}

interface ServicesInfoProps {
  onStartConsulting: () => void;
}

export const ServicesInfo: React.FC<ServicesInfoProps> = ({ onStartConsulting }) => {
  const services: ServiceCategory[] = [
    {
      title: '✨ 눈썹 반영구 (Eyebrow)',
      items: [
        {
          name: '자연 눈썹 (엠보)',
          price: '180,000원',
          duration: '90분 소요',
          features: ['본래 눈썹 결을 살리는 기법', '첫 시술 고객 추천', '1차 시술 후 6주 내 리터치 1회 포함'],
        },
        {
          name: '콤보 눈썹 (엠보+섀도우)',
          price: '220,000원',
          duration: '105분 소요',
          features: ['엠보 결 + 그라데이션 음영 기법', '메이크업한 듯 또렷한 눈썹', '기존 잔흔 흐리게 남은 분들 추천'],
        },
        {
          name: '남자 눈썹 디자인 교정',
          price: '200,000원',
          duration: '90분 소요',
          features: ['골격과 눈썹 근육 움직임 맞춤형 디자인', '깔끔하고 댄디한 첫인상 교정', '리터치 1회 포함'],
        },
      ],
    },
    {
      title: '💇 두피 마이크로 피그멘테이션 (SMP)',
      items: [
        {
          name: '정수리 / 가르마 숱 보강',
          price: '견적 문의 (D1 상담)',
          duration: '회당 120분 내외',
          features: ['가르마 갈라짐 부위 빈틈 보강', '미세 모근 도팅 기법', '기본 3~4회 세션 분할 시술'],
        },
        {
          name: '헤어라인 / M자 이마 쉐이딩',
          price: '견적 문의 (D1 상담)',
          duration: '회당 120분 내외',
          features: ['이마 라인을 둥글고 작게 헤어라인 보강', '자연스러운 톤 매칭 스펙트럼', '기본 3회 세션'],
        },
        {
          name: '민머리 / 삭발 디자인 전체 커버',
          price: '정밀 견적 상담',
          duration: '회당 180~240분',
          features: ['탈모 면적 맞춤 삭발 스타일 연출', '페이스 라인 조화 헤어라인 디자인', '기본 4~5회 세션'],
        },
      ],
    },
  ];

  return (
    <div>
      {services.map((cat, catIdx) => (
        <div key={catIdx} style={{ marginBottom: '24px' }}>
          <h3
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: 'var(--color-text-main)',
              marginBottom: '14px',
              borderBottom: '1px solid var(--color-primary-dark)',
              paddingBottom: '8px',
            }}
          >
            {cat.title}
          </h3>

          {cat.items.map((item, itemIdx) => (
            <div key={itemIdx} className="card" style={{ padding: '18px', marginBottom: '14px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px',
                }}
              >
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                  {item.name}
                </h4>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--color-text-main)',
                  }}
                >
                  {item.price}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '14px',
                  fontSize: '12px',
                  color: 'var(--color-text-muted)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} />
                  <span>{item.duration}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={13} />
                  <span>안전 멸균 니들 1회용 사용</span>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--color-bg)',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                {item.features.map((feat, featIdx) => (
                  <span
                    key={featIdx}
                    style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}
                  >
                    • {feat}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* 실시간 견적 유도 안내 배너 */}
      <div
        className="card"
        style={{
          backgroundColor: 'var(--color-text-main)',
          color: 'var(--color-primary-light)',
          textAlign: 'center',
          padding: '24px 20px',
        }}
      >
        <p style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>
          정확한 시술 견적이 필요하신가요?
        </p>
        <p style={{ fontSize: '11px', opacity: 0.8, marginBottom: '16px' }}>
          탈모 면적이나 눈썹 잔흔 상태에 따라 시술 세션 및 최종 견적이 결정됩니다.<br />
          간단한 부위 사진 첨부로 1:1 비대면 상세 견적을 확인해 보세요.
        </p>
        <button
          className="btn btn-secondary"
          onClick={onStartConsulting}
          style={{ width: 'auto', padding: '10px 24px', fontSize: '13px' }}
        >
          📷 1:1 맞춤 사진 견적 받아보기
        </button>
      </div>
    </div>
  );
};
