import React from 'react';
import { Clock, ShieldCheck, Sparkles, Scissors, Smile, Compass, AlertCircle } from 'lucide-react';

interface ServiceItem {
  name: string;
  price: string;
  duration: string;
  features: string[];
  icon: React.ComponentType<{ size?: number; className?: string; color?: string }>;
}

interface ServiceCategory {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string; color?: string }>;
  items: ServiceItem[];
}

interface ServicesInfoProps {
  onStartConsulting: () => void;
}

export const ServicesInfo: React.FC<ServicesInfoProps> = ({ onStartConsulting }) => {
  const services: ServiceCategory[] = [
    {
      title: '눈썹 반영구 (Eyebrow Artistry)',
      icon: Smile,
      items: [
        {
          name: '자연 눈썹 (엠보 엠브로이더리)',
          price: '180,000원',
          duration: '90분 소요',
          icon: Sparkles,
          features: ['본래 눈썹 결을 한 올 한 올 미세하게 그리는 기법', '눈썹 모가 얇거나 고르지 못한 첫 시술 고객 추천', '1차 시술 후 6주 내 리터치 1회 포함'],
        },
        {
          name: '콤보 눈썹 (엠보 + 섀도우)',
          price: '220,000원',
          duration: '105분 소요',
          icon: Scissors,
          features: ['선 표현(엠보 결) + 그라데이션 음영(섀도우) 병행', '메이크업을 한 듯 또렷하고 그윽한 연출', '기존 문신 잔흔이 붉거나 푸르게 남은 분들 추천'],
        },
        {
          name: '남자 눈썹 디자인 교정',
          price: '200,000원',
          duration: '90분 소요',
          icon: Smile,
          features: ['골격과 눈썹 주변 근육 움직임을 고려한 대칭 교정', '과장되지 않고 정돈된 인상을 위한 맞춤 기법', '리터치 1회 포함'],
        },
      ],
    },
    {
      title: '두피 마이크로 피그멘테이션 (SMP)',
      icon: Compass,
      items: [
        {
          name: '정수리 / 가르마 숱 보강',
          price: '견적 문의 (D1)',
          duration: '세션당 120분 내외',
          icon: Sparkles,
          features: ['정수리 및 가르마 갈라짐 부위 빈틈 정밀 보강', '실제 모근 두께와 동일한 초미세 도팅 기법', '자연스러운 그라데이션을 위해 3~4회 차 분할 시술'],
        },
        {
          name: '헤어라인 / M자 이마 쉐이딩',
          price: '견적 문의 (D1)',
          duration: '세션당 120분 내외',
          icon: Compass,
          features: ['이마 라인을 둥글고 단정하게 축소 및 교정', '헤어 주변부 톤 매칭 스펙트럼 설계', '기본 3회 점진적 레이어링 세션'],
        },
        {
          name: '민머리 / 삭발 스타일 전체 커버',
          price: '정밀 견적 상담',
          duration: '세션당 180~240분',
          icon: ShieldCheck,
          features: ['탈모 면적 맞춤형 삭발 스타일 종합 디자인', '두상 밸런스에 어울리는 새로운 페이스라인 획정', '기본 4~5회 세션 점진적 빌드업'],
        },
      ],
    },
  ];

  return (
    <div>
      {services.map((cat, catIdx) => {
        const CategoryIcon = cat.icon;
        return (
          <div key={catIdx} style={{ marginBottom: '28px' }}>
            <h3
              style={{
                fontSize: '15.5px',
                fontWeight: 700,
                color: 'var(--color-text-main)',
                marginBottom: '16px',
                borderBottom: '1px solid var(--color-primary-dark)',
                paddingBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                letterSpacing: '-0.3px',
              }}
            >
              <CategoryIcon size={18} color="var(--color-text-muted)" />
              {cat.title}
            </h3>

            {cat.items.map((item, itemIdx) => {
              const ItemIcon = item.icon;
              return (
                <div key={itemIdx} className="card hover-lift" style={{ padding: '20px', marginBottom: '16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--color-primary-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <ItemIcon size={16} color="var(--color-text-main)" />
                      </div>
                      <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--color-text-main)', margin: 0 }}>
                        {item.name}
                      </h4>
                    </div>
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: 'var(--color-text-main)',
                        backgroundColor: 'var(--color-primary-light)',
                        padding: '4px 10px',
                        borderRadius: '20px',
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
                      marginBottom: '16px',
                      fontSize: '12px',
                      color: 'var(--color-text-muted)',
                      paddingLeft: '40px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} />
                      <span>{item.duration}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={13} />
                      <span>위생 멸균 1회용 사용</span>
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: 'var(--color-bg)',
                      padding: '14px 16px',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      marginLeft: '40px',
                      borderLeft: '2px solid var(--color-primary)',
                    }}
                  >
                    {item.features.map((feat, featIdx) => (
                      <span
                        key={featIdx}
                        style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', lineHeight: '1.4' }}
                      >
                        • {feat}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      {/* 실시간 견적 유도 안내 배너 */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--color-text-main) 0%, #2b2520 100%)',
          color: 'var(--color-primary-light)',
          textAlign: 'center',
          padding: '28px 24px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-medium)',
        }}
      >
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px auto',
        }}>
          <AlertCircle size={24} color="var(--color-primary)" />
        </div>
        <p style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px', color: '#FAF6F0' }}>
          정확한 시술 견적이 필요하신가요?
        </p>
        <p style={{ fontSize: '11.5px', opacity: 0.8, marginBottom: '20px', lineHeight: '1.6', fontWeight: 300 }}>
          두피의 탈모 면적이나 눈썹의 잔흔 진하기에 따라 세션 및 가격이 상이하게 결정됩니다.<br />
          스마트폰 카메라로 간단히 사진을 찍어 1:1 비대면 상세 견적을 신청해 보세요.
        </p>
        <button
          className="btn btn-secondary btn-glow"
          onClick={onStartConsulting}
          style={{ width: 'auto', padding: '12px 28px', fontSize: '13px', display: 'inline-flex' }}
        >
          📷 1:1 맞춤 사진 견적 받아보기
        </button>
      </div>
    </div>
  );
};
