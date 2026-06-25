export function getKakaoAppKey(): string | undefined {
  const key =
    import.meta.env.VITE_KAKAO_APP_KEY || import.meta.env.VITE_KAKAO_MAP_APP_KEY;
  return key?.trim() || undefined;
}

export const KAKAO_CHANNEL = {
  name: '그레이스샵',
  /** 채널 홈 URL의 pf.kakao.com/ 이후 ID (예: _ZeUTxl). 미설정 시 빈 문자열 */
  publicId: (import.meta.env.VITE_KAKAO_CHANNEL_ID as string | undefined)?.trim() || '',
};

export function isKakaoChannelConfigured(): boolean {
  return Boolean(KAKAO_CHANNEL.publicId);
}

export function getKakaoChannelChatUrl(): string | null {
  return KAKAO_CHANNEL.publicId
    ? `https://pf.kakao.com/${KAKAO_CHANNEL.publicId}/chat`
    : null;
}

export function getKakaoChannelHomeUrl(): string | null {
  return KAKAO_CHANNEL.publicId
    ? `https://pf.kakao.com/${KAKAO_CHANNEL.publicId}`
    : null;
}
