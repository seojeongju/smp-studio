import React, { useState } from 'react';
import { Calendar, ShieldAlert, CheckCircle2, ShieldCheck, Flame, Compass, Sparkles } from 'lucide-react';

interface CareDayInfo {
  day: string;
  title: string;
  checklist: string[];
  warning: string;
  icon: React.ComponentType<{ size?: number; className?: string; color?: string }>;
}

export const CareGuide: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<number>(0);

  const careDays: CareDayInfo[] = [
    {
      day: 'Day 1',
      title: '시술 당일: 착색 및 위생 관리',
      icon: ShieldCheck,
      checklist: [
        '시술 후 최소 24시간 동안은 시술 부위에 물이 닿지 않도록 절대 세안을 금합니다.',
        '시술 당일 흘리는 격한 운동, 사우나, 찜질방은 피해야 합니다.',
        '만약 진물이 나면 마른 면봉으로 톡톡 가볍게 닦아주세요.',
      ],
      warning: '절대 손으로 시술 부위를 만지거나 긁어서 세균에 노출되지 않도록 주의하세요.',
    },
    {
      day: 'Day 2~3',
      title: '시술 2~3일차: 얇은 딱지 형성기',
      icon: Sparkles,
      checklist: [
        '가벼운 물세안(시술 부위는 비비지 않고 폼클렌저가 닿지 않게) 가능합니다.',
        '눈썹 시술의 경우 제공해 드린 재생 크림을 아침/저녁으로 쌀 한 톨 크기로 매우 얇게 펴 바릅니다.',
        '시술 부위가 일시적으로 진하고 어둡게 보일 수 있으나 정상적인 착색 과정입니다.',
      ],
      warning: '음주와 흡연은 시술 부위의 염증반응을 유도하고 재생을 더디게 하므로 금주/금연해 주세요.',
    },
    {
      day: 'Day 4~5',
      title: '시술 4~5일차: 각질 탈각 시작기',
      icon: Flame,
      checklist: [
        '시술 부위에 가려움증이 생기고 미세한 각질이 떨어지기 시작합니다.',
        '건조하지 않도록 재생 크림 혹은 보습 크림을 지속적으로 바릅니다.',
        '두피 SMP의 경우 샴푸 시 손톱이 아닌 지문 부위로 부드럽게 세정해 줍니다.',
      ],
      warning: '가장 중요: 간지럽다고 손으로 딱지나 각질을 억지로 떼어내면 색소가 같이 떨어져 얼룩이 생깁니다. 자연 탈각되도록 절대 손대지 마세요.',
    },
    {
      day: 'Day 6~7',
      title: '시술 6~7일차: 자연 탈각 완료',
      icon: Compass,
      checklist: [
        '대부분의 각질이 탈각되고 피부 아래 스며든 맑은 색소가 보이기 시작합니다.',
        '이제 일반적인 물세안, 가벼운 화장 및 샴푸가 가능합니다.',
        '피부 타입에 따라 약 20%~50%의 색소가 빠질 수 있으며, 이는 정상입니다.',
      ],
      warning: '탈각이 끝난 후 비어 보이는 부분은 4~6주 후 2차 리터치 시술 때 완벽히 보완됩니다.',
    },
  ];

  return (
    <div className="card hover-lift">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <Calendar size={20} color="var(--color-text-main)" style={{ marginRight: '8px' }} />
        <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.3px' }}>시술 후 7일 케어 캘린더</span>
      </div>

      <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '18px', lineHeight: '1.5' }}>
        반영구 시술의 착색률은 사후 관리가 80%를 결정합니다. 일자별 수칙을 꼭 지켜주세요.
      </p>

      {/* 일자별 탭 버튼 */}
      <div
        style={{
          display: 'flex',
          backgroundColor: 'var(--color-primary-light)',
          padding: '4px',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '24px',
          gap: '4px',
        }}
      >
        {careDays.map((c, i) => {
          const TabIcon = c.icon;
          const isSelected = selectedDay === i;
          return (
            <button
              key={i}
              onClick={() => setSelectedDay(i)}
              style={{
                flex: 1,
                padding: '12px 6px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isSelected ? 'var(--color-card)' : 'transparent',
                color: isSelected ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                transition: 'var(--transition-spring)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                boxShadow: isSelected ? '0 4px 10px rgba(58,50,44,0.06)' : 'none'
              }}
            >
              <TabIcon size={14} color={isSelected ? 'var(--color-text-main)' : 'var(--color-text-muted)'} />
              {c.day}
            </button>
          );
        })}
      </div>

      {/* 상세 수칙 가이드 */}
      <div style={{ animation: 'fadeIn 0.3s ease' }}>
        <h4
          style={{
            fontSize: '15px',
            fontWeight: 700,
            color: 'var(--color-text-main)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <div style={{
            width: '6px',
            height: '16px',
            borderRadius: '3px',
            backgroundColor: 'var(--color-primary-dark)'
          }} />
          {careDays[selectedDay].title}
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          {careDays[selectedDay].checklist.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <CheckCircle2
                size={16}
                color="var(--color-text-muted)"
                style={{ marginTop: '2px', flexShrink: 0 }}
              />
              <span style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--color-text-main)', fontWeight: 500 }}>
                {item}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            backgroundColor: 'rgba(217, 83, 79, 0.04)',
            borderLeft: '4px solid var(--color-danger)',
            padding: '14px 16px',
            borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            border: '1px solid rgba(217, 83, 79, 0.1)',
            borderLeftWidth: '4px'
          }}
        >
          <ShieldAlert
            size={16}
            color="var(--color-danger)"
            style={{ marginTop: '2px', flexShrink: 0 }}
          />
          <span
            style={{
              fontSize: '12px',
              color: 'var(--color-danger)',
              fontWeight: 700,
              lineHeight: '1.45',
            }}
          >
            ⚠️ 주의사항: {careDays[selectedDay].warning}
          </span>
        </div>
      </div>
    </div>
  );
};
