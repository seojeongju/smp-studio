import { SHOP_LOCATION } from '../constants/location';

/** 카카오맵 CustomOverlay용 브랜드 마커 HTML */
export function createShopMapMarkerHtml(): string {
  const logoUrl = '/logo.png';

  return `
    <div style="
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: 'Outfit', 'Noto Sans KR', sans-serif;
      pointer-events: none;
      user-select: none;
      transform: translateY(-4px);
    ">
      <div style="
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px 8px 8px;
        background: linear-gradient(135deg, #FFFFFF 0%, #FAF6F0 100%);
        border: 1.5px solid #CBB9A7;
        border-radius: 14px;
        box-shadow: 0 8px 24px rgba(58, 50, 44, 0.14), 0 2px 6px rgba(58, 50, 44, 0.06);
        white-space: nowrap;
      ">
        <div style="
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1.5px solid #CBB9A7;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(58, 50, 44, 0.08);
        ">
          <img
            src="${logoUrl}"
            alt=""
            style="width: 100%; height: 100%; object-fit: cover; display: block;"
          />
        </div>
        <div style="display: flex; flex-direction: column; gap: 1px;">
          <span style="
            font-size: 8px;
            font-weight: 800;
            letter-spacing: 1.2px;
            color: #8C7F72;
            line-height: 1;
          ">PREMIUM STUDIO</span>
          <span style="
            font-size: 13px;
            font-weight: 700;
            color: #3A322C;
            letter-spacing: -0.2px;
            line-height: 1.2;
          ">${SHOP_LOCATION.name}</span>
        </div>
      </div>

      <div style="
        width: 0;
        height: 0;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-top: 8px solid #CBB9A7;
        margin-top: -1px;
        filter: drop-shadow(0 2px 2px rgba(58, 50, 44, 0.08));
      "></div>
      <div style="
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 6px solid #FAF6F0;
        margin-top: -8px;
      "></div>

      <div style="
        width: 12px;
        height: 12px;
        margin-top: 2px;
        border-radius: 50%;
        background: #3A322C;
        border: 2.5px solid #F4EBE1;
        box-shadow: 0 2px 8px rgba(58, 50, 44, 0.25);
      "></div>
    </div>
  `;
}
