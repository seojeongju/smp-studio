import { useEffect, useState } from 'react';
import { ChevronRight, Star } from 'lucide-react';
import { applyReviewJsonLd, type SeoReview } from '../utils/reviewSeo';

interface HomeReviewsProps {
  onOpenReviews: () => void;
}

export function HomeReviews({ onOpenReviews }: HomeReviewsProps) {
  const [reviews, setReviews] = useState<SeoReview[]>([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch('/api/reviews?limit=6&sort=highest');
        if (!res.ok) return;
        const data = (await res.json()) as { success?: boolean; reviews?: SeoReview[] };
        if (cancelled || !data.success || !data.reviews) return;
        setReviews(data.reviews.slice(0, 3));
        applyReviewJsonLd(data.reviews);
      } catch {
        /* ignore */
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className="home-reviews" aria-labelledby="home-reviews-title">
      <div className="home-featured-head">
        <div>
          <p className="home-featured-eyebrow">Customer Voices</p>
          <h3 id="home-reviews-title">고객 이용 후기</h3>
          <p className="home-featured-desc">실제 시술 고객이 남긴 생생한 리뷰입니다.</p>
        </div>
        <button type="button" className="home-featured-link" onClick={onOpenReviews}>
          전체 보기 <ChevronRight size={14} />
        </button>
      </div>

      <div className="home-reviews-list">
        {reviews.map((review) => (
          <article key={`${review.name}-${review.created_at}`} className="home-review-item">
            <div className="home-review-top">
              <strong>{review.name}</strong>
              <span className="home-review-cat">{review.category}</span>
            </div>
            <div className="home-review-stars" aria-label={`${review.rating}점`}>
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  size={12}
                  fill={i < review.rating ? 'currentColor' : 'none'}
                  strokeWidth={i < review.rating ? 0 : 1.5}
                />
              ))}
            </div>
            <p>{review.comment}</p>
            <time dateTime={review.created_at}>
              {new Date(
                review.created_at.includes('T')
                  ? review.created_at
                  : review.created_at.replace(' ', 'T')
              ).toLocaleDateString('ko-KR')}
            </time>
          </article>
        ))}
      </div>

      {/* 크롤러가 해시 없이도 후기 페이지를 따라갈 수 있도록 */}
      <p className="home-reviews-seo-link">
        <a href="/reviews">고객 후기 전체 목록 (검색용 페이지)</a>
      </p>
    </section>
  );
}
