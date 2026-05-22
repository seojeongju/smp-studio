import React, { useState, useRef, useEffect } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  title: string;
  category: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  title,
  category,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 to 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
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
    <div className="card" style={{ padding: '12px', overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
        }}
      >
        <span
          style={{
            fontSize: '14px',
            fontWeight: 700,
            color: 'var(--color-text-main)',
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontSize: '11px',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-text-muted)',
            padding: '2px 8px',
            borderRadius: '12px',
            fontWeight: 600,
          }}
        >
          {category}
        </span>
      </div>

      {/* 비포 애프터 컨테이너 */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4 / 3',
          overflow: 'hidden',
          borderRadius: 'var(--radius-md)',
          userSelect: 'none',
          cursor: 'ew-resize',
        }}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        {/* Before 이미지 (아래 깔리는 백그라운드) */}
        <img
          src={beforeImage}
          alt="Before 시술 전"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            background: 'rgba(58, 50, 44, 0.7)',
            color: '#fff',
            fontSize: '11px',
            padding: '2px 6px',
            borderRadius: '4px',
            zIndex: 10,
          }}
        >
          BEFORE
        </div>

        {/* After 이미지 (클리핑으로 위를 덮음) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
            pointerEvents: 'none',
          }}
        >
          <img
            src={afterImage}
            alt="After 시술 후"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'var(--color-primary-dark)',
            color: 'var(--color-text-main)',
            fontSize: '11px',
            fontWeight: 700,
            padding: '2px 6px',
            borderRadius: '4px',
            zIndex: 10,
          }}
        >
          AFTER
        </div>

        {/* 드래그 핸들 바 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${sliderPosition}%`,
            width: '2px',
            backgroundColor: '#ffffff',
            transform: 'translateX(-50%)',
            zIndex: 20,
            boxShadow: '0 0 10px rgba(0,0,0,0.3)',
            pointerEvents: 'none',
          }}
        >
          {/* 중앙 서클 핸들 */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '32px',
              height: '32px',
              backgroundColor: '#ffffff',
              borderRadius: '50%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: 'var(--color-text-main)',
              fontWeight: 'bold',
            }}
          >
            ↔
          </div>
        </div>
      </div>
    </div>
  );
};
