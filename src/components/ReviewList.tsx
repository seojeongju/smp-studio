import React, { useState, useEffect } from 'react';
import { Star, Trash2, SlidersHorizontal } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  rating: number;
  category: string;
  comment: string;
  image_url_1: string | null;
  image_url_2: string | null;
  created_at: string;
}

interface ReviewListProps {
  refreshTrigger: boolean;
  onRefresh: () => void;
  onOpenWriteForm: () => void;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  refreshTrigger,
  onRefresh,
  onOpenWriteForm,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<string>('전체');
  const [sort, setSort] = useState<string>('latest'); // latest, highest

  // 삭제 모달 상태 관리
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deletePassword, setDeletePassword] = useState<string>('');
  const [deleteError, setDeleteError] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);

  // 리뷰 가져오기
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?category=${encodeURIComponent(category)}&sort=${sort}`);
      const data = await res.json() as any;
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error('리뷰 로드 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [category, sort, refreshTrigger]);

  // 리뷰 삭제 실행
  const handleDelete = async () => {
    if (!deleteId || !deletePassword) {
      setDeleteError('비밀번호를 입력해 주세요.');
      return;
    }

    setDeleting(true);
    setDeleteError('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteId, password: deletePassword }),
      });
      const data = await res.json() as any;

      if (res.ok && data.success) {
        // 모달 리셋 및 목록 갱신
        setDeleteId(null);
        setDeletePassword('');
        onRefresh();
      } else {
        setDeleteError(data.error || '삭제 처리에 실패했습니다.');
      }
    } catch (err) {
      setDeleteError('서버와의 통신 오류가 발생했습니다.');
    } finally {
      setDeleting(false);
    }
  };

  // 평점 별 렌더링
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={14}
        fill={i < rating ? 'var(--color-text-main)' : 'none'}
        color={i < rating ? 'var(--color-text-main)' : 'var(--color-primary-dark)'}
        style={{ marginRight: '1px' }}
      />
    ));
  };

  return (
    <div>
      {/* 필터 및 정렬 바 */}
      <div className="card" style={{ padding: '16px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <SlidersHorizontal size={16} color="var(--color-text-muted)" />
          <span style={{ fontSize: '13px', fontWeight: 700 }}>조회 필터</span>
        </div>

        {/* 카테고리 스크롤 칩 */}
        <div
          style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '8px',
            paddingBottom: '8px',
            marginBottom: '12px',
            scrollbarWidth: 'none',
          }}
        >
          {['전체', '눈썹 디자인', '브로우 메이크업', '두피 케어', '헤어라인 디자인'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                flexShrink: 0,
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid',
                borderColor: category === cat ? 'var(--color-text-main)' : 'var(--color-border)',
                backgroundColor: category === cat ? 'var(--color-text-main)' : 'var(--color-card)',
                color: category === cat ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'var(--transition-smooth)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 정렬 셀렉터 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            총 {reviews.length}개의 리얼 후기
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              fontSize: '12px',
              fontFamily: 'var(--font-family)',
              color: 'var(--color-text-main)',
              outline: 'none',
            }}
          >
            <option value="latest">최신 등록순</option>
            <option value="highest">평점 높은순</option>
          </select>
        </div>
      </div>

      {/* 후기 쓰기 유도 카드 */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary-light) 0%, #fff 100%)',
          border: '1px dashed var(--color-primary-dark)',
          textAlign: 'center',
          padding: '24px 20px',
        }}
      >
        <p style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>
          Beige Curve 디자인 케어를 받아보셨나요?
        </p>
        <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '14px' }}>
          소중한 솔직 리뷰를 남겨주시면 리터치 할인 혜택을 드려요.
        </p>
        <button
          className="btn btn-primary"
          style={{ width: 'auto', padding: '8px 20px', fontSize: '12px' }}
          onClick={onOpenWriteForm}
        >
          후기 작성하러 가기
        </button>
      </div>

      {/* 후기 목록 */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)' }}>
          후기를 불러오는 중입니다...
        </p>
      ) : reviews.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)' }}>
          등록된 후기가 없습니다. 첫 후기를 작성해 보세요!
        </p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="card" style={{ position: 'relative' }}>
            {/* 삭제 버튼 */}
            <button
              onClick={() => {
                setDeleteId(review.id);
                setDeleteError('');
              }}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
              }}
              aria-label="리뷰 삭제"
            >
              <Trash2 size={16} />
            </button>

            {/* 작성자 정보 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '14px' }}>{review.name}</span>
              <span
                style={{
                  fontSize: '10px',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-text-muted)',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  fontWeight: 600,
                }}
              >
                {review.category}
              </span>
            </div>

            {/* 별점 및 일자 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
              }}
            >
              <div style={{ display: 'flex' }}>{renderStars(review.rating)}</div>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>

            {/* 리뷰 본문 */}
            <p
              style={{
                fontSize: '13.5px',
                lineHeight: '1.6',
                color: 'var(--color-text-main)',
                whiteSpace: 'pre-line',
                marginBottom:
                  review.image_url_1 || review.image_url_2 ? '12px' : '0',
              }}
            >
              {review.comment}
            </p>

            {/* 첨부 이미지 레이아웃 */}
            {(review.image_url_1 || review.image_url_2) && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                {review.image_url_1 && (
                  <img
                    src={review.image_url_1}
                    alt="첨부 이미지 1"
                    style={{
                      width: '48%',
                      aspectRatio: '1',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      backgroundColor: 'var(--color-primary-light)',
                    }}
                  />
                )}
                {review.image_url_2 && (
                  <img
                    src={review.image_url_2}
                    alt="첨부 이미지 2"
                    style={{
                      width: '48%',
                      aspectRatio: '1',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      backgroundColor: 'var(--color-primary-light)',
                    }}
                  />
                )}
              </div>
            )}
          </div>
        ))
      )}

      {/* 리뷰 삭제 레이오버 모달 */}
      {deleteId && (
        <div className="bottom-sheet-overlay" onClick={() => setDeleteId(null)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-handle"></div>
            <h3 className="section-title" style={{ fontSize: '18px', marginBottom: '10px' }}>
              후기 삭제하기
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              후기 등록 시 설정한 비밀번호를 입력해 주세요.
            </p>

            <div className="form-group">
              <label className="form-label">비밀번호</label>
              <input
                type="password"
                className="form-input"
                placeholder="비밀번호 입력"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
              />
            </div>

            {deleteError && (
              <p
                style={{
                  color: 'var(--color-danger)',
                  fontSize: '12px',
                  fontWeight: 600,
                  marginBottom: '16px',
                }}
              >
                ⚠️ {deleteError}
              </p>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteId(null)}
                style={{ flex: 1 }}
              >
                취소
              </button>
              <button
                className="btn btn-primary"
                onClick={handleDelete}
                style={{ flex: 1, backgroundColor: 'var(--color-danger)', color: '#fff' }}
                disabled={deleting}
              >
                {deleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
