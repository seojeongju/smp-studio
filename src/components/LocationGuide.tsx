import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Copy, ExternalLink, Train, Car } from 'lucide-react';
import {
  SHOP_LOCATION,
  getKakaoMapLink,
  getKakaoNavigationLink,
} from '../constants/location';
import { loadKakaoMapSdk } from '../utils/kakaoMap';

const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_MAP_APP_KEY as string | undefined;

export function LocationGuide() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ lat: SHOP_LOCATION.lat, lng: SHOP_LOCATION.lng });
  const [mapStatus, setMapStatus] = useState<'loading' | 'ready' | 'fallback' | 'error'>('loading');
  const [copyDone, setCopyDone] = useState(false);

  useEffect(() => {
    if (!KAKAO_APP_KEY || !mapContainerRef.current) {
      setMapStatus('fallback');
      return;
    }

    let cancelled = false;

    const initMap = async () => {
      try {
        const kakao = await loadKakaoMapSdk(KAKAO_APP_KEY);
        if (cancelled || !mapContainerRef.current) return;

        const geocoder = new kakao.maps.services.Geocoder();
        const placeMarker = (lat: number, lng: number) => {
          if (cancelled || !mapContainerRef.current) return;

          const center = new kakao.maps.LatLng(lat, lng);
          const map = new kakao.maps.Map(mapContainerRef.current, {
            center,
            level: 3,
          });

          const marker = new kakao.maps.Marker({ map, position: center });
          const infoWindow = new kakao.maps.InfoWindow({
            content: `<div style="padding:8px 12px;font-size:13px;font-weight:600;white-space:nowrap;">${SHOP_LOCATION.name}</div>`,
          });
          infoWindow.open(map, marker);

          setCoords({ lat, lng });
          setMapStatus('ready');
        };

        geocoder.addressSearch(SHOP_LOCATION.address, (result, status) => {
          if (cancelled) return;

          if (status === kakao.maps.services.Status.OK && result[0]) {
            placeMarker(parseFloat(result[0].y), parseFloat(result[0].x));
          } else {
            placeMarker(SHOP_LOCATION.lat, SHOP_LOCATION.lng);
          }
        });
      } catch {
        if (!cancelled) {
          setMapStatus('fallback');
        }
      }
    };

    initMap();

    return () => {
      cancelled = true;
    };
  }, []);

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
      <div
        className="card"
        style={{ padding: 0, overflow: 'hidden', marginBottom: '16px' }}
      >
        {mapStatus === 'loading' && (
          <div
            style={{
              height: '240px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-text-muted)',
              fontSize: '13px',
            }}
          >
            지도를 불러오는 중...
          </div>
        )}
        <div
          ref={mapContainerRef}
          style={{
            width: '100%',
            height: mapStatus === 'loading' ? 0 : '240px',
            overflow: 'hidden',
          }}
        />
        {mapStatus === 'fallback' && (
          <div
            style={{
              height: '240px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              backgroundColor: 'var(--color-primary-light)',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <MapPin size={32} color="var(--color-text-muted)" />
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              {KAKAO_APP_KEY
                ? '지도를 표시할 수 없습니다. 아래 버튼으로 카카오맵에서 확인해 주세요.'
                : '카카오맵 API 키가 설정되지 않았습니다. .env 파일에 VITE_KAKAO_MAP_APP_KEY를 추가해 주세요.'}
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
                앞산리슈빌앤리마크 단지 내 주차 이용 가능
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
    </div>
  );
};
