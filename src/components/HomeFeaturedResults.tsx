import { ChevronRight, Star, UserRound } from 'lucide-react';
import { DIRECTOR } from '../constants/director';
import type { PortfolioItem } from '../constants/services';

interface HomeFeaturedResultsProps {
  portfolios: PortfolioItem[];
  onOpenGallery: () => void;
  onOpenProfile: () => void;
  onStartConsulting: () => void;
}

export function HomeFeaturedResults({
  portfolios,
  onOpenGallery,
  onOpenProfile,
  onStartConsulting,
}: HomeFeaturedResultsProps) {
  const featured = portfolios.slice(0, 3);

  return (
    <section className="home-featured">
      <div className="home-featured-head">
        <div>
          <p className="home-featured-eyebrow">Real Results</p>
          <h3>대표 케어 결과</h3>
          <p className="home-featured-desc">실제 시술 전후를 먼저 확인해 보세요.</p>
        </div>
        <button type="button" className="home-featured-link" onClick={onOpenGallery}>
          전체 보기 <ChevronRight size={14} />
        </button>
      </div>

      {featured.length > 0 ? (
        <div className="home-featured-scroll">
          {featured.map((item) => (
            <button
              key={item.id}
              type="button"
              className="home-featured-card"
              onClick={onOpenGallery}
            >
              <div className="home-featured-images">
                <div className="home-featured-half">
                  <img src={item.before_url} alt="" />
                  <span>BEFORE</span>
                </div>
                <div className="home-featured-half">
                  <img src={item.after_url} alt="" />
                  <span>AFTER</span>
                </div>
              </div>
              <div className="home-featured-meta">
                <span className="home-featured-cat">{item.category}</span>
                <strong>{item.title}</strong>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="home-featured-empty">곧 대표 결과가 등록됩니다.</div>
      )}

      <div className="home-trust-row">
        <button type="button" className="home-trust-card" onClick={onOpenProfile}>
          <img src={DIRECTOR.photo} alt={DIRECTOR.nameKo} className="home-trust-photo" />
          <div>
            <p className="home-trust-label">
              <UserRound size={12} /> 원장 소개
            </p>
            <strong>{DIRECTOR.nameKo} 원장</strong>
            <span>경력·수상 이력 보기</span>
          </div>
          <ChevronRight size={16} className="home-trust-chevron" />
        </button>

        <div className="home-trust-stats">
          <div>
            <strong className="notranslate">4.9★</strong>
            <span>평균 만족도</span>
          </div>
          <div>
            <strong className="notranslate">3K+</strong>
            <span>케어 건수</span>
          </div>
          <button type="button" className="home-trust-cta" onClick={onStartConsulting}>
            <Star size={12} />
            상담 신청
          </button>
        </div>
      </div>
    </section>
  );
}
