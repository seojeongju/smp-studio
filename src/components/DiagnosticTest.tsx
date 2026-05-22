import React, { useState } from 'react';
import { HelpCircle, ChevronRight, RotateCcw, MessageCircle, Sparkles, Compass, Award, AlertTriangle, UserCheck, Flame, ArrowLeft } from 'lucide-react';

interface Option {
  label: string;
  desc?: string;
  nextStep: number | string;
  icon: React.ComponentType<{ size?: number; className?: string; color?: string }>;
}

interface Question {
  id: number;
  text: string;
  options: Option[];
}

export const DiagnosticTest: React.FC<{ onStartConsulting: () => void }> = ({ onStartConsulting }) => {
  const [currentStep, setCurrentStep] = useState<number | string>(1);
  const [history, setHistory] = useState<(number | string)[]>([]);

  // 자가진단 흐름 데이터 및 아이콘 매핑
  const steps: Record<number, Question> = {
    1: {
      id: 1,
      text: '가장 고민이거나 관심 있는 시술 부위는 어디인가요?',
      options: [
        { label: '눈썹 반영구', desc: '결을 살린 자연 눈썹 및 섀도우 콤보', nextStep: 2, icon: Sparkles },
        { label: '두피 SMP / 헤어라인', desc: '모근 표현 두피 미세 색소 요법', nextStep: 3, icon: Compass },
      ],
    },
    2: {
      id: 2,
      text: '이전에 눈썹 문신/반영구 시술을 받으신 적이 있나요?',
      options: [
        { label: '생애 첫 시술', desc: '반영구 흔적이 없는 깨끗한 피부 상태', nextStep: 'eyebrow_new', icon: UserCheck },
        { label: '잔흔 보유 시술', desc: '붉거나 푸른 이전 시술 흔적 존재', nextStep: 'eyebrow_cover', icon: AlertTriangle },
      ],
    },
    3: {
      id: 3,
      text: '어떤 형태의 두피 탈모/헤어라인 고민을 가지고 계시나요?',
      options: [
        { label: '정수리/가르마 숱 보강', desc: '비치는 두피의 미세 모근 밀도 향상', nextStep: 'smp_crown', icon: Sparkles },
        { label: 'M자 이마/헤어라인', desc: '헤어라인을 메워 작고 입체적인 이마 라인', nextStep: 'smp_hairline', icon: Compass },
        { label: '삭발 SMP 전체 커버', desc: '민머리 스타일 및 대면적 토탈 디자인', nextStep: 'smp_full', icon: Flame },
      ],
    },
  };

  // 결과 데이터 정의
  const results: Record<string, { title: string; desc: string; tip: string }> = {
    eyebrow_new: {
      title: '자연 눈썹 (엠보 결) 또는 콤보 눈썹',
      desc: '잔흔이 없는 깨끗한 피부 상태이므로, 본래 눈썹 결을 한 올 한 올 살리는 엠보 기법을 사용해 극도로 자연스러운 연출이 가능합니다. 이목구비를 조금 더 또렷하게 강조하고 싶으시다면 엠보 결 기법에 은은한 섀도우 음영을 한 층 더하는 콤보 기법을 강력 추천합니다.',
      tip: '시술 시간은 약 1시간 30분 소요되며, 1차 시술 후 피부가 완벽히 재생되는 4~6주 사이에 리터치를 진행해 완성도를 최고로 높입니다.',
    },
    eyebrow_cover: {
      title: '잔흔 중화 & 커버업 콤보 눈썹',
      desc: '기존에 받은 반영구의 붉거나 붉푸른 잔흔이 피부에 다소 남아 있는 상태입니다. 이 경우에는 단순 자연눈썹 결 시술 시 잔흔이 제대로 커버되지 않아 이질감이 생길 수 있습니다. 정교한 보색 중화 과정을 거친 후, 밀도를 높여 덮어주는 수지(섀도우) 기법이 결합된 커버업 콤보 시술을 권장합니다.',
      tip: '정확한 잔흔 상태 파악을 위해 하단의 [1:1 사진 견적 신청]을 통해 현재 눈썹 부위 사진을 전송해 주시면 더욱 정밀한 1:1 상담이 가능합니다.',
    },
    smp_crown: {
      title: '정수리 / 가르마 미세 색소 요법 (SMP)',
      desc: '모발 사이로 비치는 가르마와 하얗게 드러나는 두피 면적을 시각적으로 자연스럽게 차단하기 위해, 실제 모근 크기와 동일한 미세 도트를 입체감 있게 표현하는 시술입니다. 가르마 방향에 따라 자연스러운 도트 분산 기법으로 풍성한 머리숱을 연출합니다.',
      tip: '피부 재생 주기에 맞춰 통상 3~4회 세션으로 점진적으로 채워드리며, 시술 직후 바로 정상적인 일상생활이 가능합니다.',
    },
    smp_hairline: {
      title: '헤어라인 쉐이딩 SMP 시술',
      desc: '양측 M자 부위나 불규칙하게 뒤로 밀려난 헤어라인을 메워 얼굴형을 작고 입체감 있게 잡아주는 정밀 시술입니다. 주변 모근 두께와 정밀하게 톤을 매칭하여 흐르듯 자연스러운 이마 라인을 완성합니다.',
      tip: '헤어라인 부위는 두피 중에서도 표피층이 얇고 섬세하므로 깊이 조절에 능숙한 마이크로 디테일 시술이 필요합니다.',
    },
    smp_full: {
      title: '디자인 민머리 삭발 SMP 전체 커버',
      desc: '전반적인 탈모가 많이 진행되었거나 삭발 스타일을 상시 유지하시는 분들을 위한 토탈 디자인 시술입니다. 구강 구조, 이마 비율, 관자놀이 라인을 토대로 가상의 세련된 헤어라인 구획을 디자인하고 모근 밀도를 완성도 높게 채워 시각적인 젊음을 선사합니다.',
      tip: '전체 커버는 광범위한 명도 대비 톤 매칭이 핵심이므로 보통 4~5회 이상의 정밀 레이어링 세션이 필요합니다.',
    },
  };

  const handleOptionClick = (nextStep: number | string) => {
    setHistory([...history, currentStep]);
    setCurrentStep(nextStep);
  };

  const handlePrev = () => {
    if (history.length === 0) return;
    const newHistory = [...history];
    const prevStep = newHistory.pop()!;
    setHistory(newHistory);
    setCurrentStep(prevStep);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setHistory([]);
  };

  const isResult = typeof currentStep === 'string';
  const progressWidth = isResult ? '100%' : (currentStep === 1 ? '33%' : '66%');

  return (
    <div className="card" style={{ border: '1px solid var(--color-primary-dark)', padding: '24px' }}>
      {/* 자가진단 인포그래픽 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <HelpCircle size={20} color="var(--color-text-main)" style={{ marginRight: '8px' }} />
          <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.3px' }}>1분 맞춤 시술 자가진단</span>
        </div>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)' }}>
          {isResult ? '완료' : `${currentStep === 1 ? '1' : '2'} / 2단계`}
        </span>
      </div>

      {/* 진행 상황 프로그레스 게이지 */}
      <div className="diag-progress-container">
        <div className="diag-progress-bar" style={{ width: progressWidth }} />
      </div>

      {!isResult ? (
        // 질문 화면
        <div>
          <p
            style={{
              fontSize: '16.5px',
              fontWeight: 700,
              color: 'var(--color-text-main)',
              marginBottom: '24px',
              lineHeight: '1.45',
              letterSpacing: '-0.4px',
            }}
          >
            Q. {steps[currentStep as number].text}
          </p>

          <div className={`diag-card-grid ${currentStep === 1 ? 'cols-2' : 'cols-1'}`}>
            {steps[currentStep as number].options.map((opt, i) => {
              const OptIcon = opt.icon;
              const isRowStyle = currentStep !== 1;
              return (
                <button
                  key={i}
                  className={`diag-option-card ${isRowStyle ? 'row-style' : ''}`}
                  onClick={() => handleOptionClick(opt.nextStep)}
                >
                  <div className="diag-icon-box">
                    <OptIcon size={isRowStyle ? 18 : 22} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <span className="diag-card-title">{opt.label}</span>
                    {opt.desc && <span className="diag-card-desc">{opt.desc}</span>}
                  </div>
                  {isRowStyle && <ChevronRight size={16} color="var(--color-text-muted)" style={{ marginLeft: 'auto' }} />}
                </button>
              );
            })}
          </div>

          {history.length > 0 && (
            <button
              onClick={handlePrev}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                fontSize: '12px',
                marginTop: '16px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 600,
              }}
            >
              <ArrowLeft size={13} /> 이전 질문으로
            </button>
          )}
        </div>
      ) : (
        // 결과 화면 (호버 줌 및 리프트 효과 탑재된 프리미엄 결과 카드)
        <div style={{ animation: 'fadeIn 0.4s ease' }}>
          <div className="diag-result-header">
            <div className="diag-badge">
              <Award size={12} />
              Recommended Solution
            </div>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 700, letterSpacing: '0.5px' }}>
              고객님께 추천하는 1:1 맞춤형 케어
            </span>
            <h4 className="diag-result-title">
              {results[currentStep as string].title}
            </h4>
          </div>

          <p
            style={{
              fontSize: '13.5px',
              color: 'var(--color-text-main)',
              lineHeight: '1.7',
              marginBottom: '20px',
              fontWeight: 400,
              padding: '0 4px'
            }}
          >
            {results[currentStep as string].desc}
          </p>

          <div
            style={{
              fontSize: '12px',
              color: 'var(--color-text-muted)',
              backgroundColor: 'var(--color-primary-light)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid var(--color-text-main)',
              marginBottom: '28px',
              lineHeight: '1.55',
              boxShadow: 'var(--shadow-subtle)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '6px' }}>
              <span>💡</span> 시술 핵심 가이드 & 팁
            </div>
            {results[currentStep as string].tip}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button className="btn btn-primary btn-glow" onClick={onStartConsulting}>
              💬 1:1 맞춤 견적 & 사진 상담받기
            </button>

            <a
              href="https://pf.kakao.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-glow"
              style={{
                backgroundColor: '#FEE500',
                color: '#191919',
                textDecoration: 'none',
              }}
            >
              <MessageCircle size={18} />
              카카오톡 실시간 빠른 상담
            </a>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
              <button
                onClick={handlePrev}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 600
                }}
              >
                <ArrowLeft size={13} />
                이전 질문으로
              </button>

              <button
                onClick={handleReset}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 600
                }}
              >
                <RotateCcw size={13} />
                처음부터 다시 하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
