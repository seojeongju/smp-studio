import React, { useState } from 'react';
import { X, Star, Camera, Loader2 } from 'lucide-react';

interface ReviewFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ onClose, onSuccess }) => {
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [category, setCategory] = useState<string>('눈썹 디자인');
  const [comment, setComment] = useState<string>('');

  // 이미지 업로드 관련 상태
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [uploading1, setUploading1] = useState<boolean>(false);
  const [uploading2, setUploading2] = useState<boolean>(false);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 이미지 업로드 로직 (R2 연동)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, slot: 1 | 2) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 용량 제한 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 최대 5MB까지 업로드 가능합니다.');
      return;
    }

    if (slot === 1) setUploading1(true);
    else setUploading2(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'reviews');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json() as any;
      if (res.ok && data.success) {
        if (slot === 1) {
          setImage1(data.url);
        } else {
          setImage2(data.url);
        }
      } else {
        alert(data.error || '이미지 업로드에 실패했습니다.');
      }
    } catch (err) {
      console.error('업로드 서버 오류:', err);
      alert('서버와 통신 중 오류가 발생했습니다.');
    } finally {
      if (slot === 1) setUploading1(false);
      else setUploading2(false);
    }
  };

  // 폼 서브밋
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name || !password || !comment) {
      setErrorMessage('필수 작성란을 모두 채워주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          password,
          rating,
          category,
          comment,
          image_url_1: image1,
          image_url_2: image2,
        }),
      });

      const data = await res.json() as any;
      if (res.ok && data.success) {
        onSuccess();
        onClose();
      } else {
        setErrorMessage(data.error || '후기 등록에 실패했습니다.');
      }
    } catch (err) {
      setErrorMessage('서버와의 통신에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bottom-sheet-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
        {/* 상단 닫기 영역 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h3 className="section-title" style={{ fontSize: '18px', marginBottom: 0 }}>
            고객 리얼 후기 작성
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 작성자 & 비밀번호 (삭제용) */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">작성자명 *</label>
              <input
                type="text"
                className="form-input"
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={10}
                required
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">비밀번호(삭제용) *</label>
              <input
                type="password"
                className="form-input"
                placeholder="4자리 이상"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={4}
                required
              />
            </div>
          </div>

          {/* 시술 종류 & 평점 선택 */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div className="form-group" style={{ flex: 1.2 }}>
              <label className="form-label">이용하신 케어 *</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="눈썹 디자인">눈썹 디자인</option>
                <option value="브로우 메이크업">브로우 메이크업</option>
                <option value="두피 케어">두피 케어</option>
                <option value="헤어라인 디자인">헤어라인 디자인</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">케어 만족도 *</label>
              <div style={{ display: 'flex', gap: '4px', height: '42px', alignItems: 'center' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i + 1)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <Star
                      size={20}
                      fill={i < rating ? 'var(--color-text-main)' : 'none'}
                      color={i < rating ? 'var(--color-text-main)' : 'var(--color-primary-dark)'}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 리뷰 본문 */}
          <div className="form-group">
            <label className="form-label">솔직한 후기를 남겨주세요 *</label>
            <textarea
              className="form-textarea"
              placeholder="케어 결과, 원장님 친절도, 위생 관리 등 다른 고객들에게 도움 되는 솔직한 평가를 적어주세요. (최소 10자)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              minLength={10}
              required
            />
          </div>

          {/* 이미지 첨부 (2슬롯) */}
          <div className="form-group">
            <label className="form-label">케어 후기 사진 첨부 (최대 2장)</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {/* 이미지 슬롯 1 */}
              <div
                style={{
                  position: 'relative',
                  width: '76px',
                  height: '76px',
                  border: '1px dashed var(--color-primary-dark)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--color-card)',
                  cursor: 'pointer',
                  overflow: 'hidden',
                }}
              >
                {image1 ? (
                  <img src={image1} alt="업로드 이미지 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : uploading1 ? (
                  <Loader2 className="animate-spin" size={20} color="var(--color-text-muted)" />
                ) : (
                  <label htmlFor="img-upload-1" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Camera size={20} color="var(--color-text-muted)" />
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '4px' }}>사진 추가</span>
                  </label>
                )}
                <input
                  type="file"
                  id="img-upload-1"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 1)}
                  style={{ display: 'none' }}
                  disabled={uploading1}
                />
              </div>

              {/* 이미지 슬롯 2 */}
              <div
                style={{
                  position: 'relative',
                  width: '76px',
                  height: '76px',
                  border: '1px dashed var(--color-primary-dark)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--color-card)',
                  cursor: 'pointer',
                  overflow: 'hidden',
                }}
              >
                {image2 ? (
                  <img src={image2} alt="업로드 이미지 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : uploading2 ? (
                  <Loader2 className="animate-spin" size={20} color="var(--color-text-muted)" />
                ) : (
                  <label htmlFor="img-upload-2" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Camera size={20} color="var(--color-text-muted)" />
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '4px' }}>사진 추가</span>
                  </label>
                )}
                <input
                  type="file"
                  id="img-upload-2"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 2)}
                  style={{ display: 'none' }}
                  disabled={uploading2}
                />
              </div>
            </div>
          </div>

          {errorMessage && (
            <p
              style={{
                color: 'var(--color-danger)',
                fontSize: '12px',
                fontWeight: 600,
                marginBottom: '16px',
              }}
            >
              ⚠️ {errorMessage}
            </p>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              작성 취소
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1.5 }}
              disabled={submitting || uploading1 || uploading2}
            >
              {submitting ? '등록 중...' : '후기 등록 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
