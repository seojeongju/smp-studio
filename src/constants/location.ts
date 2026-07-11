export const SHOP_LOCATION = {
  name: '그레이스샵',
  /** 카카오 지오코딩용 도로명 주소 */
  address: '대구광역시 남구 안지랑로 73',
  building: '앞산리슈빌앤리마크 501동 지하1층 105호',
  fullAddress: '대구광역시 남구 안지랑로 73 앞산리슈빌앤리마크 501동 지하1층 105호',
  /**
   * 지도 마커 좌표 — 카카오맵 등록 장소(그레이스샵) 기준
   * place.map.kakao.com/2132235142
   * 주소: 안지랑로 73 501동 지하1층 105호 (1단지 동측·안지랑로 쪽 상가)
   */
  lat: 35.8381615,
  lng: 128.5711545,
};

export function getKakaoMapLink(lat: number, lng: number) {
  return `https://map.kakao.com/link/map/${encodeURIComponent(SHOP_LOCATION.name)},${lat},${lng}`;
}

export function getKakaoNavigationLink(lat: number, lng: number) {
  return `https://map.kakao.com/link/to/${encodeURIComponent(SHOP_LOCATION.name)},${lat},${lng}`;
}

/** 카카오 JS SDK 실패 시 사용하는 OpenStreetMap 임베드 (API 키 불필요) */
export function getOsmEmbedUrl(lat: number, lng: number, delta = 0.004) {
  const left = lng - delta;
  const right = lng + delta;
  const top = lat + delta;
  const bottom = lat - delta;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lng}`;
}
