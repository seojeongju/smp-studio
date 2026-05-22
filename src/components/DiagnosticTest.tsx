import React, { useState } from 'react';
import { HelpCircle, ChevronRight, RotateCcw, MessageCircle } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    nextStep: number | string; // 다음 질문 ID 혹은 결과 Key
  }[];
}

export const DiagnosticTest: React.FC<{ onStartConsulting: () => void }> = ({ onStartConsulting }) => {
  const [currentStep, setCurrentStep] = useState<number | string>(1);
  const [history, setHistory] = useState<(number | string)[]>([]);

  // 자가진단 흐름 데이터 정의
  const steps: Record<number, Question> = {
    1: {
      id: 1,
      text: '가장 고민이거나 관심 있는 시술 부위는 어디인가요?',
      options: [
        { label: '✨ 눈썹 반영구 시술', nextStep: 2 },
        { label: '💇 두피 SMP / 헤어라인 커버', nextStep: 3 },
      ],
    },
    2: {
      id: 2,
      text: '이전에 눈썹 문신/반영구 시술을 받으신 적이 있나요?',
      options: [
        { label: '처음 받는 첫 시술입니다.', nextStep: 'eyebrow_new' },
        { label: '붉거나 푸른 잔흔이 남아 있습니다.', nextStep: 'eyebrow_cover' },
      ],
    },
    3: {
      id: 3,
      text: '어떤 형태의 두피 탈모/헤어라인 고민을 가지고 계시나요?',
      options: [
        { label: '정수리 또는 가르마 갈라짐 숱 보강', nextStep: 'smp_crown' },
        { label: 'M자 이마 보강 및 헤어라인 정돈', nextStep: 'smp_hairline' },
        { label: '민머리/삭발 두피 전체 커버 시술', nextStep: 'smp_full' },
      ],
    },
  };

  // 결과 데이터 정의
  const results: Record<string, { title: string; desc: string; tip: string }> = {
    eyebrow_new: {
      title: '자연 눈썹 (엠보 결) 또는 콤보 눈썹',
      desc: '잔흔이 없는 최상의 상태로, 본래 눈썹 결을 한 올 한 올 살리는 엠보 기법을 사용해 극도로 자연스러운 연출이 가능합니다. 이목구비를 조금 더 또렷하게 만들고 싶다면 결 표현에 섀도우 음영을 더하는 콤보 기법을 추천합니다.',
      tip: '시술 시간은 약 1시간 30분 소요되며, 1차 시술 후 4~6주 사이에 리터치를 통해 완성도를 높입니다.',
    },
    eyebrow_cover: {
      title: '잔흔 중화 & 커버업 콤보 눈썹',
      desc: '기존의 붉거나 붉푸른 반영구 잔흔이 남아 있는 상태입니다. 이 경우에는 단순 엠보 결 시술을 하면 잔흔이 가려지지 않아 어색할 수 있습니다. 보색 중화 시술을 거친 후, 밀도를 높여 덮어주는 수지(섀도우) 기법이 결합된 커버업 콤보 시술을 권장합니다.',
      tip: '정확한 잔흔 상태 파악을 위해 1:1 맞춤 견적 신청을 통해 잔흔 사진을 첨부해 주시면 더욱 정밀한 맞춤 상담이 가능합니다.',
    },
    smp_crown: {
      title: '정수리 / 가르마 미세 색소 요법 (SMP)',
      desc: '머리카락 사이로 비치는 하얀 두피 면적을 줄이기 위해 실제 모근 크기의 미세한 도트를 밀도 높게 표현하는 시술입니다. 가르마 방향이나 정수리 탈모 부위에 음영감을 주어 머리숱이 시각적으로 풍성해 보이는 효과가 탁월합니다.',
      tip: '진행 정도에 따라 통상 3~4회 차 나누어 시술이 진행되며, 일상생활이 바로 가능합니다.',
    },
    smp_hairline: {
      title: '헤어라인 쉐이딩 SMP 시술',
      desc: 'M자 이마 양 끝이나 불규칙한 헤어라인을 채워 얼굴형을 작고 갸름하게 잡아주는 시술입니다. 모근 결 방향에 맞춘 자연스러운 도트 분산 기법으로 이마 라인이 둥글고 자연스럽게 보이도록 연출합니다.',
      tip: '헤어라인 부위는 두피 중에서도 피부가 얇아 고도의 조절이 필요하므로 숙련된 마이크로 도팅이 필수적입니다.',
    },
    smp_full: {
      title: '디자인 민머리 삭발 SMP 커버',
      desc: '머리 전체에 모발이 없거나 삭발 스타일을 유지하시는 분들을 위한 토탈 디자인 시술입니다. 구강 구조, 이마 라인, 관자놀이 밸런스에 맞춰 가상 헤어라인 구획을 디자인하고 모근 밀도를 전반적으로 입체감 있게 채워 드립니다.',
      tip: '전체 커버는 정교한 톤 매칭이 필요하므로 시술 횟수가 4~5회 이상 필요할 수 있습니다.',
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

  return (
    <div className="card" style={{ border: '1px solid var(--color-primary)' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <HelpCircle size={20} color="var(--color-text-muted)" style={{ marginRight: '8px' }} />
        <span style={{ fontSize: '15px', fontWeight: 700 }}>1분 맞춤 시술 자가진단</span>
      </div>

      {!isResult ? (
        // 질문 화면
        <div>
          <p
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--color-text-main)',
              marginBottom: '20px',
              lineHeight: '1.4',
            }}
          >
            Q. {steps[currentStep as number].text}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {steps[currentStep as number].options.map((opt, i) => (
              <button
                key={i}
                className="btn btn-secondary"
                style={{
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                }}
                onClick={() => handleOptionClick(opt.nextStep)}
              >
                <span>{opt.label}</span>
                <ChevronRight size={16} />
              </button>
            ))}
          </div>

          {history.length > 0 && (
            <button
              onClick={handlePrev}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                fontSize: '12px',
                marginTop: '15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              ← 이전 질문으로
            </button>
          )}
        </div>
      ) : (
        // 결과 화면
        <div style={{ animation: 'fadeIn 0.4s ease' }}>
          <div
            style={{
              backgroundColor: 'var(--color-primary-light)',
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '16px',
            }}
          >
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              추천 시술 솔루션
            </span>
            <h4
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--color-text-main)',
                marginTop: '4px',
              }}
            >
              {results[currentStep as string].title}
            </h4>
          </div>

          <p
            style={{
              fontSize: '14px',
              color: 'var(--color-text-main)',
              lineHeight: '1.6',
              marginBottom: '14px',
            }}
          >
            {results[currentStep as string].desc}
          </p>

          <p
            style={{
              fontSize: '12px',
              color: 'var(--color-text-muted)',
              backgroundColor: '#fff',
              padding: '10px 12px',
              borderRadius: '8px',
              borderLeft: '3px solid var(--color-primary-dark)',
              marginBottom: '20px',
            }}
          >
            💡 <strong>시술 가이드:</strong> {results[currentStep as string].tip}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button className="btn btn-primary" onClick={onStartConsulting}>
              💬 1:1 맞춤 견적 & 사진 상담받기
            </button>

            <a
              href="https://pf.kakao.com" // 예시 링크
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                backgroundColor: '#FEE500',
                color: '#191919',
                textDecoration: 'none',
              }}
            >
              <MessageCircle size={18} style={{ marginRight: '6px' }} />
              카카오톡 실시간 빠른 상담
            </a>

            <button
              onClick={handleReset}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                fontSize: '12px',
                alignSelf: 'center',
                marginTop: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <RotateCcw size={12} />
              자가진단 다시 하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
