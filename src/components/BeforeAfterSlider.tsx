import React, { useState, useRef, useEffect } from 'react';
import { ChevronsLeftRight, Sparkles, ShieldCheck, Clock, ChevronRight } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  title: string;
  category: string;
  duration?: string;    // 케어 소요시간 (선택)
  point?: string;       // 핵심 디자인 포인트 (선택)
  index?: number;       // 순번 (1, 2, 3...)
  /** 이미지 원본 비율 (기본 4:3). 세로형 전후사진은 3/4 등으로 지정 */
  imageAspectRatio?: string;
  imageObjectFit?: 'cover' | 'contain';
  imageObjectPosition?: string;
  onConsult?: () => void;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  title,
  category,
  duration,
  point,
  index,
  imageAspectRatio = '4 / 3',
  imageObjectFit = 'cover',
  imageObjectPosition = 'center',
  onConsult,
}) => {
  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: imageObjectFit,
    objectPosition: imageObjectPosition,
    display: 'block',
    pointerEvents: 'none',
  };
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(2, Math.min(98, (x / rect.width) * 100));
    setSliderPosition(position);
    if (!hasInteracted) setHasInteracted(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault(); // 스크롤 방지
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      className="card"
      style={{ padding: 0, overflow: 'hidden', marginBottom: '20px' }}
    >
      {/* ── 카드 상단 헤더 영역 ── */}
      <div style={{
        padding: '16px 18px 14px',
        background: 'linear-gradient(135deg, var(--color-primary-light) 0%, rgba(255,255,255,0.6) 100%)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        {/* 순번 배지 */}
        {index !== undefined && (
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-text-main)',
            color: 'var(--color-primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 800,
            flexShrink: 0,
          }}>
            {String(index).padStart(2, '0')}
          </div>
        )}

        {/* 제목 + 카테고리 칩 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 className="notranslate" style={{
            fontSize: '14.5px',
            fontWeight: 700,
            color: 'var(--color-text-main)',
            margin: '0 0 5px 0',
            letterSpacing: '-0.3px',
            lineHeight: 1.35,
            wordBreak: 'keep-all', // 한글 어절 단위 줄바꿈
            overflowWrap: 'break-word',
          }}>
            {title}
          </h4>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '10.5px',
            fontWeight: 700,
            color: 'var(--color-text-main)',
            backgroundColor: 'var(--color-primary-dark)',
            padding: '3px 10px',
            borderRadius: '20px',
            letterSpacing: '0.3px',
          }}>
            <Sparkles size={9} />
            {category}
          </span>
        </div>
      </div>

      {/* ── 슬라이더 이미지 영역 ── */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: imageAspectRatio,
          overflow: 'hidden',
          userSelect: 'none',
          cursor: 'ew-resize',
          touchAction: 'none',
        }}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        {/* Before 이미지 (배경) */}
        <img
          src={beforeImage}
          alt="케어 전 Before"
          draggable={false}
          style={{
            position: 'absolute',
            inset: 0,
            ...imageStyle,
          }}
        />

        {/* After 이미지 (클리핑 레이어) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
            pointerEvents: 'none',
          }}
        >
          <img
            src={afterImage}
            alt="디자인 후 After"
            draggable={false}
            style={imageStyle}
          />
        </div>

        {/* BEFORE 라벨 */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          background: 'rgba(58,50,44,0.72)',
          backdropFilter: 'blur(4px)',
          color: '#fff',
          fontSize: '10px',
          fontWeight: 700,
          padding: '3px 8px',
          borderRadius: '6px',
          zIndex: 10,
          letterSpacing: '1px',
          pointerEvents: 'none',
        }}>
          BEFORE
        </div>

        {/* AFTER 라벨 */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          background: 'rgba(203,185,167,0.88)',
          backdropFilter: 'blur(4px)',
          color: 'var(--color-text-main)',
          fontSize: '10px',
          fontWeight: 700,
          padding: '3px 8px',
          borderRadius: '6px',
          zIndex: 10,
          letterSpacing: '1px',
          pointerEvents: 'none',
          // afterImage가 슬라이더 왼쪽에 표시되므로 left에 배치
        }}>
          AFTER ✦
        </div>

        {/* 드래그 바 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${sliderPosition}%`,
            width: '2px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, #fff 50%, rgba(255,255,255,0.4) 100%)',
            transform: 'translateX(-50%)',
            zIndex: 20,
            boxShadow: '0 0 12px rgba(0,0,0,0.25)',
            pointerEvents: 'none',
          }}
        >
          {/* 핸들 원형 버튼 */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '38px',
            height: '38px',
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            boxShadow: '0 4px 16px rgba(0,0,0,0.22)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgba(230,213,195,0.6)',
          }}>
            <ChevronsLeftRight size={16} color="var(--color-text-main)" strokeWidth={2.5} />
          </div>
        </div>

        {/* 인터랙션 힌트 오버레이 (처음 1회만 표시) */}
        {!hasInteracted && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 15,
          }}>
            <div style={{
              background: 'rgba(58,50,44,0.55)',
              backdropFilter: 'blur(4px)',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 600,
              padding: '7px 14px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              letterSpacing: '0.3px',
              animation: 'fadeIn 0.5s ease',
            }}>
              <ChevronsLeftRight size={13} />
              슬라이더를 좌우로 드래그해 보세요
            </div>
          </div>
        )}
      </div>

      {/* ── 카드 하단 인포 배지 행 ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: duration ? '1fr 1fr' : '1fr',
        borderTop: '1px solid var(--color-border)',
      }}>
        {/* 위생 칩 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px',
          padding: '10px 12px',
          borderRight: duration ? '1px solid var(--color-border)' : 'none',
        }}>
          <ShieldCheck size={12} color="var(--color-text-muted)" />
          <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            멸균 도구 안전 위생 준수
          </span>
        </div>

        {/* 소요시간 칩 */}
        {duration && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            padding: '10px 12px',
          }}>
            <Clock size={12} color="var(--color-text-muted)" />
            <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              {duration}
            </span>
          </div>
        )}
      </div>

      {/* ── 디자인 포인트 (있을 때만 표시) ── */}
      {point && (
        <div style={{
          padding: '11px 18px',
          borderTop: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-bg)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '7px',
        }}>
          <Sparkles size={12} color="var(--color-text-main)" style={{ marginTop: '2px', flexShrink: 0 }} />
          <span className="notranslate" style={{
            fontSize: '12px',
            color: 'var(--color-text-muted)',
            lineHeight: 1.55,
            fontWeight: 500,
            wordBreak: 'keep-all',
            overflowWrap: 'break-word',
          }}>
            {point}
          </span>
        </div>
      )}

      {onConsult && (
        <div style={{ padding: '0 16px 16px', borderTop: point ? undefined : '1px solid var(--color-border)' }}>
          <button
            type="button"
            onClick={onConsult}
            style={{
              width: '100%',
              marginTop: point ? 12 : 14,
              padding: '11px 14px',
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
            }}
          >
            이 시술 1:1 상담하기
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
