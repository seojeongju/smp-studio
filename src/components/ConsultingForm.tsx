import React, { useState } from 'react';
import { X, Camera, Loader2, CalendarRange } from 'lucide-react';
import { NaverTalkButton } from './NaverTalkButton';
import { isNaverTalkConfigured } from '../constants/naver';

interface ConsultingFormProps {
  onClose: () => void;
}

export const ConsultingForm: React.FC<ConsultingFormProps> = ({ onClose }) => {
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [service, setService] = useState<string>('눈썹 디자인');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('11:00');
  const [hasTattoo, setHasTattoo] = useState<boolean>(false);
  const [note, setNote] = useState<string>('');

  // R2 이미지 업로드 상태
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 휴대폰 번호 하이픈 자동 포맷팅
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    let formattedVal = rawVal;
    if (rawVal.length > 3 && rawVal.length <= 7) {
      formattedVal = `${rawVal.slice(0, 3)}-${rawVal.slice(3)}`;
    } else if (rawVal.length > 7) {
      formattedVal = `${rawVal.slice(0, 3)}-${rawVal.slice(3, 7)}-${rawVal.slice(7, 11)}`;
    }
    setPhone(formattedVal);
  };

  // 사진 업로드 (R2 연동)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('이미지는 최대 5MB까지 첨부할 수 있습니다.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'consulting');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json() as any;
      if (res.ok && data.success) {
        setImageUrl(data.url);
      } else {
        alert(data.error || '이미지 업로드에 실패했습니다.');
      }
    } catch (err) {
      console.error('업로드 실패:', err);
      alert('업로드 중 통신 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  // 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name || !phone || !service || !date || !time) {
      setErrorMessage('필수 정보를 모두 입력해 주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: name,
          phone,
          service_type: service,
          preferred_date: date,
          preferred_time: time,
          has_previous_tattoo: hasTattoo,
          note,
          image_url: imageUrl,
        }),
      });

      const data = await res.json() as any;
      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setErrorMessage(data.error || '상담 문의 등록에 실패했습니다.');
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
        {/* 상단 닫기 헤더 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h3 className="section-title" style={{ fontSize: '18px', marginBottom: 0 }}>
            1:1 맞춤 케어 & 견적 상담 신청
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {success ? (
          // 성공 시 노출할 안내 화면
          <div style={{ textAlign: 'center', padding: '10px 5px', animation: 'fadeIn 0.3s ease' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-light)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                color: 'var(--color-text-main)',
              }}
            >
              <CalendarRange size={30} />
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>상담 신청 접수 완료!</h4>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--color-text-muted)',
                lineHeight: '1.6',
                marginBottom: '20px',
              }}
            >
              입력해주신 연락처로 원장님이 직접 상태 검토 후<br />
              빠른 시간 내에 네이버 톡톡 또는 문자로 연락해 드립니다.
            </p>

            {/* 성공 화면 내 네이버 톡톡 연동 카드 */}
            {isNaverTalkConfigured() && (
            <div style={{
              backgroundColor: 'var(--color-bg)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px 14px',
              marginBottom: '24px',
              border: '1px solid var(--color-border)',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', margin: '0 0 12px 0', lineHeight: 1.5, fontWeight: 500 }}>
                더 빠른 확답 또는 추가 상세 사진 발송은<br />
                그레이스샵 네이버 톡톡을 이용해 주세요.
              </p>
              <NaverTalkButton
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: '#03C75A',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  width: '100%',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(3,199,90,0.18)',
                  textDecoration: 'none',
                }}
              >
                💬 그레이스샵 톡톡 바로 문의
              </NaverTalkButton>
            </div>
            )}

            <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
              확인 후 닫기
            </button>
          </div>
        ) : (
          // 일반 입력 폼 화면
          <>
            {/* 네이버 톡톡 3초 간편 상담 빠른 배너 */}
            {isNaverTalkConfigured() && (
            <div style={{
              backgroundColor: '#F3FBF6',
              border: '1px solid rgba(3, 199, 90, 0.25)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 14px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span style={{ fontSize: '9px', fontWeight: 800, backgroundColor: '#03C75A', color: '#fff', padding: '1.5px 5px', borderRadius: '3px', letterSpacing: '0.5px' }}>FAST</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-main)' }}>네이버 톡톡 3초 간편상담</span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.4 }}>
                  폼 작성이 번거로우시다면 톡톡으로 바로 케어 문의가 가능합니다.
                </p>
              </div>
              <NaverTalkButton
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  backgroundColor: '#03C75A',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  flexShrink: 0,
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(3,199,90,0.2)',
                  textDecoration: 'none',
                }}
              >
                💬 상담 시작
              </NaverTalkButton>
            </div>
            )}

            <form onSubmit={handleSubmit}>
            {/* 이름 및 연락처 */}
            <div className="form-group">
              <label className="form-label">고객명 *</label>
              <input
                type="text"
                className="form-input"
                placeholder="성함을 입력하세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">연락처 *</label>
              <input
                type="tel"
                className="form-input"
                placeholder="010-0000-0000"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={13}
                required
              />
            </div>

            {/* 케어 종류 선택 */}
            <div className="form-group">
              <label className="form-label">관심 있는 케어 *</label>
              <select
                className="form-select"
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                <option value="눈썹 디자인">눈썹 디자인 (엠보 결 기법)</option>
                <option value="브로우 메이크업">브로우 메이크업 (맞춤형 디자인)</option>
                <option value="두피 케어">두피 케어 (가르마/정수리 밀도 보강)</option>
                <option value="헤어라인 디자인">헤어라인 디자인 (이마 쉐이딩 디자인)</option>
              </select>
            </div>

            {/* 희망 날짜 & 시간 */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="form-group" style={{ flex: 1.2 }}>
                <label className="form-label">희망 예약 날짜 *</label>
                <input
                  type="date"
                  className="form-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]} // 오늘 이후만 선택 가능
                  required
                />
              </div>
              <div className="form-group" style={{ flex: 0.8 }}>
                <label className="form-label">희망 예약 시간 *</label>
                <select
                  className="form-select"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                >
                  <option value="10:00">10:00</option>
                  <option value="11:30">11:30</option>
                  <option value="13:00">13:00</option>
                  <option value="14:30">14:30</option>
                  <option value="16:00">16:00</option>
                  <option value="17:30">17:30</option>
                  <option value="19:00">19:00</option>
                </select>
              </div>
            </div>

            {/* 이전 잔흔 유무 */}
            <div className="form-group">
              <label className="form-label">이전 디자인 흔적(잔흔)이나 탈모 여부 *</label>
              <div style={{ display: 'flex', gap: '16px', marginTop: '4px' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', fontSize: '14px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    checked={hasTattoo === true}
                    onChange={() => setHasTattoo(true)}
                    style={{ marginRight: '6px', accentColor: 'var(--color-text-main)' }}
                  />
                  있음 (흔적 있음)
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', fontSize: '14px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    checked={hasTattoo === false}
                    onChange={() => setHasTattoo(false)}
                    style={{ marginRight: '6px', accentColor: 'var(--color-text-main)' }}
                  />
                  없음 (완전 첫 케어)
                </label>
              </div>
            </div>

            {/* 잔흔/탈모 부위 사진 첨부 */}
            <div className="form-group">
              <label className="form-label">케어 부위 사진 첨부 (선택)</label>
              <div
                style={{
                  position: 'relative',
                  width: '100px',
                  height: '100px',
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
                {imageUrl ? (
                  <img src={imageUrl} alt="상담용 이미지" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : uploading ? (
                  <Loader2 className="animate-spin" size={24} color="var(--color-text-muted)" />
                ) : (
                  <label htmlFor="consult-img" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Camera size={24} color="var(--color-text-muted)" />
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '6px' }}>부위 사진 추가</span>
                  </label>
                )}
                <input
                  type="file"
                  id="consult-img"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  disabled={uploading}
                />
              </div>
              <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                * 눈썹 잔흔이나 두피 상태 사진을 선명하게 올려주시면 정확한 실시간 견적 상담이 가능합니다.
              </p>
            </div>

            {/* 상세 상담 내용 */}
            <div className="form-group">
              <label className="form-label">상세 문의 내용</label>
              <textarea
                className="form-textarea"
                placeholder="현재 탈모 고민이나 원하시는 눈썹 형태 등 자유롭게 기재해 주세요."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={300}
              />
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

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
                닫기
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1.5 }}
                disabled={submitting || uploading}
              >
                {submitting ? '신청 전송 중...' : '견적 상담 신청하기'}
              </button>
            </div>
          </form>
          </>
        )}
      </div>
    </div>
  );
};
