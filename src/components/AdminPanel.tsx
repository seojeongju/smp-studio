import { useEffect, useState, type FormEvent } from 'react';
import {
  Check,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  Lock,
  LogOut,
  Pencil,
  Phone,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import {
  FALLBACK_PRICE_CATEGORIES,
  GALLERY_CATEGORY_OPTIONS,
  PORTFOLIO_CATEGORY_OPTIONS,
  PRICE_CATEGORY_PRESETS,
  type GalleryImage,
  type PortfolioItem,
  type PriceKind,
  type ServicePrice,
} from '../constants/services';
import {
  adminLogin,
  adminLogout,
  checkAdminAuth,
  uploadImage,
} from '../utils/adminApi';
import { formatPriceDisplay, formatPriceInput, formatPriceNumber } from '../utils/priceFormat';

type AdminSection = 'prices' | 'portfolios' | 'gallery' | 'reviews' | 'reservations';
type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'done';

interface AdminReview {
  id: string;
  name: string;
  rating: number;
  category: string;
  comment: string;
  image_url_1: string | null;
  image_url_2: string | null;
  is_hidden: number;
  created_at: string;
}

interface AdminReservation {
  id: string;
  client_name: string;
  phone: string;
  service_type: string;
  preferred_date: string;
  preferred_time: string;
  has_previous_tattoo: number;
  note: string | null;
  status: ReservationStatus | string;
  created_at: string;
}

const STATUS_LABEL: Record<string, string> = {
  pending: '대기',
  confirmed: '확정',
  cancelled: '취소',
  done: '완료',
};

interface PriceFormState {
  id?: string;
  category_id: string;
  category_label: string;
  category_subtitle: string;
  name: string;
  price_label: string;
  price_kind: PriceKind;
  note: string;
  popular: boolean;
  sort_order: number;
  is_active: boolean;
}

interface PortfolioFormState {
  id?: string;
  title: string;
  category: string;
  before_url: string;
  after_url: string;
  duration: string;
  point: string;
  image_aspect_ratio: string;
  sort_order: number;
  is_published: boolean;
}

interface GalleryFormState {
  id?: string;
  title: string;
  category: string;
  image_url: string;
  caption: string;
  sort_order: number;
  is_published: boolean;
}

const emptyPriceForm = (): PriceFormState => ({
  category_id: PRICE_CATEGORY_PRESETS[0].id,
  category_label: PRICE_CATEGORY_PRESETS[0].label,
  category_subtitle: PRICE_CATEGORY_PRESETS[0].subtitle,
  name: '',
  price_label: '',
  price_kind: 'fixed',
  note: '',
  popular: false,
  sort_order: 0,
  is_active: true,
});

const emptyPortfolioForm = (): PortfolioFormState => ({
  title: '',
  category: PORTFOLIO_CATEGORY_OPTIONS[0],
  before_url: '',
  after_url: '',
  duration: '',
  point: '',
  image_aspect_ratio: '',
  sort_order: 0,
  is_published: true,
});

const emptyGalleryForm = (): GalleryFormState => ({
  title: '',
  category: GALLERY_CATEGORY_OPTIONS[0],
  image_url: '',
  caption: '',
  sort_order: 0,
  is_published: true,
});

export function AdminPanel() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [section, setSection] = useState<AdminSection>('prices');
  const [prices, setPrices] = useState<ServicePrice[]>([]);
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'visible' | 'hidden'>('all');
  const [reservationFilter, setReservationFilter] = useState<'all' | ReservationStatus>('all');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [priceForm, setPriceForm] = useState<PriceFormState>(emptyPriceForm());
  const [portfolioForm, setPortfolioForm] = useState<PortfolioFormState>(emptyPortfolioForm());
  const [galleryForm, setGalleryForm] = useState<GalleryFormState>(emptyGalleryForm());
  const [showPriceForm, setShowPriceForm] = useState(false);
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<'before' | 'after' | 'gallery' | null>(null);

  useEffect(() => {
    checkAdminAuth()
      .then((ok) => setAuthenticated(ok))
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    void loadSectionData(section);
  }, [authenticated, section, reviewFilter, reservationFilter]);

  const loadSectionData = async (target: AdminSection) => {
    setLoading(true);
    setError('');
    try {
      if (target === 'prices') {
        const res = await fetch('/api/admin/prices', { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || '단가표를 불러오지 못했습니다.');
        setPrices(data.prices || []);
      } else if (target === 'portfolios') {
        const res = await fetch('/api/admin/portfolios', { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || '포트폴리오를 불러오지 못했습니다.');
        setPortfolios(data.portfolios || []);
      } else if (target === 'gallery') {
        const res = await fetch('/api/admin/gallery', { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || '갤러리를 불러오지 못했습니다.');
        setGalleryImages(data.images || []);
      } else if (target === 'reviews') {
        const res = await fetch(`/api/admin/reviews?filter=${reviewFilter}`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || '후기를 불러오지 못했습니다.');
        setReviews(data.reviews || []);
      } else {
        const qs = reservationFilter === 'all' ? 'all' : reservationFilter;
        const res = await fetch(`/api/admin/reservations?status=${qs}`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || '상담 신청을 불러오지 못했습니다.');
        setReservations(data.reservations || []);
      }
    } catch (err: any) {
      setError(err.message || '데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');
    const result = await adminLogin(password);
    setLoggingIn(false);
    if (!result.ok) {
      setLoginError(result.error || '로그인 실패');
      return;
    }
    setPassword('');
    setAuthenticated(true);
  };

  const handleLogout = async () => {
    await adminLogout();
    setAuthenticated(false);
    setPrices([]);
    setPortfolios([]);
    setGalleryImages([]);
    setReviews([]);
    setReservations([]);
  };

  const toggleReviewHidden = async (row: AdminReview) => {
    setError('');
    try {
      const next = row.is_hidden ? 0 : 1;
      const res = await fetch(`/api/admin/reviews/${row.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ is_hidden: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '상태 변경에 실패했습니다.');
      setMessage(next ? '후기를 숨겼습니다.' : '후기를 다시 공개했습니다.');
      await loadSectionData('reviews');
    } catch (err: any) {
      setError(err.message || '상태 변경에 실패했습니다.');
    }
  };

  const deleteReviewAdmin = async (id: string) => {
    if (!confirm('이 후기를 완전히 삭제할까요?')) return;
    setError('');
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '삭제에 실패했습니다.');
      setMessage('후기가 삭제되었습니다.');
      await loadSectionData('reviews');
    } catch (err: any) {
      setError(err.message || '삭제에 실패했습니다.');
    }
  };

  const updateReservationStatus = async (id: string, status: ReservationStatus) => {
    setError('');
    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '상태 변경에 실패했습니다.');
      setMessage(`상담 상태가 '${STATUS_LABEL[status]}'(으)로 변경되었습니다.`);
      await loadSectionData('reservations');
    } catch (err: any) {
      setError(err.message || '상태 변경에 실패했습니다.');
    }
  };

  const deleteReservation = async (id: string) => {
    if (!confirm('이 상담 신청을 삭제할까요?')) return;
    setError('');
    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '삭제에 실패했습니다.');
      setMessage('상담 신청이 삭제되었습니다.');
      await loadSectionData('reservations');
    } catch (err: any) {
      setError(err.message || '삭제에 실패했습니다.');
    }
  };

  const applyCategoryPreset = (categoryId: string) => {
    const preset = PRICE_CATEGORY_PRESETS.find((c) => c.id === categoryId);
    if (!preset) return;
    setPriceForm((prev) => ({
      ...prev,
      category_id: preset.id,
      category_label: preset.label,
      category_subtitle: preset.subtitle,
    }));
  };

  const openCreatePrice = () => {
    setPriceForm(emptyPriceForm());
    setShowPriceForm(true);
  };

  const openEditPrice = (row: ServicePrice) => {
    setPriceForm({
      id: row.id,
      category_id: row.category_id,
      category_label: row.category_label,
      category_subtitle: row.category_subtitle,
      name: row.name,
      price_label: formatPriceNumber(row.price_label),
      price_kind: row.price_kind,
      note: row.note || '',
      popular: !!row.popular,
      sort_order: row.sort_order,
      is_active: row.is_active !== 0,
    });
    setShowPriceForm(true);
  };

  const savePrice = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const payload = {
        category_id: priceForm.category_id,
        category_label: priceForm.category_label,
        category_subtitle: priceForm.category_subtitle,
        name: priceForm.name,
        price_label: formatPriceNumber(priceForm.price_label),
        price_kind: priceForm.price_kind,
        note: priceForm.note || null,
        popular: priceForm.popular ? 1 : 0,
        sort_order: Number(priceForm.sort_order) || 0,
        is_active: priceForm.is_active ? 1 : 0,
      };

      const res = await fetch(
        priceForm.id ? `/api/admin/prices/${priceForm.id}` : '/api/admin/prices',
        {
          method: priceForm.id ? 'PUT' : 'POST',
          credentials: 'include',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '저장에 실패했습니다.');

      setMessage(priceForm.id ? '단가가 수정되었습니다.' : '단가가 추가되었습니다.');
      setShowPriceForm(false);
      await loadSectionData('prices');
    } catch (err: any) {
      setError(err.message || '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const deletePrice = async (id: string) => {
    if (!confirm('이 단가 항목을 삭제할까요?')) return;
    setError('');
    try {
      const res = await fetch(`/api/admin/prices/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '삭제에 실패했습니다.');
      setMessage('단가가 삭제되었습니다.');
      await loadSectionData('prices');
    } catch (err: any) {
      setError(err.message || '삭제에 실패했습니다.');
    }
  };

  const openCreatePortfolio = () => {
    setPortfolioForm(emptyPortfolioForm());
    setShowPortfolioForm(true);
  };

  const openEditPortfolio = (row: PortfolioItem) => {
    setPortfolioForm({
      id: row.id,
      title: row.title,
      category: row.category,
      before_url: row.before_url,
      after_url: row.after_url,
      duration: row.duration || '',
      point: row.point || '',
      image_aspect_ratio: row.image_aspect_ratio || '',
      sort_order: row.sort_order,
      is_published: row.is_published !== 0,
    });
    setShowPortfolioForm(true);
  };

  const handleUpload = async (side: 'before' | 'after', file: File | null) => {
    if (!file) return;
    setUploading(side);
    setError('');
    try {
      const url = await uploadImage(file, 'portfolio');
      setPortfolioForm((prev) => ({
        ...prev,
        [side === 'before' ? 'before_url' : 'after_url']: url,
      }));
    } catch (err: any) {
      setError(err.message || '업로드에 실패했습니다.');
    } finally {
      setUploading(null);
    }
  };

  const savePortfolio = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const payload = {
        title: portfolioForm.title,
        category: portfolioForm.category,
        before_url: portfolioForm.before_url,
        after_url: portfolioForm.after_url,
        duration: portfolioForm.duration || null,
        point: portfolioForm.point || null,
        image_aspect_ratio: portfolioForm.image_aspect_ratio || null,
        sort_order: Number(portfolioForm.sort_order) || 0,
        is_published: portfolioForm.is_published ? 1 : 0,
      };

      const res = await fetch(
        portfolioForm.id
          ? `/api/admin/portfolios/${portfolioForm.id}`
          : '/api/admin/portfolios',
        {
          method: portfolioForm.id ? 'PUT' : 'POST',
          credentials: 'include',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '저장에 실패했습니다.');

      setMessage(portfolioForm.id ? '포트폴리오가 수정되었습니다.' : '포트폴리오가 등록되었습니다.');
      setShowPortfolioForm(false);
      await loadSectionData('portfolios');
    } catch (err: any) {
      setError(err.message || '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const deletePortfolio = async (id: string) => {
    if (!confirm('이 전후 사진을 삭제할까요?')) return;
    setError('');
    try {
      const res = await fetch(`/api/admin/portfolios/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '삭제에 실패했습니다.');
      setMessage('포트폴리오가 삭제되었습니다.');
      await loadSectionData('portfolios');
    } catch (err: any) {
      setError(err.message || '삭제에 실패했습니다.');
    }
  };

  const openCreateGallery = () => {
    setGalleryForm(emptyGalleryForm());
    setShowGalleryForm(true);
  };

  const openEditGallery = (row: GalleryImage) => {
    setGalleryForm({
      id: row.id,
      title: row.title || '',
      category: row.category,
      image_url: row.image_url,
      caption: row.caption || '',
      sort_order: row.sort_order,
      is_published: row.is_published !== 0,
    });
    setShowGalleryForm(true);
  };

  const handleGalleryUpload = async (file: File | null) => {
    if (!file) return;
    setUploading('gallery');
    setError('');
    try {
      const url = await uploadImage(file, 'gallery');
      setGalleryForm((prev) => ({ ...prev, image_url: url }));
    } catch (err: any) {
      setError(err.message || '업로드에 실패했습니다.');
    } finally {
      setUploading(null);
    }
  };

  const saveGallery = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const payload = {
        title: galleryForm.title || null,
        category: galleryForm.category,
        image_url: galleryForm.image_url,
        caption: galleryForm.caption || null,
        sort_order: Number(galleryForm.sort_order) || 0,
        is_published: galleryForm.is_published ? 1 : 0,
      };

      const res = await fetch(
        galleryForm.id ? `/api/admin/gallery/${galleryForm.id}` : '/api/admin/gallery',
        {
          method: galleryForm.id ? 'PUT' : 'POST',
          credentials: 'include',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '저장에 실패했습니다.');

      setMessage(galleryForm.id ? '갤러리 사진이 수정되었습니다.' : '갤러리 사진이 등록되었습니다.');
      setShowGalleryForm(false);
      await loadSectionData('gallery');
    } catch (err: any) {
      setError(err.message || '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const deleteGallery = async (id: string) => {
    if (!confirm('이 갤러리 사진을 삭제할까요?')) return;
    setError('');
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '삭제에 실패했습니다.');
      setMessage('갤러리 사진이 삭제되었습니다.');
      await loadSectionData('gallery');
    } catch (err: any) {
      setError(err.message || '삭제에 실패했습니다.');
    }
  };

  if (checking) {
    return (
      <div className="admin-panel admin-center">
        <Loader2 className="admin-spin" size={22} />
        <p>관리자 세션 확인 중…</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="admin-panel">
        <div className="admin-login card">
          <div className="admin-login-icon">
            <Lock size={20} />
          </div>
          <h2>관리자 로그인</h2>
          <p>단가표·전후사진·갤러리 관리를 위해 비밀번호를 입력해 주세요.</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              className="admin-input"
              placeholder="관리자 비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            {loginError && <p className="admin-error">{loginError}</p>}
            <button type="submit" className="btn btn-primary" disabled={loggingIn}>
              {loggingIn ? '로그인 중…' : '로그인'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">Admin Console</p>
          <h2>콘텐츠 관리</h2>
        </div>
        <button type="button" className="admin-logout" onClick={handleLogout}>
          <LogOut size={14} />
          로그아웃
        </button>
      </header>

      <div className="admin-tabs admin-tabs-wrap">
        <button
          type="button"
          className={`admin-tab${section === 'prices' ? ' active' : ''}`}
          onClick={() => setSection('prices')}
        >
          단가표
        </button>
        <button
          type="button"
          className={`admin-tab${section === 'portfolios' ? ' active' : ''}`}
          onClick={() => setSection('portfolios')}
        >
          전후사진
        </button>
        <button
          type="button"
          className={`admin-tab${section === 'gallery' ? ' active' : ''}`}
          onClick={() => setSection('gallery')}
        >
          갤러리
        </button>
        <button
          type="button"
          className={`admin-tab${section === 'reviews' ? ' active' : ''}`}
          onClick={() => setSection('reviews')}
        >
          후기
        </button>
        <button
          type="button"
          className={`admin-tab${section === 'reservations' ? ' active' : ''}`}
          onClick={() => setSection('reservations')}
        >
          상담
        </button>
      </div>

      {message && (
        <div className="admin-banner success">
          <Check size={14} />
          {message}
          <button type="button" onClick={() => setMessage('')} aria-label="닫기">
            <X size={14} />
          </button>
        </div>
      )}
      {error && (
        <div className="admin-banner error">
          {error}
          <button type="button" onClick={() => setError('')} aria-label="닫기">
            <X size={14} />
          </button>
        </div>
      )}

      {section === 'prices' && (
        <section className="admin-section">
          <div className="admin-section-bar">
            <h3>서비스 단가 ({prices.length})</h3>
            <button type="button" className="admin-add-btn" onClick={openCreatePrice}>
              <Plus size={14} /> 추가
            </button>
          </div>

          {loading ? (
            <div className="admin-center"><Loader2 className="admin-spin" size={20} /></div>
          ) : (
            <ul className="admin-list">
              {prices.map((row) => (
                <li key={row.id} className={`admin-list-item${!row.is_active ? ' muted' : ''}`}>
                  <div>
                    <div className="admin-item-title">
                      {row.name}
                      {!!row.popular && <span className="admin-chip">인기</span>}
                      {!row.is_active && <span className="admin-chip ghost">숨김</span>}
                    </div>
                    <p className="admin-item-meta">
                      {row.category_label} · {formatPriceDisplay(row.price_label, row.price_kind)}
                    </p>
                  </div>
                  <div className="admin-item-actions">
                    <button type="button" onClick={() => openEditPrice(row)} aria-label="수정">
                      <Pencil size={14} />
                    </button>
                    <button type="button" onClick={() => deletePrice(row.id)} aria-label="삭제">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
              {prices.length === 0 && (
                <li className="admin-empty">
                  등록된 단가가 없습니다. (폴백 {FALLBACK_PRICE_CATEGORIES.reduce((n, c) => n + c.items.length, 0)}개)
                </li>
              )}
            </ul>
          )}
        </section>
      )}

      {section === 'portfolios' && (
        <section className="admin-section">
          <div className="admin-section-bar">
            <h3>전후 포트폴리오 ({portfolios.length})</h3>
            <button type="button" className="admin-add-btn" onClick={openCreatePortfolio}>
              <Plus size={14} /> 추가
            </button>
          </div>

          {loading ? (
            <div className="admin-center"><Loader2 className="admin-spin" size={20} /></div>
          ) : (
            <ul className="admin-list">
              {portfolios.map((row) => (
                <li key={row.id} className={`admin-list-item${!row.is_published ? ' muted' : ''}`}>
                  <div className="admin-thumb-pair">
                    <img src={row.before_url} alt="" />
                    <img src={row.after_url} alt="" />
                  </div>
                  <div className="admin-item-body">
                    <div className="admin-item-title">
                      {row.title}
                      {!row.is_published && <span className="admin-chip ghost">비공개</span>}
                    </div>
                    <p className="admin-item-meta">{row.category}</p>
                  </div>
                  <div className="admin-item-actions">
                    <button type="button" onClick={() => openEditPortfolio(row)} aria-label="수정">
                      <Pencil size={14} />
                    </button>
                    <button type="button" onClick={() => deletePortfolio(row.id)} aria-label="삭제">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
              {portfolios.length === 0 && (
                <li className="admin-empty">등록된 전후 사진이 없습니다.</li>
              )}
            </ul>
          )}
        </section>
      )}

      {section === 'gallery' && (
        <section className="admin-section">
          <div className="admin-section-bar">
            <h3>시술 갤러리 ({galleryImages.length})</h3>
            <button type="button" className="admin-add-btn" onClick={openCreateGallery}>
              <Plus size={14} /> 추가
            </button>
          </div>

          {loading ? (
            <div className="admin-center"><Loader2 className="admin-spin" size={20} /></div>
          ) : (
            <ul className="admin-list">
              {galleryImages.map((row) => (
                <li key={row.id} className={`admin-list-item${!row.is_published ? ' muted' : ''}`}>
                  <div className="admin-thumb-single">
                    <img src={row.image_url} alt="" />
                  </div>
                  <div className="admin-item-body">
                    <div className="admin-item-title">
                      {row.title || '(제목 없음)'}
                      {!row.is_published && <span className="admin-chip ghost">비공개</span>}
                    </div>
                    <p className="admin-item-meta">{row.category}</p>
                  </div>
                  <div className="admin-item-actions">
                    <button type="button" onClick={() => openEditGallery(row)} aria-label="수정">
                      <Pencil size={14} />
                    </button>
                    <button type="button" onClick={() => deleteGallery(row.id)} aria-label="삭제">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
              {galleryImages.length === 0 && (
                <li className="admin-empty">등록된 갤러리 사진이 없습니다.</li>
              )}
            </ul>
          )}
        </section>
      )}

      {section === 'reviews' && (
        <section className="admin-section">
          <div className="admin-section-bar">
            <h3>고객 후기 ({reviews.length})</h3>
            <div className="admin-filter-row">
              {([
                ['all', '전체'],
                ['visible', '공개'],
                ['hidden', '숨김'],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={`admin-filter-chip${reviewFilter === value ? ' active' : ''}`}
                  onClick={() => setReviewFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="admin-center"><Loader2 className="admin-spin" size={20} /></div>
          ) : (
            <ul className="admin-list">
              {reviews.map((row) => (
                <li key={row.id} className={`admin-list-item admin-list-item-col${row.is_hidden ? ' muted' : ''}`}>
                  <div className="admin-item-body" style={{ width: '100%' }}>
                    <div className="admin-item-title">
                      {row.name}
                      <span className="admin-chip ghost">{row.category}</span>
                      <span className="admin-chip ghost">{'★'.repeat(row.rating)}</span>
                      {!!row.is_hidden && <span className="admin-chip ghost">숨김</span>}
                    </div>
                    <p className="admin-item-meta">{row.comment}</p>
                    <p className="admin-item-meta">
                      {new Date(row.created_at).toLocaleString('ko-KR')}
                    </p>
                    {(row.image_url_1 || row.image_url_2) && (
                      <div className="admin-thumb-pair" style={{ width: 72, height: 48, marginTop: 8 }}>
                        {row.image_url_1 && <img src={row.image_url_1} alt="" />}
                        {row.image_url_2 && <img src={row.image_url_2} alt="" />}
                      </div>
                    )}
                  </div>
                  <div className="admin-item-actions">
                    <button
                      type="button"
                      onClick={() => toggleReviewHidden(row)}
                      aria-label={row.is_hidden ? '공개' : '숨김'}
                      title={row.is_hidden ? '공개' : '숨김'}
                    >
                      {row.is_hidden ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button type="button" onClick={() => deleteReviewAdmin(row.id)} aria-label="삭제">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
              {reviews.length === 0 && (
                <li className="admin-empty">표시할 후기가 없습니다.</li>
              )}
            </ul>
          )}
        </section>
      )}

      {section === 'reservations' && (
        <section className="admin-section">
          <div className="admin-section-bar">
            <h3>상담 신청 ({reservations.length})</h3>
            <div className="admin-filter-row">
              {([
                ['all', '전체'],
                ['pending', '대기'],
                ['confirmed', '확정'],
                ['done', '완료'],
                ['cancelled', '취소'],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={`admin-filter-chip${reservationFilter === value ? ' active' : ''}`}
                  onClick={() => setReservationFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="admin-center"><Loader2 className="admin-spin" size={20} /></div>
          ) : (
            <ul className="admin-list">
              {reservations.map((row) => (
                <li key={row.id} className="admin-list-item admin-list-item-col">
                  <div className="admin-item-body" style={{ width: '100%' }}>
                    <div className="admin-item-title">
                      {row.client_name}
                      <span className={`admin-chip status-${row.status}`}>
                        {STATUS_LABEL[row.status] || row.status}
                      </span>
                    </div>
                    <p className="admin-item-meta">
                      {row.service_type} · {row.preferred_date} {row.preferred_time}
                    </p>
                    <p className="admin-item-meta">
                      <a href={`tel:${row.phone}`} className="admin-phone-link">
                        <Phone size={12} /> {row.phone}
                      </a>
                      {row.has_previous_tattoo ? ' · 잔흔 있음' : ' · 잔흔 없음'}
                    </p>
                    {row.note && <p className="admin-item-meta">메모: {row.note}</p>}
                    <div className="admin-status-actions">
                      {(['pending', 'confirmed', 'done', 'cancelled'] as ReservationStatus[]).map((st) => (
                        <button
                          key={st}
                          type="button"
                          className={`admin-filter-chip${row.status === st ? ' active' : ''}`}
                          onClick={() => updateReservationStatus(row.id, st)}
                          disabled={row.status === st}
                        >
                          {STATUS_LABEL[st]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="admin-item-actions">
                    <button type="button" onClick={() => deleteReservation(row.id)} aria-label="삭제">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
              {reservations.length === 0 && (
                <li className="admin-empty">상담 신청이 없습니다.</li>
              )}
            </ul>
          )}
        </section>
      )}

      {showPriceForm && (
        <div className="admin-modal-overlay" onClick={() => setShowPriceForm(false)}>
          <form className="admin-modal" onClick={(e) => e.stopPropagation()} onSubmit={savePrice}>
            <div className="admin-modal-head">
              <h3>{priceForm.id ? '단가 수정' : '단가 추가'}</h3>
              <button type="button" onClick={() => setShowPriceForm(false)} aria-label="닫기">
                <X size={18} />
              </button>
            </div>

            <label className="admin-label">
              카테고리
              <select
                className="admin-input"
                value={priceForm.category_id}
                onChange={(e) => applyCategoryPreset(e.target.value)}
              >
                {PRICE_CATEGORY_PRESETS.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </label>

            <label className="admin-label">
              시술명
              <input
                className="admin-input"
                value={priceForm.name}
                onChange={(e) => setPriceForm((p) => ({ ...p, name: e.target.value }))}
                required
              />
            </label>

            <div className="admin-grid-2">
              <label className="admin-label">
                가격
                <input
                  className="admin-input"
                  inputMode="numeric"
                  value={priceForm.price_label}
                  onChange={(e) =>
                    setPriceForm((p) => ({
                      ...p,
                      price_label: formatPriceInput(e.target.value),
                    }))
                  }
                  placeholder="예: 150,000"
                  required
                />
              </label>
              <label className="admin-label">
                가격 유형
                <select
                  className="admin-input"
                  value={priceForm.price_kind}
                  onChange={(e) =>
                    setPriceForm((p) => ({ ...p, price_kind: e.target.value as PriceKind }))
                  }
                >
                  <option value="fixed">고정가</option>
                  <option value="from">상담가 (원~)</option>
                </select>
              </label>
            </div>

            <label className="admin-label">
              안내 문구 (선택)
              <input
                className="admin-input"
                value={priceForm.note}
                onChange={(e) => setPriceForm((p) => ({ ...p, note: e.target.value }))}
              />
            </label>

            <div className="admin-grid-2">
              <label className="admin-label">
                정렬 순서
                <input
                  type="number"
                  className="admin-input"
                  value={priceForm.sort_order}
                  onChange={(e) =>
                    setPriceForm((p) => ({ ...p, sort_order: Number(e.target.value) }))
                  }
                />
              </label>
              <div className="admin-checks">
                <label>
                  <input
                    type="checkbox"
                    checked={priceForm.popular}
                    onChange={(e) => setPriceForm((p) => ({ ...p, popular: e.target.checked }))}
                  />
                  인기
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={priceForm.is_active}
                    onChange={(e) => setPriceForm((p) => ({ ...p, is_active: e.target.checked }))}
                  />
                  공개
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? '저장 중…' : '저장'}
            </button>
          </form>
        </div>
      )}

      {showPortfolioForm && (
        <div className="admin-modal-overlay" onClick={() => setShowPortfolioForm(false)}>
          <form
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
            onSubmit={savePortfolio}
          >
            <div className="admin-modal-head">
              <h3>{portfolioForm.id ? '전후사진 수정' : '전후사진 등록'}</h3>
              <button type="button" onClick={() => setShowPortfolioForm(false)} aria-label="닫기">
                <X size={18} />
              </button>
            </div>

            <label className="admin-label">
              제목
              <input
                className="admin-input"
                value={portfolioForm.title}
                onChange={(e) => setPortfolioForm((p) => ({ ...p, title: e.target.value }))}
                required
              />
            </label>

            <label className="admin-label">
              카테고리
              <select
                className="admin-input"
                value={portfolioForm.category}
                onChange={(e) => setPortfolioForm((p) => ({ ...p, category: e.target.value }))}
              >
                {PORTFOLIO_CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>

            <div className="admin-upload-grid">
              <label className="admin-upload-box">
                <span>BEFORE</span>
                {portfolioForm.before_url ? (
                  <img src={portfolioForm.before_url} alt="before" />
                ) : (
                  <div className="admin-upload-placeholder">
                    <ImagePlus size={20} />
                    {uploading === 'before' ? '업로드 중…' : '사진 선택'}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleUpload('before', e.target.files?.[0] || null)}
                />
              </label>
              <label className="admin-upload-box">
                <span>AFTER</span>
                {portfolioForm.after_url ? (
                  <img src={portfolioForm.after_url} alt="after" />
                ) : (
                  <div className="admin-upload-placeholder">
                    <ImagePlus size={20} />
                    {uploading === 'after' ? '업로드 중…' : '사진 선택'}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleUpload('after', e.target.files?.[0] || null)}
                />
              </label>
            </div>

            <label className="admin-label">
              소요시간 (선택)
              <input
                className="admin-input"
                value={portfolioForm.duration}
                onChange={(e) => setPortfolioForm((p) => ({ ...p, duration: e.target.value }))}
                placeholder="예: 90분 소요"
              />
            </label>

            <label className="admin-label">
              디자인 포인트 (선택)
              <textarea
                className="admin-input admin-textarea"
                value={portfolioForm.point}
                onChange={(e) => setPortfolioForm((p) => ({ ...p, point: e.target.value }))}
                rows={3}
              />
            </label>

            <div className="admin-grid-2">
              <label className="admin-label">
                정렬 순서
                <input
                  type="number"
                  className="admin-input"
                  value={portfolioForm.sort_order}
                  onChange={(e) =>
                    setPortfolioForm((p) => ({ ...p, sort_order: Number(e.target.value) }))
                  }
                />
              </label>
              <div className="admin-checks">
                <label>
                  <input
                    type="checkbox"
                    checked={portfolioForm.is_published}
                    onChange={(e) =>
                      setPortfolioForm((p) => ({ ...p, is_published: e.target.checked }))
                    }
                  />
                  공개
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving || !portfolioForm.before_url || !portfolioForm.after_url}
            >
              {saving ? '저장 중…' : '저장'}
            </button>
          </form>
        </div>
      )}

      {showGalleryForm && (
        <div className="admin-modal-overlay" onClick={() => setShowGalleryForm(false)}>
          <form
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
            onSubmit={saveGallery}
          >
            <div className="admin-modal-head">
              <h3>{galleryForm.id ? '갤러리 수정' : '갤러리 등록'}</h3>
              <button type="button" onClick={() => setShowGalleryForm(false)} aria-label="닫기">
                <X size={18} />
              </button>
            </div>

            <label className="admin-label">
              제목 (선택)
              <input
                className="admin-input"
                value={galleryForm.title}
                onChange={(e) => setGalleryForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="예: 자연 엠보 눈썹"
              />
            </label>

            <label className="admin-label">
              카테고리
              <select
                className="admin-input"
                value={galleryForm.category}
                onChange={(e) => setGalleryForm((p) => ({ ...p, category: e.target.value }))}
              >
                {GALLERY_CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>

            <label className="admin-upload-box" style={{ marginBottom: 12, minHeight: 160 }}>
              <span>시술 사진</span>
              {galleryForm.image_url ? (
                <img src={galleryForm.image_url} alt="gallery" style={{ height: 140 }} />
              ) : (
                <div className="admin-upload-placeholder">
                  <ImagePlus size={20} />
                  {uploading === 'gallery' ? '업로드 중…' : '사진 선택'}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleGalleryUpload(e.target.files?.[0] || null)}
              />
            </label>

            <label className="admin-label">
              설명 (선택)
              <textarea
                className="admin-input admin-textarea"
                value={galleryForm.caption}
                onChange={(e) => setGalleryForm((p) => ({ ...p, caption: e.target.value }))}
                rows={3}
              />
            </label>

            <div className="admin-grid-2">
              <label className="admin-label">
                정렬 순서
                <input
                  type="number"
                  className="admin-input"
                  value={galleryForm.sort_order}
                  onChange={(e) =>
                    setGalleryForm((p) => ({ ...p, sort_order: Number(e.target.value) }))
                  }
                />
              </label>
              <div className="admin-checks">
                <label>
                  <input
                    type="checkbox"
                    checked={galleryForm.is_published}
                    onChange={(e) =>
                      setGalleryForm((p) => ({ ...p, is_published: e.target.checked }))
                    }
                  />
                  공개
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving || !galleryForm.image_url}
            >
              {saving ? '저장 중…' : '저장'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
