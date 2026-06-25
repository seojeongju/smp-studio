export const SHOP_LOCATION = {
  name: '그레이스샵',
  /** 카카오 지오코딩용 도로명 주소 */
  address: '대구광역시 남구 안지랑로 73',
  building: '앞산리슈빌앤리마크 501동 105호',
  fullAddress: '대구광역시 남구 안지랑로 73 앞산리슈빌앤리마크 501동 105호',
  /** 지오코딩 시 우선 검색할 상세 주소 */
  geocodeQueries: [
    '대구광역시 남구 안지랑로 73 앞산리슈빌앤리마크 501동 105호',
    '대구광역시 남구 안지랑로 73 앞산리슈빌앤리마크 501동',
    '대구광역시 남구 안지랑로 73',
  ],
  /** 지오코딩 실패 시 사용 (앞산리슈빌앤리마크 501동) */
  lat: 35.84593,
  lng: 128.57711,
};

export function getKakaoMapLink(lat: number, lng: number) {
  return `https://map.kakao.com/link/map/${encodeURIComponent(SHOP_LOCATION.name)},${lat},${lng}`;
}

export function getKakaoNavigationLink(lat: number, lng: number) {
  return `https://map.kakao.com/link/to/${encodeURIComponent(SHOP_LOCATION.name)},${lat},${lng}`;
}
