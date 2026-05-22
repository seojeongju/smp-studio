import { useState, useEffect } from 'react';
import { BottomNav, type TabType } from './components/BottomNav';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { DiagnosticTest } from './components/DiagnosticTest';
import { CareGuide } from './components/CareGuide';
import { ReviewList } from './components/ReviewList';
import { ReviewForm } from './components/ReviewForm';
import { ConsultingForm } from './components/ConsultingForm';
import { ServicesInfo } from './components/ServicesInfo';
import { Calendar, PhoneCall, Sparkles, ShieldCheck, MapPin, Clock, MessageSquare, Award, ChevronLeft } from 'lucide-react';

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

  // activeTab 변경 시 히스토리에 푸시하는 함수
  const changeTab = (tab: TabType) => {
    setActiveTab(tab);
    window.history.pushState({ tab }, '', `#${tab}`);
  };

  // 모달 열기 래퍼
  const openConsulting = () => {
    setIsConsultingOpen(true);
    window.history.pushState({ modal: 'consulting', tab: activeTab }, '', `#${activeTab}`);
  };

  const openReviewForm = () => {
    setIsReviewFormOpen(true);
    window.history.pushState({ modal: 'reviewForm', tab: activeTab }, '', `#${activeTab}`);
  };

  // 모달 닫기 래퍼 (직접 닫을 때도 history.back()을 호출하여 popstate에서 상태 일괄 닫기 처리하도록 유도)
  const closeConsulting = () => {
    if (isConsultingOpen) {
      window.history.back();
    }
  };

  const closeReviewForm = () => {
    if (isReviewFormOpen) {
      window.history.back();
    }
  };

  // 마운트 시 초기 히스토리 상태 설정 및 popstate 이벤트 리스너 등록
  useEffect(() => {
    const initialTab = (window.location.hash.replace('#', '') as TabType) || 'home';
    const validTabs: TabType[] = ['home', 'gallery', 'reviews', 'services', 'care'];
    const targetTab = validTabs.includes(initialTab) ? initialTab : 'home';

    window.history.replaceState({ tab: targetTab }, '', `#${targetTab}`);
    setActiveTab(targetTab);

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;

      // 1. 모달이 열려 있었다면 일괄 닫기
      setIsConsultingOpen(false);
      setIsReviewFormOpen(false);

      // 2. 탭 복원
      if (state && state.tab) {
        setActiveTab(state.tab);
      } else {
        // state가 만료되었거나 없을 시 해시값 기반 복원
        const hashTab = (window.location.hash.replace('#', '') as TabType);
        if (validTabs.includes(hashTab)) {
          setActiveTab(hashTab);
        } else {
          setActiveTab('home');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 비포애프터 포트폴리오 데이터 (duration·point 추가)
  const beforeAfterPortfolio = [
    {
      before: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop',
      after: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop',
      title: '여성 자연눈썹 엠보 결 시술',
      category: '자연눈썹',
      duration: '90분 소요',
      point: '모근 결을 한 올씩 표현하는 엠보 기법으로 지극히 자연스러운 눈썹 결을 완성했습니다.',
    },
    {
      before: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop',
      after: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=600&auto=format&fit=crop',
      title: '정수리 탈모 보강 SMP',
      category: '두피 SMP',
      duration: '세션당 120분',
      point: '실제 모근 크기와 동일한 초미세 도팅으로 두피의 빈틈을 자연스럽게 채웠습니다.',
    },
    {
      before: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?q=80&w=600&auto=format&fit=crop',
      after: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
      title: '남성 골격 맞춤 자연눈썹',
      category: '남자눈썹',
      duration: '90분 소요',
      point: '두상 골격과 근육 움직임을 분석해 과장되지 않은 정돈된 남성 눈썹을 디자인했습니다.',
    },
  ];

  return (
    <div className="desktop-layout-wrapper">
      {/* 데스크톱 전용 브랜드 사이드 패널 (1024px 이상 대화면에서만 노출됨) */}
      <aside className="desktop-brand-panel">
        <div className="desktop-brand-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img src="/logo.png" alt="Grace Shop Premium Logo" className="desktop-brand-logo" />
            <div>
              <h2 className="desktop-brand-title" style={{ margin: 0, paddingBottom: '4px' }}>Grace Shop</h2>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 700, letterSpacing: '1px' }}>PREMIUM BEAUTY STUDIO</span>
            </div>
          </div>
          
          <p className="desktop-brand-desc">
            본연의 아름다움을 정교하게 다듬어가는 여정,<br />
            그레이스 샵 반영구 눈썹 & 두피 SMP 스튜디오입니다.
          </p>
          
          <div className="desktop-info-card glass-panel card hover-lift">
            <div className="desktop-info-item" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '12px' }}>
              <Award size={20} color="var(--color-text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <span className="info-label">대표 시술 항목</span>
                <span className="info-value">엠보 자연눈썹 · 콤보눈썹 · 두피 SMP · 헤어라인 밀도 보강</span>
              </div>
            </div>
            <div className="desktop-info-item" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '12px' }}>
              <Clock size={20} color="var(--color-text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <span className="info-label">예약제 운영 방식</span>
                <span className="info-value">100% 프라이빗 1:1 사전 예약제 운영</span>
              </div>
            </div>
            <div className="desktop-info-item" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '12px' }}>
              <MapPin size={20} color="var(--color-text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <span className="info-label">스튜디오 주소</span>
                <span className="info-value">서울 마포구 공덕역 도보 3분 거리 (무료 주차 제공)</span>
              </div>
            </div>
          </div>

          <div className="desktop-qr-section">
            <p className="qr-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={16} /> 실시간 간편 예약 및 문의
            </p>
            <div className="qr-links">
              <a
                href="https://booking.naver.com"
                target="_blank"
                rel="noopener noreferrer"
                className="qr-btn naver"
                style={{ gap: '8px', boxShadow: '0 4px 12px rgba(3,199,90,0.1)' }}
              >
                <Calendar size={16} /> 네이버 실시간 예약 바로가기
              </a>
              <a
                href="https://pf.kakao.com"
                target="_blank"
                rel="noopener noreferrer"
                className="qr-btn kakao"
                style={{ gap: '8px', boxShadow: '0 4px 12px rgba(254,229,0,0.15)' }}
              >
                <MessageSquare size={16} /> 카카오톡 1:1 채팅 문의
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* 모바일 폰 프레임 뷰포트 기둥 */}
      <div className="app-container">
        {/* 1. 상단 앱 헤더 */}
        <header className="app-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {activeTab !== 'home' && (
              <button
                onClick={() => window.history.back()}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-main)',
                  padding: '4px',
                  marginRight: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="뒤로가기"
              >
                <ChevronLeft size={22} />
              </button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => changeTab('home')}>
              <img src="/logo.png" alt="Grace Shop Logo" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-primary-dark)' }} />
              <h1 className="brand-logo" style={{ fontSize: '18px', margin: 0 }}>
                Grace Shop
              </h1>
            </div>
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
              onClick={openConsulting}
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
              {/* 감각적인 무드 히어로 카드 (호버 줌인 효과 적용) */}
              <div className="hero-zoom-card">
                <div 
                  className="hero-zoom-bg" 
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=600&auto=format&fit=crop')` }}
                />
                <div className="hero-zoom-overlay" />
                <div className="hero-zoom-content">
                  <span
                    style={{
                      fontSize: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      alignSelf: 'flex-start',
                      fontWeight: 700,
                      marginBottom: '10px',
                      letterSpacing: '1.5px',
                      backdropFilter: 'blur(4px)',
                      display: 'inline-block',
                      textTransform: 'uppercase'
                    }}
                  >
                    Premium Artistry
                  </span>
                  <h2 style={{ fontSize: '23px', fontWeight: 700, lineHeight: '1.35', marginBottom: '8px', letterSpacing: '-0.5px' }}>
                    우아함과 자연스러움의 시작<br />그레이스 샵 스튜디오
                  </h2>
                  <p style={{ fontSize: '12px', opacity: 0.9, lineHeight: '1.6', fontWeight: 300 }}>
                    인위적인 느낌을 배제하고, 고객 고유의 모근 결에 최적화된 톤을 한 올 한 올 자연스럽게 디자인해 드립니다.
                  </p>
                </div>
              </div>

              {/* 브랜드 핵심 가치 (호버 리프트 적용) */}
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  marginBottom: '20px',
                }}
              >
                <div
                  className="card hover-lift"
                  style={{
                    flex: 1,
                    padding: '20px 16px',
                    marginBottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px'
                  }}>
                    <ShieldCheck size={20} color="var(--color-text-main)" />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, marginBottom: '4px', color: 'var(--color-text-main)' }}>1회용 위생 도구</span>
                  <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
                    멸균 니들 100% 사용 직후 즉시 폐기 원칙 준수
                  </span>
                </div>
                
                <div
                  className="card hover-lift"
                  style={{
                    flex: 1,
                    padding: '20px 16px',
                    marginBottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px'
                  }}>
                    <Sparkles size={20} color="var(--color-text-main)" />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, marginBottom: '4px', color: 'var(--color-text-main)' }}>정품 천연 색소</span>
                  <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
                    안전성 승인 획득한 고급 원료 커스텀 블렌딩
                  </span>
                </div>
              </div>

              {/* 자가진단 퀴즈 연동 */}
              <DiagnosticTest onStartConsulting={openConsulting} />
            </div>
          )}

          {/* === GALLERY TAB === */}
          {activeTab === 'gallery' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              {/* 갤러리 페이지 헤더 인포그래픽 배너 */}
              <div style={{
                background: 'linear-gradient(135deg, var(--color-text-main) 0%, #2b2520 100%)',
                borderRadius: 'var(--radius-md)',
                padding: '22px 20px',
                marginBottom: '20px',
                color: 'var(--color-primary-light)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* 배경 장식 원 */}
                <div style={{
                  position: 'absolute', top: '-20px', right: '-20px',
                  width: '100px', height: '100px', borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  pointerEvents: 'none',
                }} />
                <div style={{
                  position: 'absolute', bottom: '-30px', right: '40px',
                  width: '70px', height: '70px', borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  pointerEvents: 'none',
                }} />

                <span style={{
                  display: 'inline-block',
                  fontSize: '9.5px', fontWeight: 700,
                  letterSpacing: '1.8px', textTransform: 'uppercase',
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  padding: '3px 10px', borderRadius: '20px',
                  marginBottom: '10px',
                }}>
                  Portfolio Gallery
                </span>
                <h2 style={{
                  fontSize: '18px', fontWeight: 700,
                  letterSpacing: '-0.4px', margin: '0 0 8px 0',
                  color: '#FAF6F0',
                }}>
                  Before &amp; After 포트폴리오
                </h2>
                <p style={{
                  fontSize: '12px', opacity: 0.75, lineHeight: 1.65,
                  fontWeight: 300, margin: 0, wordBreak: 'keep-all',
                }}>
                  슬라이더 핸들을 좌우로 드래그해
                  시술 전후 차이를 직접 확인해 보세요.
                </p>

                {/* 통계 뱃지 행 */}
                <div style={{
                  display: 'flex', gap: '12px', marginTop: '16px',
                }}>
                  {[
                    { label: '시술 케이스', value: '3+' },
                    { label: '평균 만족도', value: '4.9★' },
                    { label: '리터치 포함', value: '전 항목' },
                  ].map((stat, i) => (
                    <div key={i} style={{
                      flex: 1, textAlign: 'center',
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      borderRadius: '10px', padding: '10px 6px',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#FAF6F0', lineHeight: 1 }}>
                        {stat.value}
                      </div>
                      <div style={{ fontSize: '9.5px', opacity: 0.7, marginTop: '4px', fontWeight: 500 }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {beforeAfterPortfolio.map((item, idx) => (
                <BeforeAfterSlider
                  key={idx}
                  index={idx + 1}
                  beforeImage={item.before}
                  afterImage={item.after}
                  title={item.title}
                  category={item.category}
                  duration={item.duration}
                  point={item.point}
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
                onOpenWriteForm={openReviewForm}
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

              <ServicesInfo onStartConsulting={openConsulting} />
            </div>
          )}

          {/* === CARE TAB === */}
          {activeTab === 'care' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <CareGuide />
            </div>
          )}

        </main>

        {/* 3. 모바일 하단 플로팅 퀵바 (클래스 기반 컨트롤) */}
        <div className="floating-quickbar">
          <div className="floating-quickbar-content">
            <button
              onClick={openConsulting}
              className="quickbar-btn consulting"
            >
              <span className="quickbar-icon">📸</span>
              <span className="quickbar-text">
                <span>비대면 맞춤</span>
                <span>사진 견적</span>
              </span>
            </button>
            <a
              href="https://booking.naver.com"
              target="_blank"
              rel="noopener noreferrer"
              className="quickbar-btn naver"
            >
              <span className="quickbar-icon">📅</span>
              <span className="quickbar-text">
                <span>네이버</span>
                <span>예약 가기</span>
              </span>
            </a>
          </div>
        </div>

        {/* 4. 하단 고정 탭 바 */}
        <BottomNav activeTab={activeTab} setActiveTab={changeTab} />

        {/* 5. 리뷰 작성 바텀 시트 */}
        {isReviewFormOpen && (
          <ReviewForm
            onClose={closeReviewForm}
            onSuccess={triggerRefreshReviews}
          />
        )}

        {/* 6. 1:1 사진 견적 신청 바텀 시트 */}
        {isConsultingOpen && (
          <ConsultingForm onClose={closeConsulting} />
        )}
      </div>
    </div>
  );
}

export default App;
