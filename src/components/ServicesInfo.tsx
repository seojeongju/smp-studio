import { useEffect, useState } from 'react';
import {
  AlertCircle,
  ChevronRight,
  Info,
  Loader2,
  Sparkles,
} from 'lucide-react';
import {
  FALLBACK_PRICE_CATEGORIES,
  SERVICE_PRICE_NOTICE,
  groupPricesByCategory,
  type PriceCategory,
  type ServicePrice,
} from '../constants/services';
import { formatPriceDisplay } from '../utils/priceFormat';

interface ServicesInfoProps {
  onStartConsulting: () => void;
}

export function ServicesInfo({ onStartConsulting }: ServicesInfoProps) {
  const [categories, setCategories] = useState<PriceCategory[]>(FALLBACK_PRICE_CATEGORIES);
  const [notice, setNotice] = useState(SERVICE_PRICE_NOTICE);
  const [activeCategory, setActiveCategory] = useState(FALLBACK_PRICE_CATEGORIES[0].id);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch('/api/prices');
        const data = await res.json();
        if (!res.ok || !data.prices?.length) return;

        const grouped = groupPricesByCategory(data.prices as ServicePrice[]);
        if (!cancelled && grouped.length) {
          setCategories(grouped);
          setActiveCategory(grouped[0].id);
          if (data.notice) setNotice(data.notice);
        }
      } catch {
        // 폴백 유지
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const current = categories.find((c) => c.id === activeCategory) || categories[0];

  return (
    <div className="services-page">
      <div className="services-intro">
        <span className="services-intro-badge">Price Guide</span>
        <p className="services-intro-text">
          그레이스샵 시술별 기준 단가입니다. 부위·면적에 따라 최종 금액이 달라질 수 있으며,
          정확한 견적은 1:1 상담으로 안내드립니다.
        </p>
      </div>

      {loading && (
        <div className="services-loading">
          <Loader2 size={16} className="admin-spin" />
          <span>단가표 불러오는 중…</span>
        </div>
      )}

      <div className="services-tabs" role="tablist" aria-label="시술 카테고리">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`services-tab${isActive ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {current && (
        <section className="services-price-card" aria-labelledby="services-price-title">
          <header className="services-price-head">
            <div>
              <p className="services-price-subtitle">{current.subtitle}</p>
              <h3 id="services-price-title" className="services-price-title">
                {current.label}
              </h3>
            </div>
            <span className="services-price-count">{current.items.length}개 항목</span>
          </header>

          <ul className="services-price-list">
            {current.items.map((item) => (
              <li key={item.id} className="services-price-row">
                <div className="services-price-meta">
                  <div className="services-price-name-row">
                    <span className="services-price-name">{item.name}</span>
                    {item.popular && <span className="services-popular-tag">인기</span>}
                    {item.kind === 'from' && <span className="services-from-tag">상담가</span>}
                  </div>
                  {item.note && <p className="services-price-note">{item.note}</p>}
                </div>
                <div className="services-price-value notranslate">
                  <strong>{formatPriceDisplay(item.priceLabel, item.kind)}</strong>
                </div>
              </li>
            ))}
          </ul>

          <div className="services-vat-notice">
            <Info size={14} />
            <span>{notice}</span>
          </div>
        </section>
      )}

      <div className="services-tips">
        <div className="services-tip">
          <span className="services-tip-dot" />
          <p>
            <strong>고정가</strong>는 표기 금액 기준이며, <strong>원~</strong> 표기는 최소 시작가입니다.
          </p>
        </div>
        <div className="services-tip">
          <span className="services-tip-dot" />
          <p>두피·문신제거 등 면적형 시술은 사진 상담 후 최종 견적이 확정됩니다.</p>
        </div>
      </div>

      <div className="services-cta card">
        <div className="services-cta-icon">
          <AlertCircle size={22} />
        </div>
        <p className="services-cta-title">정확한 맞춤 견적이 필요하신가요?</p>
        <p className="services-cta-desc">
          부위 상태와 원하시는 디자인에 따라 금액이 달라질 수 있습니다.
          <br />
          사진 한 장으로 1:1 맞춤 견적을 받아보세요.
        </p>
        <button type="button" className="btn btn-secondary services-cta-btn" onClick={onStartConsulting}>
          <Sparkles size={14} />
          사진 1:1 맞춤 견적 받기
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
