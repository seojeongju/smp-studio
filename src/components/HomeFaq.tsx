import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { SEO_FAQS } from '../constants/seo';

/** 홈 노출 FAQ — AEO(답변 엔진)·검색 스니펫용 공개 콘텐츠 */
export function HomeFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="card hover-lift" style={{ marginBottom: '16px' }} aria-labelledby="home-faq-title">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <HelpCircle size={18} color="var(--color-text-main)" aria-hidden />
        <h2
          id="home-faq-title"
          style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--color-text-main)' }}
        >
          자주 묻는 질문
        </h2>
      </div>
      <p style={{ margin: '0 0 12px', fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
        위치·시술·예약·원장 소개를 한눈에 확인하세요.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {SEO_FAQS.map((faq, index) => {
          const open = openIndex === index;
          return (
            <div
              key={faq.question}
              style={{
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-bg)',
                overflow: 'hidden',
              }}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : index)}
                aria-expanded={open}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  padding: '12px 14px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: 'var(--color-text-main)',
                  fontSize: '13px',
                  fontWeight: 700,
                  lineHeight: 1.45,
                }}
              >
                <span>{faq.question}</span>
                <ChevronDown
                  size={16}
                  style={{
                    flexShrink: 0,
                    transform: open ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s ease',
                    color: 'var(--color-text-muted)',
                  }}
                  aria-hidden
                />
              </button>
              {open && (
                <div
                  style={{
                    padding: '0 14px 12px',
                    fontSize: '12px',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.65,
                  }}
                >
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
