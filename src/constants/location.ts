export const SHOP_LOCATION = {
  name: '그레이스샵',
  address: '대구광역시 남구 안지랑로 73',
  building: '앞산리슈빌앤리마크 상가',
  fullAddress: '대구광역시 남구 안지랑로 73 앞산리슈빌앤리마크 상가',
  /** 지오코딩 실패 시 사용하는 기본 좌표 (앞산리슈빌앤리마크 1단지) */
  lat: 35.8456,
  lng: 128.5771,
};

export function getKakaoMapLink(lat: number, lng: number) {
  return `https://map.kakao.com/link/map/${encodeURIComponent(SHOP_LOCATION.name)},${lat},${lng}`;
}

export function getKakaoNavigationLink(lat: number, lng: number) {
  return `https://map.kakao.com/link/to/${encodeURIComponent(SHOP_LOCATION.name)},${lat},${lng}`;
}
