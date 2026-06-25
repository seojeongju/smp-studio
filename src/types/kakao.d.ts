declare namespace kakao.maps {
  class LatLng {
    constructor(lat: number, lng: number);
    getLat(): number;
    getLng(): number;
  }

  class Map {
    constructor(container: HTMLElement, options: { center: LatLng; level: number });
    setCenter(latlng: LatLng): void;
  }

  class Marker {
    constructor(options: { map: Map; position: LatLng });
    setMap(map: Map | null): void;
  }

  class InfoWindow {
    constructor(options: { content: string });
    open(map: Map, marker: Marker): void;
  }

  namespace services {
    class Geocoder {
      addressSearch(
        address: string,
        callback: (result: { x: string; y: string }[], status: Status) => void
      ): void;
    }

    enum Status {
      OK = 'OK',
      ZERO_RESULT = 'ZERO_RESULT',
      ERROR = 'ERROR',
    }
  }

  function load(callback: () => void): void;
}

interface KakaoMaps {
  maps: typeof kakao.maps;
}

interface Window {
  kakao: KakaoMaps;
}
