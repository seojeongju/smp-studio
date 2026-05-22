import { useState } from 'react';
import { BottomNav, type TabType } from './components/BottomNav';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { DiagnosticTest } from './components/DiagnosticTest';
import { CareGuide } from './components/CareGuide';
import { ReviewList } from './components/ReviewList';
import { ReviewForm } from './components/ReviewForm';
import { ConsultingForm } from './components/ConsultingForm';
import { ServicesInfo } from './components/ServicesInfo';
import { Calendar, PhoneCall, Sparkles, ShieldCheck } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // 모달 제어 상태
  const [isReviewFormOpen, setIsReviewFormOpen] = useState<boolean>(false);
  const [isConsultingOpen, setIsConsultingOpen] = useState<boolean>(false);

  // 리뷰 리스트 갱신 트리거
  const [refreshReviews, setRefreshReviews] = useState<boolean>(false);

  const triggerRefreshReviews = () => {
    setRefreshReviews((prev) => !prev);
  };

  // 비포애프터용 고품질 Unsplash 모정 이미지 데이터
  const beforeAfterPortfolio = [
    {
      before: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop', // 숱이 다소 정돈되지 않은 원본 얼굴
      after: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop',  // 결이 잡히고 또렷해진 눈썹
      title: '여성 자연눈썹 (엠보 결) 시술',
      category: '자연눈썹',
    },
    {
      before: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop', // 헤어 밀도가 낮은 헤어라인 영역
      after: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=600&auto=format&fit=crop',  // 톤 다운되어 숱이 풍성해 보이는 두피
      title: '정수리 탈모 보강 SMP 시술',
      category: '두피 SMP',
    },
    {
      before: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?q=80&w=600&auto=format&fit=crop', // 흐릿한 남자 눈썹 상태
      after: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',  // 단정하고 선명하게 윤곽이 잡힌 눈썹
      title: '남성 골격 맞춤 자연눈썹',
      category: '남자눈썹',
    },
  ];

  return (
    <div className="desktop-layout-wrapper">
      {/* 데스크톱 전용 브랜드 사이드 패널 (1024px 이상 대화면에서만 노출됨) */}
      <aside className="desktop-brand-panel">
        <div className="desktop-brand-content">
          <img src="/logo.png" alt="Grace Shop Premium Logo" className="desktop-brand-logo" />
          <h2 className="desktop-brand-title">Grace Shop</h2>
          <p className="desktop-brand-desc">
            본연의 아름다움을 찾아가는 여정,<br />
            그레이스 샵 반영구 눈썹 & 두피 SMP 스튜디오입니다.
          </p>
          
          <div className="desktop-info-card">
            <div className="desktop-info-item">
              <span className="info-label">시술 항목</span>
              <span className="info-value">엠보 자연눈썹 · 콤보눈썹 · 두피 SMP · 헤어라인 보강</span>
            </div>
            <div className="desktop-info-item">
              <span className="info-label">예약 안내</span>
              <span className="info-value">100% 프라이빗 1:1 사전 예약제 운영</span>
            </div>
            <div className="desktop-info-item">
              <span className="info-label">카카오톡 채널</span>
              <span className="info-value">@그레이스샵_반영구</span>
            </div>
          </div>

          <div className="desktop-qr-section">
            <p className="qr-title">간편 모바일 예약 및 문의</p>
            <div className="qr-links">
              <a
                href="https://booking.naver.com"
                target="_blank"
                rel="noopener noreferrer"
                className="qr-btn naver"
              >
                네이버 실시간 예약 바로가기
              </a>
              <a
                href="https://pf.kakao.com"
                target="_blank"
                rel="noopener noreferrer"
                className="qr-btn kakao"
              >
                카카오톡 1:1 채팅 문의
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* 모바일 폰 프레임 뷰포트 기둥 */}
      <div className="app-container">
        {/* 1. 상단 앱 헤더 */}
        <header className="app-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
            <img src="/logo.png" alt="Grace Shop Logo" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-primary-dark)' }} />
            <h1 className="brand-logo" style={{ fontSize: '18px', margin: 0 }}>
              Grace Shop
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a
              href="tel:010-0000-0000"
              style={{ color: 'var(--color-text-main)', display: 'flex', alignItems: 'center' }}
              aria-label="전화 문의"
            >
              <PhoneCall size={18} />
            </a>
            <button
              onClick={() => setIsConsultingOpen(true)}
              style={{
                background: 'var(--color-text-main)',
                color: 'var(--color-primary-light)',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Sparkles size={11} /> 1:1 상담
            </button>
          </div>
        </header>

        {/* 2. 메인 페이지 콘텐츠 영역 */}
        <main className="main-content">
          {/* === HOME TAB === */}
          {activeTab === 'home' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              {/* 감각적인 무드 히어로 카드 */}
              <div
                className="card"
                style={{
                  backgroundImage: `linear-gradient(rgba(58, 50, 44, 0.4), rgba(58, 50, 44, 0.75)), url('https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=600&auto=format&fit=crop')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  color: '#FAF6F0',
                  padding: '40px 24px',
                  borderRadius: 'var(--radius-lg)',
                  minHeight: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  marginBottom: '20px',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    backgroundColor: 'rgba(230, 213, 195, 0.25)',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    alignSelf: 'flex-start',
                    fontWeight: 600,
                    marginBottom: '8px',
                    letterSpacing: '1px',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  PREMIUM ARTISTRY
                </span>
                <h2 style={{ fontSize: '22px', fontWeight: 700, lineHeight: '1.3', marginBottom: '8px' }}>
                  우아함과 자연스러움의 시작<br />그레이스 샵 반영구 & SMP 스튜디오
                </h2>
                <p style={{ fontSize: '12px', opacity: 0.85, lineHeight: '1.5' }}>
                  인위적인 인위성을 배제하고 본래의 모근 결에 자연스럽게 톤을 덧입혀 가장 조화로운 결과를 선사합니다.
                </p>
              </div>

              {/* 브랜드 핵심 가치 */}
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  marginBottom: '24px',
                }}
              >
                <div
                  className="card"
                  style={{
                    flex: 1,
                    padding: '16px',
                    marginBottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <ShieldCheck size={24} color="var(--color-text-muted)" style={{ marginBottom: '8px' }} />
                  <span style={{ fontSize: '13px', fontWeight: 700, marginBottom: '2px' }}>철저한 1회용 위생</span>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                    안전 멸균 니들 사용 및 직후 즉시 폐기 원칙
                  </span>
                </div>
                <div
                  className="card"
                  style={{
                    flex: 1,
                    padding: '16px',
                    marginBottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Sparkles size={24} color="var(--color-text-muted)" style={{ marginBottom: '8px' }} />
                  <span style={{ fontSize: '13px', fontWeight: 700, marginBottom: '2px' }}>천연 무독성 색소</span>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                    자가검사번호 획득 정품 색소만 블렌딩 적용
                  </span>
                </div>
              </div>

              {/* 자가진단 퀴즈 연동 */}
              <DiagnosticTest onStartConsulting={() => setIsConsultingOpen(true)} />

              {/* 실시간 예약 경로 퀵 배너 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  marginTop: '10px',
                }}
              >
                <a
                  href="https://booking.naver.com" // 임시 네이버 예약
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ textDecoration: 'none', backgroundColor: '#03C75A', color: '#fff' }}
                >
                  <Calendar size={18} style={{ marginRight: '8px' }} />
                  네이버 예약으로 바로가기
                </a>
              </div>
            </div>
          )}

          {/* === GALLERY TAB === */}
          {activeTab === 'gallery' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h2 className="section-title">Before & After 포트폴리오</h2>
              <p className="section-subtitle">
                직접 중앙의 슬라이더 바를 좌우로 조절하여 드라마틱한 시술 전후 차이를 눈으로 확인해 보세요.
              </p>

              {beforeAfterPortfolio.map((item, idx) => (
                <BeforeAfterSlider
                  key={idx}
                  beforeImage={item.before}
                  afterImage={item.after}
                  title={item.title}
                  category={item.category}
                />
              ))}
            </div>
          )}

          {/* === REVIEWS TAB === */}
          {activeTab === 'reviews' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h2 className="section-title">고객 시술 후기</h2>
              <p className="section-subtitle">
                실제 그레이스 샵 시술 고객분들이 남겨주신 솔직한 생생 리뷰 목록입니다.
              </p>

              <ReviewList
                refreshTrigger={refreshReviews}
                onRefresh={triggerRefreshReviews}
                onOpenWriteForm={() => setIsReviewFormOpen(true)}
              />
            </div>
          )}

          {/* === SERVICES TAB === */}
          {activeTab === 'services' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h2 className="section-title">시술 항목 및 가격</h2>
              <p className="section-subtitle">
                시술 부위와 종류별 소요시간 및 관리 상세 기준표입니다.
              </p>

              <ServicesInfo onStartConsulting={() => setIsConsultingOpen(true)} />
            </div>
          )}

          {/* === CARE TAB === */}
          {activeTab === 'care' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h2 className="section-title">맞춤형 사후 관리 가이드</h2>
              <p className="section-subtitle">
                시술 후 탈각이 완전히 이루어지는 1주일 동안 아래 가이드라인을 꼭 참고하여 관리해 주세요.
              </p>

              <CareGuide />
            </div>
          )}
        </main>

        {/* 3. 모바일 하단 플로팅 퀵바 (클래스 기반 컨트롤) */}
        <div className="floating-quickbar">
          <div className="floating-quickbar-content">
            <button
              onClick={() => setIsConsultingOpen(true)}
              className="btn btn-primary"
              style={{
                flex: 1,
                borderRadius: '24px',
                padding: '10px 16px',
                fontSize: '12.5px',
                boxShadow: '0 8px 24px rgba(58,50,44,0.15)',
                border: '1px solid var(--color-primary-dark)',
              }}
            >
              📸 비대면 맞춤 사진 견적
            </button>
            <a
              href="https://booking.naver.com" // 예시용
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                flex: 1,
                backgroundColor: '#03C75A',
                color: '#fff',
                borderRadius: '24px',
                padding: '10px 16px',
                fontSize: '12.5px',
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(3,199,90,0.15)',
              }}
            >
              📅 네이버 예약 가기
            </a>
          </div>
        </div>

        {/* 4. 하단 고정 탭 바 */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* 5. 리뷰 작성 바텀 시트 */}
        {isReviewFormOpen && (
          <ReviewForm
            onClose={() => setIsReviewFormOpen(false)}
            onSuccess={triggerRefreshReviews}
          />
        )}

        {/* 6. 1:1 사진 견적 신청 바텀 시트 */}
        {isConsultingOpen && (
          <ConsultingForm onClose={() => setIsConsultingOpen(false)} />
        )}
      </div>
    </div>
  );
}

export default App;
