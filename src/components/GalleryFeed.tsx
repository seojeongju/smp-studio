import { useEffect, useMemo, useState } from 'react';
import { Image as ImageIcon, Loader2, X } from 'lucide-react';
import type { GalleryImage } from '../constants/services';

interface GalleryFeedProps {
  onStartConsulting?: () => void;
}

export function GalleryFeed({ onStartConsulting }: GalleryFeedProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('전체');
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/gallery');
        const data = await res.json();
        if (!cancelled && data?.images) {
          setImages(data.images);
        }
      } catch {
        // empty state
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(
    () => ['전체', ...Array.from(new Set(images.map((img) => img.category)))],
    [images]
  );

  const filtered =
    category === '전체' ? images : images.filter((img) => img.category === category);

  return (
    <div className="gallery-feed" style={{ animation: 'fadeIn 0.3s ease' }}>
      <div className="gallery-feed-hero">
        <span className="gallery-feed-badge">Studio Gallery</span>
        <h2>시술 갤러리</h2>
        <p>
          그레이스샵의 실제 시술·디자인 사진을 모았습니다.
          <br />
          관심 있는 스타일을 찾아보세요.
        </p>
      </div>

      <div className="gallery-filters" role="tablist" aria-label="갤러리 카테고리">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={category === cat}
            className={`gallery-filter-chip${category === cat ? ' active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="gallery-empty">
          <Loader2 size={18} className="admin-spin" />
          <span style={{ marginLeft: 8 }}>갤러리 불러오는 중…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="gallery-empty">
          <ImageIcon size={28} style={{ marginBottom: 10, opacity: 0.5 }} />
          <p>아직 등록된 시술 사진이 없습니다.</p>
          {onStartConsulting && (
            <button type="button" className="btn btn-primary" style={{ marginTop: 14, width: 'auto' }} onClick={onStartConsulting}>
              시술 상담 신청하기
            </button>
          )}
        </div>
      ) : (
        <div className="gallery-grid">
          {filtered.map((img) => (
            <button
              key={img.id}
              type="button"
              className="gallery-grid-item"
              onClick={() => setSelected(img)}
            >
              <img src={img.image_url} alt={img.title || img.category} loading="lazy" />
              <div className="gallery-grid-overlay">
                <span>{img.category}</span>
                {img.title && <strong>{img.title}</strong>}
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="gallery-lightbox" onClick={() => setSelected(null)}>
          <div className="gallery-lightbox-panel" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="gallery-lightbox-close"
              onClick={() => setSelected(null)}
              aria-label="닫기"
            >
              <X size={18} />
            </button>
            <img src={selected.image_url} alt={selected.title || selected.category} />
            <div className="gallery-lightbox-meta">
              <span className="gallery-filter-chip active">{selected.category}</span>
              {selected.title && <h3>{selected.title}</h3>}
              {selected.caption && <p>{selected.caption}</p>}
              {onStartConsulting && (
                <button type="button" className="btn btn-primary" onClick={onStartConsulting}>
                  이 스타일로 상담하기
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
