import { useState, useEffect } from 'react';
import { BottomNav, type TabType } from './components/BottomNav';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { DiagnosticTest } from './components/DiagnosticTest';
import { CareGuide } from './components/CareGuide';
import { ReviewList } from './components/ReviewList';
import { ReviewForm } from './components/ReviewForm';
import { ConsultingForm } from './components/ConsultingForm';
import { ServicesInfo } from './components/ServicesInfo';
import { LocationGuide } from './components/LocationGuide';
import { DirectorProfile } from './components/DirectorProfile';
import { AdminPanel } from './components/AdminPanel';
import { HomeFeaturedResults } from './components/HomeFeaturedResults';
import { HomeFaq } from './components/HomeFaq';
import { HomeReviews } from './components/HomeReviews';
import { GalleryFeed } from './components/GalleryFeed';
import { KakaoChannelCard } from './components/KakaoChannelCard';
import { KakaoChannelButton } from './components/KakaoChannelButton';
import { KakaoChannelFab } from './components/KakaoChannelFab';
import { SeoContent } from './components/SeoContent';
import { SHOP_LOCATION } from './constants/location';
import { FALLBACK_PORTFOLIOS, FALLBACK_SERVICE_PRICES, type PortfolioItem, type ServicePrice } from './constants/services';
import { applyTabSeo } from './utils/seoDocument';
import { loadAndApplyReviewJsonLd } from './utils/reviewSeo';
import { loadPublicConfig } from './constants/kakao';
import { resolveServiceDuration } from './utils/serviceDuration';
import { Calendar, PhoneCall, Sparkles, ShieldCheck, MapPin, Clock, MessageSquare, Award, ChevronLeft, Loader2, Settings2 } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>(FALLBACK_PORTFOLIOS);
  const [servicePrices, setServicePrices] = useState<ServicePrice[]>(FALLBACK_SERVICE_PRICES);
  const [portfoliosLoading, setPortfoliosLoading] = useState(false);
  const [galleryCategory, setGalleryCategory] = useState('전체');

  // 모달 제어 상태
  const [isReviewFormOpen, setIsReviewFormOpen] = useState<boolean>(false);
  const [isConsultingOpen, setIsConsultingOpen] = useState<boolean>(false);

  // 리뷰 리스트 갱신 트리거
  const [refreshReviews, setRefreshReviews] = useState<boolean>(false);

  // 카카오맵 키 등 공개 설정 미리 로드 + 후기 JSON-LD + 케어안내 소요시간
  useEffect(() => {
    void loadPublicConfig();
    void loadAndApplyReviewJsonLd();

    let cancelled = false;
    const loadPrices = async () => {
      try {
        const res = await fetch('/api/prices');
        const data = await res.json();
        if (!cancelled && res.ok && data.prices?.length) {
          setServicePrices(data.prices as ServicePrice[]);
        }
      } catch {
        /* 폴백 유지 */
      }
    };
    void loadPrices();
    return () => {
      cancelled = true;
    };
  }, []);

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

  // 탭별 SEO(title/description/canonical/OG) 갱신
  useEffect(() => {
    applyTabSeo(activeTab);
  }, [activeTab]);

  // 마운트 시 초기 히스토리 상태 설정 및 popstate 이벤트 리스너 등록
  useEffect(() => {
    const initialTab = (window.location.hash.replace('#', '') as TabType) || 'home';
    const validTabs: TabType[] = ['home', 'gallery', 'portfolio', 'reviews', 'services', 'care', 'location', 'profile', 'admin'];
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

  // 공개 포트폴리오 로드
  useEffect(() => {
    let cancelled = false;
    setPortfoliosLoading(true);

    fetch('/api/portfolios')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.portfolios?.length) {
          setPortfolios(data.portfolios);
        }
      })
      .catch(() => {
        // 폴백 유지
      })
      .finally(() => {
        if (!cancelled) setPortfoliosLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const galleryCategories = ['전체', ...Array.from(new Set(portfolios.map((p) => p.category)))];
  const filteredPortfolios =
    galleryCategory === '전체'
      ? portfolios
      : portfolios.filter((p) => p.category === galleryCategory);

  return (
    <div className="desktop-layout-wrapper">
      {/* 데스크톱 전용 브랜드 사이드 패널 (1024px 이상 대화면에서만 노출됨) */}
      <aside className="desktop-brand-panel">
        <div className="desktop-brand-content">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
            <img
              src="/logo.png"
              alt="그레이스샵 Grace Shop 로고"
              className="desktop-brand-logo"
            />
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 700, letterSpacing: '1px' }}>
              PREMIUM BEAUTY STUDIO
            </span>
          </div>
          
          <p className="desktop-brand-desc">
            본연의 아름다움을 정교하게 다듬어가는 여정,<br />
            그레이스 샵 브로우 메이크업 & 두피 커버 케어 스튜디오입니다.
          </p>
          
          <div className="desktop-info-card glass-panel card hover-lift">
            <div className="desktop-info-item" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '12px' }}>
              <Award size={20} color="var(--color-text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <span className="info-label">대표 케어 프로그램</span>
                <span className="info-value">엠보 눈썹 디자인 · 콤보 메이크업 · 두피 커버 · 헤어라인 쉐이딩</span>
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
                <span className="info-value">{SHOP_LOCATION.fullAddress}</span>
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
              <KakaoChannelButton
                action="chat"
                asLink
                hideWhenUnavailable
                className="qr-btn kakao"
                style={{ gap: '8px', boxShadow: '0 4px 12px rgba(254,229,0,0.15)' }}
              >
                <MessageSquare size={16} /> 카카오톡 1:1 채팅 문의
              </KakaoChannelButton>
            </div>
          </div>
        </div>
      </aside>

      {/* 모바일 폰 프레임 뷰포트 기둥 */}
      <div className="app-container">
        {/* 1. 상단 앱 헤더 */}
        <header className="app-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
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
                  flexShrink: 0,
                }}
                aria-label="뒤로가기"
              >
                <ChevronLeft size={22} />
              </button>
            )}
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                minWidth: 0,
                flex: 1,
              }} 
              onClick={() => changeTab('home')}
            >
              <img 
                src="/logo.png" 
                alt="그레이스샵 Grace Shop 로고" 
                className="header-brand-logo"
              />
              <h1 className="sr-only">Grace Shop</h1>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => changeTab('admin')}
              className={`header-admin-btn${activeTab === 'admin' ? ' active' : ''}`}
              aria-label="관리자"
              title="관리자"
            >
              <Settings2 size={16} />
            </button>
            <a
              href="tel:010-0000-0000"
              style={{ color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', flexShrink: 0 }}
              aria-label="전화 문의"
            >
              <PhoneCall size={17} />
            </a>
            <button
              onClick={openConsulting}
              style={{
                background: 'var(--color-text-main)',
                color: 'var(--color-primary-light)',
                border: 'none',
                padding: '6px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                whiteSpace: 'nowrap',
                flexShrink: 0
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

              {/* 대표 전후 결과 + 원장 신뢰 요약 */}
              <HomeFeaturedResults
                portfolios={portfolios}
                onOpenGallery={() => changeTab('portfolio')}
                onOpenProfile={() => changeTab('profile')}
                onStartConsulting={openConsulting}
              />

              <HomeReviews onOpenReviews={() => changeTab('reviews')} />

              {/* 카카오톡 공식 채널 */}
              <KakaoChannelCard onAlternateContact={openConsulting} />

              {/* SEO/AEO FAQ */}
              <HomeFaq />

              {/* 자가진단 퀴즈 연동 */}
              <DiagnosticTest
                onStartConsulting={openConsulting}
                servicePrices={servicePrices}
              />
            </div>
          )}

          {/* === GALLERY TAB (시술 사진) === */}
          {activeTab === 'gallery' && (
            <GalleryFeed onStartConsulting={openConsulting} />
          )}

          {/* === PORTFOLIO TAB (전후사진) === */}
          {activeTab === 'portfolio' && (
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
                <p className="notranslate" style={{
                  fontSize: '12px', opacity: 0.75, lineHeight: 1.65,
                  fontWeight: 300, margin: 0, wordBreak: 'keep-all',
                  overflowWrap: 'break-word',
                }}>
                  슬라이더 핸들을 좌우로 드래그해<br />
                  케어 전후 결과를 직접 확인해 보세요.
                </p>

                {/* 통계 뱃지 행 */}
                <div className="notranslate" style={{
                  display: 'flex', gap: '12px', marginTop: '16px',
                }}>
                  {[
                    { label: '케어 건수', value: '3K+' },
                    { label: '평균 만족도', value: '4.9★' },
                    { label: '리터치 포함', value: '전 항목' },
                  ].map((stat, i) => (
                    <div key={i} style={{
                      flex: 1, textAlign: 'center',
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      borderRadius: '10px', padding: '10px 6px',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}>
                      <div className="notranslate" style={{ fontSize: '16px', fontWeight: 800, color: '#FAF6F0', lineHeight: 1 }}>
                        {stat.value}
                      </div>
                      <div style={{ fontSize: '9.5px', opacity: 0.7, marginTop: '4px', fontWeight: 500 }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {portfoliosLoading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                  <Loader2 size={14} className="admin-spin" />
                  포트폴리오 불러오는 중…
                </div>
              )}

              <div className="gallery-filters" role="tablist" aria-label="포트폴리오 카테고리">
                {galleryCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={galleryCategory === cat}
                    className={`gallery-filter-chip${galleryCategory === cat ? ' active' : ''}`}
                    onClick={() => setGalleryCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {filteredPortfolios.map((item, idx) => (
                <BeforeAfterSlider
                  key={item.id}
                  index={idx + 1}
                  beforeImage={item.before_url}
                  afterImage={item.after_url}
                  title={item.title}
                  category={item.category}
                  duration={resolveServiceDuration(servicePrices, {
                    category: item.category,
                    title: item.title,
                    fallback: item.duration,
                  })}
                  point={item.point || undefined}
                  imageAspectRatio={item.image_aspect_ratio || undefined}
                  onConsult={openConsulting}
                />
              ))}

              {!portfoliosLoading && filteredPortfolios.length === 0 && (
                <div className="gallery-empty">
                  해당 카테고리의 전후 사진이 아직 없습니다.
                </div>
              )}
            </div>
          )}

          {/* === REVIEWS TAB === */}
          {activeTab === 'reviews' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h2 className="section-title">고객 이용 후기</h2>
              <p className="section-subtitle">
                그레이스 샵 케어 프로그램을 이용하신 고객분들의 생생한 리뷰 목록입니다.
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
              <h2 className="section-title">케어 프로그램 및 비용</h2>
              <p className="section-subtitle">
                시술별 기준 단가와 상담 안내입니다. 모든 시술 VAT 10% 별도.
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

          {/* === LOCATION TAB === */}
          {activeTab === 'location' && (
            <LocationGuide onStartConsulting={openConsulting} />
          )}

          {/* === PROFILE TAB === */}
          {activeTab === 'profile' && (
            <DirectorProfile onStartConsulting={openConsulting} />
          )}

          {/* === ADMIN TAB === */}
          {activeTab === 'admin' && (
            <AdminPanel />
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

        {/* 카카오톡 채널 FAB (우측 하단) */}
        <KakaoChannelFab onUnavailable={openConsulting} />

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

        {/* 검색·AI 답변용 시맨틱 본문 (시각 숨김) */}
        <SeoContent />
      </div>
    </div>
  );
}

export default App;
