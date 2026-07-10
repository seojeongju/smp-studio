import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Copy, ExternalLink, Train, Car } from 'lucide-react';
import {
  SHOP_LOCATION,
  getKakaoMapLink,
  getKakaoNavigationLink,
} from '../constants/location';
import { loadKakaoMapSdk } from '../utils/kakaoMap';
import { createShopMapMarkerHtml } from '../utils/mapMarkerOverlay';
import { getKakaoAppKey, loadPublicConfig } from '../constants/kakao';
import { KakaoChannelCard } from './KakaoChannelCard';

interface LocationGuideProps {
  onStartConsulting?: () => void;
}

export function LocationGuide({ onStartConsulting }: LocationGuideProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<kakao.maps.Map | null>(null);
  const [coords, setCoords] = useState({ lat: SHOP_LOCATION.lat, lng: SHOP_LOCATION.lng });
  const [mapStatus, setMapStatus] = useState<'loading' | 'ready' | 'fallback' | 'error'>('loading');
  const [copyDone, setCopyDone] = useState(false);
  const [kakaoAppKey, setKakaoAppKey] = useState<string | undefined>(getKakaoAppKey());

  useEffect(() => {
    let cancelled = false;

    const initMap = async () => {
      const config = await loadPublicConfig();
      const appKey = config.kakaoAppKey || undefined;
      if (cancelled) return;
      setKakaoAppKey(appKey);

      if (!appKey || !mapContainerRef.current) {
        setMapStatus('fallback');
        return;
      }

      try {
        const kakao = await loadKakaoMapSdk(appKey);
        if (cancelled || !mapContainerRef.current) return;

        // 검증된 단지 좌표를 직접 사용 (지오코딩 오차·실패로 핀이 어긋나는 것 방지)
        const lat = SHOP_LOCATION.lat;
        const lng = SHOP_LOCATION.lng;
        const center = new kakao.maps.LatLng(lat, lng);
        const map = new kakao.maps.Map(mapContainerRef.current, {
          center,
          level: 3,
        });
        mapInstanceRef.current = map;

        const overlay = new kakao.maps.CustomOverlay({
          map,
          position: center,
          content: createShopMapMarkerHtml(),
          xAnchor: 0.5,
          yAnchor: 1,
          zIndex: 3,
        });
        overlay.setMap(map);

        setCoords({ lat, lng });
        setMapStatus('ready');

        requestAnimationFrame(() => {
          map.relayout();
          map.setCenter(center);
        });
      } catch {
        if (!cancelled) {
          setMapStatus('fallback');
        }
      }
    };

    void initMap();

    return () => {
      cancelled = true;
      mapInstanceRef.current = null;
    };
  }, []);

  // 탭 전환·레이아웃 변경 후 지도 영역 재계산
  useEffect(() => {
    if (mapStatus !== 'ready' || !mapInstanceRef.current) return;

    const relayoutMap = () => {
      mapInstanceRef.current?.relayout();
    };

    const timer = window.setTimeout(relayoutMap, 150);
    window.addEventListener('resize', relayoutMap);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', relayoutMap);
    };
  }, [mapStatus]);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(SHOP_LOCATION.fullAddress);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } catch {
      /* 클립보드 미지원 환경 */
    }
  };

  const mapLink = getKakaoMapLink(coords.lat, coords.lng);
  const navLink = getKakaoNavigationLink(coords.lat, coords.lng);

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <h2 className="section-title">찾아오는 길</h2>
      <p className="section-subtitle">
        그레이스샵 스튜디오 위치 및 카카오맵 길찾기 안내입니다.
      </p>

      {/* 지도 영역 */}
      <div className="card location-map-card">
        {mapStatus === 'fallback' ? (
          <div className="location-map-fallback">
            <MapPin size={32} color="var(--color-text-muted)" />
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              {kakaoAppKey
                ? '지도를 표시할 수 없습니다. 아래 버튼으로 카카오맵에서 확인해 주세요.'
                : '카카오맵 API 키가 설정되지 않았습니다. Cloudflare Pages Variables에 KAKAO_APP_KEY(또는 VITE_KAKAO_APP_KEY)를 추가해 주세요.'}
            </p>
            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px',
                backgroundColor: 'var(--color-text-main)',
                color: 'var(--color-primary-light)',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <ExternalLink size={14} /> 카카오맵에서 보기
            </a>
          </div>
        ) : (
          <div className="location-map-wrap">
            {mapStatus === 'loading' && (
              <div className="location-map-loading">지도를 불러오는 중...</div>
            )}
            <div ref={mapContainerRef} className="location-map-container" />
          </div>
        )}
      </div>

      {/* 주소 정보 */}
      <div className="card hover-lift" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <MapPin size={18} color="var(--color-text-main)" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '4px' }}>
              스튜디오 주소
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.5, wordBreak: 'keep-all' }}>
              {SHOP_LOCATION.fullAddress}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              {SHOP_LOCATION.building} · {SHOP_LOCATION.name}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyAddress}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '10px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--color-bg)',
            color: 'var(--color-text-main)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Copy size={14} />
          {copyDone ? '주소가 복사되었습니다' : '주소 복사하기'}
        </button>
      </div>

      {/* 교통 안내 */}
      <div className="card hover-lift" style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', color: 'var(--color-text-main)' }}>
          교통 안내
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <Train size={16} color="var(--color-text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600 }}>지하철</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                대구 1호선 안지랑역 · 대명역 도보 약 6~7분
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <Car size={16} color="var(--color-text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600 }}>주차</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                앞산리슈빌앤리마크 501동 지하1층 상가 · 단지 내 주차 이용 가능
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 카카오맵 바로가기 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <a
          href={navLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '14px',
            backgroundColor: '#FEE500',
            color: '#3A1D1D',
            borderRadius: 'var(--radius-sm)',
            fontSize: '14px',
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(254, 229, 0, 0.25)',
          }}
        >
          <Navigation size={18} />
          카카오맵 길찾기
        </a>
        <a
          href={mapLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '14px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-card)',
            color: 'var(--color-text-main)',
            fontSize: '14px',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          <ExternalLink size={16} />
          카카오맵에서 위치 보기
        </a>
      </div>

      <div style={{ marginTop: '20px' }}>
        <KakaoChannelCard onAlternateContact={onStartConsulting} />
      </div>
    </div>
  );
}
