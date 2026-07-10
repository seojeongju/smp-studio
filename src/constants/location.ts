export const SHOP_LOCATION = {
  name: '그레이스샵',
  /** 카카오 지오코딩용 도로명 주소 */
  address: '대구광역시 남구 안지랑로 73',
  building: '앞산리슈빌앤리마크 501동 105호',
  fullAddress: '대구광역시 남구 안지랑로 73 앞산리슈빌앤리마크 501동 105호',
  /**
   * 지도 마커 좌표 (앞산리슈빌앤리마크 1단지 · 안지랑로 73)
   * 출처: 단지 공개 좌표 (lat 35.837801, lon 128.570477)
   * ※ 기존 폴백(35.84593, 128.57711)은 단지에서 약 1km 북쪽으로 어긋나 있었음
   */
  lat: 35.837801,
  lng: 128.570477,
};

export function getKakaoMapLink(lat: number, lng: number) {
  return `https://map.kakao.com/link/map/${encodeURIComponent(SHOP_LOCATION.name)},${lat},${lng}`;
}

export function getKakaoNavigationLink(lat: number, lng: number) {
  return `https://map.kakao.com/link/to/${encodeURIComponent(SHOP_LOCATION.name)},${lat},${lng}`;
}
