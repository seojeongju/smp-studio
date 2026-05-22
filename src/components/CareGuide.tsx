import React, { useState } from 'react';
import {
  Calendar, ShieldAlert, CheckCircle2, ShieldCheck,
  Flame, Compass, Sparkles, AlertTriangle, RefreshCw,
  Clock, Droplets, Scissors,
} from 'lucide-react';

interface CareDayInfo {
  day: string;
  shortDay: string;
  title: string;
  subtitle: string;
  emoji: string;
  color: string; // 각 단계별 강조 색상
  icon: React.ComponentType<{ size?: number; className?: string; color?: string }>;
  checklist: { text: string; icon: React.ComponentType<{ size?: number; color?: string }> }[];
  warning: string;
  tip?: string;
}

export const CareGuide: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<number>(0);

  const careDays: CareDayInfo[] = [
    {
      day: 'Day 1',
      shortDay: 'D1',
      title: '케어 당일',
      subtitle: '착색 & 위생 집중 관리',
      emoji: '🛡️',
      color: '#6B8FAB',
      icon: ShieldCheck,
      checklist: [
        { text: '케어 후 최소 24시간, 물이 절대 닿지 않도록 세안 금지', icon: Droplets },
        { text: '격한 운동·사우나·찜질방 등 땀 흘리는 활동 전면 금지', icon: Flame },
        { text: '진물이 날 경우 마른 면봉으로 가볍게 톡톡 닦기', icon: Scissors },
      ],
      warning: '절대 손으로 케어 부위를 만지거나 긁어서 세균에 노출되지 않도록 주의하세요.',
      tip: '당일은 색소가 피부에 자리잡는 가장 중요한 시간입니다.',
    },
    {
      day: 'Day 2~3',
      shortDay: 'D2-3',
      title: '딱지 형성기',
      subtitle: '재생 크림 & 보습 집중',
      emoji: '✨',
      color: '#8B6F8F',
      icon: Sparkles,
      checklist: [
        { text: '가벼운 물세안 가능 (케어 부위는 비비지 않고 폼클렌저 금지)', icon: Droplets },
        { text: '재생 크림을 아침·저녁 쌀 한 톨 크기로 아주 얇게 펴 바르기', icon: Sparkles },
        { text: '케어 부위가 일시적으로 진하고 어둡게 보이는 것은 정상', icon: CheckCircle2 },
      ],
      warning: '음주와 흡연은 염증반응을 유도하고 재생을 더디게 합니다. 금주·금연 필수!',
      tip: '착색이 진해 보이는 건 정상입니다. 걱정하지 마세요.',
    },
    {
      day: 'Day 4~5',
      shortDay: 'D4-5',
      title: '탈각 시작기',
      subtitle: '절대 건드리지 마세요!',
      emoji: '🔥',
      color: '#B87333',
      icon: Flame,
      checklist: [
        { text: '가려움증과 함께 미세한 각질이 자연스럽게 떨어지기 시작', icon: Sparkles },
        { text: '건조하지 않도록 보습 크림을 지속적으로 충분히 바르기', icon: Droplets },
        { text: '두피 SMP는 샴푸 시 손가락 지문 부위로 부드럽게 세정', icon: Scissors },
      ],
      warning: '⭐ 가장 중요: 딱지·각질을 억지로 떼어내면 색소가 함께 탈락해 얼룩이 생깁니다. 자연 탈각될 때까지 절대 손대지 마세요!',
      tip: '이 시기가 가장 힘들지만, 참을수록 결과가 좋아집니다.',
    },
    {
      day: 'Day 6~7',
      shortDay: 'D6-7',
      title: '탈각 완료',
      subtitle: '일상 복귀 & 2차 준비',
      emoji: '🌿',
      color: '#556E5C',
      icon: Compass,
      checklist: [
        { text: '각질 탈각이 끝나고 피부 속 맑은 색소가 드러나기 시작', icon: CheckCircle2 },
        { text: '일반적인 물세안·가벼운 화장·샴푸가 모두 가능해집니다', icon: Droplets },
        { text: '피부 타입에 따라 20~50% 색소가 빠지는 건 완전히 정상', icon: Sparkles },
      ],
      warning: '탈각 후 비어 보이는 부분은 4~6주 후 2차 리터치 시 완벽히 보완됩니다.',
      tip: '리터치 예약을 잊지 마세요! 4~6주 후가 최적 타이밍입니다.',
    },
  ];

  const current = careDays[selectedDay];

  return (
    <div>
      {/* ── 상단 인포그래픽 헤더 배너 ── */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-text-main) 0%, #2b2520 100%)',
        borderRadius: 'var(--radius-md)',
        padding: '22px 20px',
        marginBottom: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* 장식 원 */}
        <div style={{ position: 'absolute', top: '-24px', right: '-24px', width: '110px', height: '110px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '20px', width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          fontSize: '9.5px', fontWeight: 700, letterSpacing: '1.5px',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)',
          backgroundColor: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.15)',
          padding: '3px 10px', borderRadius: '20px', marginBottom: '10px',
        }}>
          <Calendar size={9} /> Post-Care Guide
        </span>

        <h2 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.4px', margin: '0 0 6px 0', color: '#FAF6F0' }}>
          맞춤형 사후 관리 7일 플랜
        </h2>
        <p style={{ fontSize: '12px', opacity: 0.72, lineHeight: 1.6, fontWeight: 300, margin: '0 0 16px 0', wordBreak: 'keep-all', color: '#FAF6F0' }}>
          디자인 케어의 착색률, 사후 관리가 <strong style={{ fontWeight: 700, opacity: 1 }}>80%</strong>를 결정합니다.
          일자별 수칙을 반드시 지켜주세요.
        </p>

        {/* 핵심 수치 3열 뱃지 */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {[
            { value: '7일', label: '집중 관리 기간' },
            { value: '80%', label: '관리가 결정하는 착색률' },
            { value: '4~6주', label: '리터치 최적 타이밍' },
          ].map((stat, i) => (
            <div key={i} style={{
              flex: 1, textAlign: 'center',
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderRadius: '10px', padding: '10px 4px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#FAF6F0', lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '9px', opacity: 0.65, marginTop: '4px', fontWeight: 500, lineHeight: 1.3 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 가로 타임라인 진행 스트립 ── */}
      <div style={{
        backgroundColor: 'var(--color-card)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        marginBottom: '16px',
        boxShadow: '0 4px 24px rgba(58,50,44,0.03)',
        border: '1px solid rgba(230,213,195,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
          <Clock size={14} color="var(--color-text-muted)" />
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.3px' }}>
            7일 케어 타임라인
          </span>
        </div>

        {/* 타임라인 스텝 행 */}
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          {careDays.map((day, i) => {
            const isActive = selectedDay === i;
            const isPast = i < selectedDay;
            return (
              <React.Fragment key={i}>
                {/* 스텝 노드 */}
                <button
                  onClick={() => setSelectedDay(i)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0',
                    position: 'relative',
                    zIndex: 2,
                  }}
                >
                  {/* 원형 아이콘 노드 */}
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    backgroundColor: isActive
                      ? day.color
                      : isPast
                        ? 'var(--color-primary-dark)'
                        : 'var(--color-primary-light)',
                    border: isActive
                      ? `2px solid ${day.color}`
                      : '2px solid var(--color-border)',
                    boxShadow: isActive ? `0 4px 14px ${day.color}44` : 'none',
                    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  }}>
                    {isPast && !isActive ? '✓' : day.emoji}
                  </div>

                  {/* 단계 레이블 */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '9.5px',
                      fontWeight: isActive ? 800 : 600,
                      color: isActive ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                      lineHeight: 1.2,
                      fontFamily: 'var(--font-family)',
                    }}>
                      {day.day}
                    </div>
                    <div style={{
                      fontSize: '8.5px',
                      color: isActive ? day.color : 'var(--color-text-muted)',
                      fontWeight: 600,
                      marginTop: '1px',
                      opacity: isActive ? 1 : 0.7,
                    }}>
                      {day.title.split(':')[0].split(' ')[1] || day.title}
                    </div>
                  </div>
                </button>

                {/* 연결선 */}
                {i < careDays.length - 1 && (
                  <div style={{
                    height: '2px',
                    flex: 0.3,
                    backgroundColor: i < selectedDay
                      ? 'var(--color-primary-dark)'
                      : 'var(--color-border)',
                    marginBottom: '22px',
                    transition: 'background-color 0.3s ease',
                  }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── 선택된 날짜 상세 카드 ── */}
      <div style={{ animation: 'fadeIn 0.3s ease' }}>
        {/* 단계 헤더 카드 */}
        <div style={{
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          marginBottom: '12px',
          border: '1px solid rgba(230,213,195,0.2)',
          boxShadow: '0 4px 24px rgba(58,50,44,0.04)',
        }}>
          {/* 컬러 헤더 스트립 */}
          <div style={{
            background: `linear-gradient(135deg, ${current.color}22 0%, ${current.color}08 100%)`,
            borderBottom: `1px solid ${current.color}22`,
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}>
            {/* 이모지 원형 */}
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: `${current.color}18`,
              border: `2px solid ${current.color}44`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              flexShrink: 0,
            }}>
              {current.emoji}
            </div>

            <div>
              {/* 단계 뱃지 */}
              <span style={{
                display: 'inline-block',
                fontSize: '9.5px', fontWeight: 700,
                backgroundColor: current.color,
                color: '#fff',
                padding: '2px 8px', borderRadius: '20px',
                letterSpacing: '0.5px', marginBottom: '5px',
              }}>
                {current.day}
              </span>
              <h3 style={{
                fontSize: '16px', fontWeight: 700,
                color: 'var(--color-text-main)',
                margin: '0 0 2px 0', letterSpacing: '-0.3px',
              }}>
                {current.title}
              </h3>
              <p style={{
                fontSize: '11.5px', color: current.color,
                fontWeight: 700, margin: 0,
              }}>
                {current.subtitle}
              </p>
            </div>
          </div>

          {/* 오늘의 팁 */}
          {current.tip && (
            <div style={{
              padding: '10px 20px',
              backgroundColor: `${current.color}08`,
              borderBottom: `1px solid ${current.color}18`,
              display: 'flex', alignItems: 'center', gap: '7px',
            }}>
              <Sparkles size={12} color={current.color} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', fontWeight: 500, wordBreak: 'keep-all' }}>
                {current.tip}
              </span>
            </div>
          )}

          {/* 체크리스트 */}
          <div style={{ backgroundColor: 'var(--color-card)', padding: '16px 20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {current.checklist.map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '13px 0',
                      borderBottom: idx < current.checklist.length - 1
                        ? '1px solid var(--color-border)'
                        : 'none',
                    }}
                  >
                    {/* 번호 배지 */}
                    <div style={{
                      width: '26px', height: '26px',
                      borderRadius: '50%',
                      backgroundColor: `${current.color}18`,
                      border: `1.5px solid ${current.color}44`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <ItemIcon size={13} color={current.color} />
                    </div>

                    <span style={{
                      fontSize: '13px',
                      lineHeight: 1.55,
                      color: 'var(--color-text-main)',
                      fontWeight: 500,
                      wordBreak: 'keep-all',
                      flex: 1,
                    }}>
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 주의사항 배너 */}
        <div style={{
          backgroundColor: 'rgba(217,83,79,0.05)',
          border: '1px solid rgba(217,83,79,0.18)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          marginBottom: '20px',
        }}>
          {/* 경고 아이콘 원형 */}
          <div style={{
            width: '34px', height: '34px', flexShrink: 0,
            borderRadius: '50%',
            backgroundColor: 'rgba(217,83,79,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShieldAlert size={16} color="var(--color-danger)" />
          </div>

          <div>
            <div style={{
              fontSize: '10.5px', fontWeight: 800,
              color: 'var(--color-danger)',
              letterSpacing: '0.5px', marginBottom: '5px',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              <AlertTriangle size={10} />
              반드시 주의하세요
            </div>
            <span style={{
              fontSize: '12.5px',
              color: '#c0403c',
              fontWeight: 600,
              lineHeight: 1.55,
              wordBreak: 'keep-all',
            }}>
              {current.warning}
            </span>
          </div>
        </div>
      </div>

      {/* ── 장기 케어 체크포인트 인포카드 ── */}
      <div style={{
        backgroundColor: 'var(--color-card)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: '1px solid rgba(230,213,195,0.2)',
        boxShadow: '0 4px 24px rgba(58,50,44,0.04)',
        marginBottom: '0',
      }}>
        {/* 헤더 */}
        <div style={{
          padding: '14px 18px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'linear-gradient(135deg, var(--color-primary-light) 0%, rgba(255,255,255,0.4) 100%)',
        }}>
          <RefreshCw size={14} color="var(--color-text-muted)" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-main)' }}>
            1주일 이후 장기 관리 포인트
          </span>
        </div>

        {/* 3가지 장기 케어 아이템 */}
        {[
          {
            icon: '☀️', color: '#C9932B',
            title: '자외선 차단 필수',
            desc: '케어 후 4주간 케어 부위에 자외선이 직접 닿으면 색소가 변색될 수 있으니 선크림을 꼭 발라주세요.',
          },
          {
            icon: '💧', color: '#6B8FAB',
            title: '충분한 보습 유지',
            desc: '건조한 피부는 색소 유지력을 낮춥니다. 케어 부위를 지속적으로 촉촉하게 유지해 주세요.',
          },
          {
            icon: '📅', color: '#556E5C',
            title: '4~6주 후 리터치 예약',
            desc: '1차 케어 후 필연적으로 20~50% 색소가 빠집니다. 리터치에서 빈 부분을 채워 완성도를 높입니다.',
          },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: '14px',
            padding: '16px 18px',
            borderBottom: i < 2 ? '1px solid var(--color-border)' : 'none',
          }}>
            <div style={{
              width: '40px', height: '40px', flexShrink: 0,
              borderRadius: '12px',
              backgroundColor: `${item.color}14`,
              border: `1px solid ${item.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px',
            }}>
              {item.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '4px' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', lineHeight: 1.55, wordBreak: 'keep-all', fontWeight: 400 }}>
                {item.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
