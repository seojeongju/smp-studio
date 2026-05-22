import React, { useState } from 'react';
import { Clock, ShieldCheck, Sparkles, Scissors, Smile, Compass, AlertCircle, CheckCircle2, RefreshCw, ChevronRight } from 'lucide-react';

interface ServiceItem {
  name: string;
  price: string;
  priceType: 'fixed' | 'quote'; // 고정가 / 견적형
  duration: string;
  sessions?: string; // SMP 전용
  features: string[];
  icon: React.ComponentType<{ size?: number; className?: string; color?: string }>;
  tag?: string; // 추천 태그 (선택)
}

interface ServiceCategory {
  id: string;
  label: string;
  emoji: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; className?: string; color?: string }>;
  items: ServiceItem[];
}

interface ServicesInfoProps {
  onStartConsulting: () => void;
}

export const ServicesInfo: React.FC<ServicesInfoProps> = ({ onStartConsulting }) => {
  const [activeCategory, setActiveCategory] = useState<string>('eyebrow');

  const services: ServiceCategory[] = [
    {
      id: 'eyebrow',
      label: '눈썹 디자인',
      emoji: '✦',
      title: '눈썹 디자인 아트',
      subtitle: 'Eyebrow Artistry',
      icon: Smile,
      items: [
        {
          name: '자연 눈썹',
          price: '180,000원',
          priceType: 'fixed',
          duration: '90분',
          icon: Sparkles,
          tag: 'FIRST 추천',
          features: [
            '본래 눈썹 결을 한 올 한 올 미세하게 그리는 엠보 기법',
            '눈썹 모가 얇거나 고르지 못한 첫 디자인 고객에게 최적',
            '1차 케어 후 6주 내 리터치 1회 무료 포함',
          ],
        },
        {
          name: '콤보 눈썹',
          price: '220,000원',
          priceType: 'fixed',
          duration: '105분',
          icon: Scissors,
          tag: '인기',
          features: [
            '엠보 결 표현 + 그라데이션 섀도우 음영 병행 케어',
            '메이크업을 한 듯 또렷하고 그윽한 눈매 연출',
            '기존 디자인 잔흔이 붉거나 푸르게 남은 분께 추천',
          ],
        },
        {
          name: '남자 눈썹 교정',
          price: '200,000원',
          priceType: 'fixed',
          duration: '90분',
          icon: Smile,
          features: [
            '골격과 눈썹 주변 근육 움직임을 고려한 대칭 교정',
            '과장되지 않고 자연스럽게 정돈된 인상의 맞춤 기법',
            '리터치 1회 포함',
          ],
        },
      ],
    },
    {
      id: 'smp',
      label: '두피 커버 디자인',
      emoji: '◎',
      title: '두피 마이크로 디자인',
      subtitle: 'Scalp Micro Pigmentation',
      icon: Compass,
      items: [
        {
          name: '정수리 / 가르마 숱 보강',
          price: '견적 상담',
          priceType: 'quote',
          duration: '120분',
          sessions: '3 ~ 4회',
          icon: Sparkles,
          tag: '분할 케어',
          features: [
            '정수리·가르마 갈라짐 부위 빈틈 정밀 보강',
            '실제 모근 두께와 동일한 초미세 도팅 기법 적용',
            '그라데이션 자연스러움을 위한 3~4회 분할 케어',
          ],
        },
        {
          name: '헤어라인 / M자 이마',
          price: '견적 상담',
          priceType: 'quote',
          duration: '120분',
          sessions: '3회',
          icon: Compass,
          features: [
            '이마 라인을 둥글고 단정하게 축소·교정',
            '헤어 주변부 톤 매칭 스펙트럼 정밀 설계',
            '기본 3회 점진적 레이어링 세션 진행',
          ],
        },
        {
          name: '민머리 전체 커버 SMP',
          price: '견적 상담',
          priceType: 'quote',
          duration: '180 ~ 240분',
          sessions: '4 ~ 5회',
          icon: ShieldCheck,
          tag: '토탈 디자인',
          features: [
            '탈모 면적 맞춤형 삭발 스타일 종합 디자인',
            '두상 밸런스 기반 새로운 페이스라인 획정',
            '기본 4~5회 세션 점진적 빌드업으로 완성',
          ],
        },
      ],
    },
  ];

  const current = services.find((s) => s.id === activeCategory)!;

  return (
    <div>
      {/* ── 카테고리 세그먼트 탭 ── */}
      <div style={{
        display: 'flex',
        backgroundColor: 'var(--color-primary-light)',
        borderRadius: '16px',
        padding: '5px',
        marginBottom: '24px',
        gap: '4px',
      }}>
        {services.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                flex: 1,
                padding: '12px 8px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 700,
                fontFamily: 'var(--font-family)',
                backgroundColor: isActive ? 'var(--color-text-main)' : 'transparent',
                color: isActive ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                boxShadow: isActive ? '0 4px 14px rgba(58,50,44,0.18)' : 'none',
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <span style={{ fontSize: '16px', lineHeight: 1 }}>{cat.emoji}</span>
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* ── 카테고리 헤더 ── */}
      <div style={{
        textAlign: 'center',
        marginBottom: '20px',
        animation: 'fadeIn 0.3s ease',
      }}>
        <span style={{
          display: 'inline-block',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '1.5px',
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          backgroundColor: 'var(--color-primary-light)',
          padding: '4px 12px',
          borderRadius: '20px',
          marginBottom: '8px',
        }}>
          {current.subtitle}
        </span>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 700,
          color: 'var(--color-text-main)',
          letterSpacing: '-0.4px',
          margin: 0,
        }}>
          {current.title}
        </h3>
      </div>

      {/* ── 서비스 아이템 카드 목록 ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', animation: 'fadeIn 0.3s ease' }}>
        {current.items.map((item, idx) => {
          const ItemIcon = item.icon;
          return (
            <div
              key={idx}
              className="card hover-lift"
              style={{ padding: '0', overflow: 'hidden', marginBottom: 0 }}
            >
              {/* 카드 헤더 (아이콘 + 이름 + 태그) */}
              <div style={{
                background: 'linear-gradient(135deg, var(--color-primary-light) 0%, rgba(255,255,255,0.5) 100%)',
                padding: '18px 20px 16px',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(58,50,44,0.06)',
                  border: '1px solid rgba(230,213,195,0.4)',
                }}>
                  <ItemIcon size={20} color="var(--color-text-main)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: 'var(--color-text-main)',
                    margin: '0 0 4px 0',
                    letterSpacing: '-0.3px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {item.name}
                  </h4>
                  {item.tag && (
                    <span style={{
                      display: 'inline-block',
                      fontSize: '10px',
                      fontWeight: 700,
                      color: 'var(--color-text-main)',
                      backgroundColor: 'var(--color-primary-dark)',
                      padding: '2px 8px',
                      borderRadius: '20px',
                      letterSpacing: '0.5px',
                    }}>
                      {item.tag}
                    </span>
                  )}
                </div>
              </div>

              {/* 가격 + 시간 인포 뱃지 행 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: item.sessions ? '1fr 1fr 1fr' : '1fr 1fr',
                gap: '0',
                borderBottom: '1px solid var(--color-border)',
              }}>
                {/* 가격 */}
                <div style={{
                  padding: '14px 10px',
                  textAlign: 'center',
                  borderRight: '1px solid var(--color-border)',
                }}>
                  <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '5px', letterSpacing: '0.5px' }}>
                    💰 케어 비용
                  </div>
                  <div style={{
                    fontSize: item.priceType === 'fixed' ? '14px' : '12px',
                    fontWeight: 800,
                    color: 'var(--color-text-main)',
                    letterSpacing: '-0.3px',
                  }}>
                    {item.price}
                  </div>
                </div>

                {/* 소요시간 */}
                <div style={{
                  padding: '14px 10px',
                  textAlign: 'center',
                  borderRight: item.sessions ? '1px solid var(--color-border)' : 'none',
                }}>
                  <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '5px', letterSpacing: '0.5px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                      <Clock size={10} /> 소요시간
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-text-main)' }}>
                    {item.duration}
                  </div>
                </div>

                {/* 세션 횟수 (SMP만) */}
                {item.sessions && (
                  <div style={{ padding: '14px 10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '5px', letterSpacing: '0.5px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                        <RefreshCw size={10} /> 세션 횟수
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-text-main)' }}>
                      {item.sessions}
                    </div>
                  </div>
                )}
              </div>

              {/* 위생 안전 칩 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderBottom: '1px solid var(--color-border)',
                backgroundColor: 'rgba(250,246,240,0.6)',
              }}>
                <ShieldCheck size={12} color="var(--color-text-muted)" />
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  1회용 멸균 도구 · 위생 안전 인증 완료
                </span>
              </div>

              {/* 특징 체크리스트 */}
              <div style={{
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}>
                {item.features.map((feat, fIdx) => (
                  <div key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <CheckCircle2
                      size={14}
                      color="var(--color-text-main)"
                      style={{ marginTop: '2px', flexShrink: 0 }}
                    />
                    <span style={{
                      fontSize: '12.5px',
                      color: 'var(--color-text-main)',
                      lineHeight: '1.5',
                      fontWeight: 500,
                    }}>
                      {feat}
                    </span>
                  </div>
                ))}
              </div>

              {/* 카드 CTA 버튼 */}
              <div style={{ padding: '0 18px 18px' }}>
                <button
                  onClick={onStartConsulting}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1.5px solid var(--color-primary-dark)',
                    backgroundColor: 'transparent',
                    color: 'var(--color-text-main)',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-family)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-text-main)';
                    e.currentTarget.style.color = 'var(--color-primary-light)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--color-text-main)';
                  }}
                >
                  이 프로그램 1:1 상담 신청하기
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 하단 견적 유도 배너 ── */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--color-text-main) 0%, #2b2520 100%)',
          textAlign: 'center',
          padding: '28px 20px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-medium)',
          marginBottom: 0,
        }}
      >
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 14px auto',
          border: '1px solid rgba(255,255,255,0.15)',
        }}>
          <AlertCircle size={24} color="var(--color-primary)" />
        </div>
        <p style={{ fontSize: '15.5px', fontWeight: 700, marginBottom: '8px', color: '#FAF6F0', letterSpacing: '-0.3px' }}>
          정확한 케어 견적이 필요하신가요?
        </p>
        <p style={{ fontSize: '12px', opacity: 0.75, marginBottom: '20px', lineHeight: '1.7', fontWeight: 300, color: '#FAF6F0' }}>
          두피 탈모 면적이나 눈썹 잔흔 진하기에 따라<br />
          세션 횟수와 가격이 달라집니다.<br />
          사진 한 장으로 1:1 맞춤 견적을 받아보세요.
        </p>
        <button
          className="btn btn-secondary"
          onClick={onStartConsulting}
          style={{ width: 'auto', padding: '12px 28px', fontSize: '13px', display: 'inline-flex' }}
        >
          📷 1:1 맞춤 사진 견적 받기
        </button>
      </div>
    </div>
  );
};
