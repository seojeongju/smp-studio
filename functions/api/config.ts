import type { Env } from '../types';
import { json } from '../lib/auth';

/**
 * GET /api/config — 공개 런타임 설정 (카카오 JS 키 등)
 * Vite 빌드 시점 변수 없이도 Cloudflare Pages Variables로 지도 연동 가능
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const env = context.env;
  const kakaoAppKey =
    env.KAKAO_APP_KEY?.trim() ||
    env.VITE_KAKAO_APP_KEY?.trim() ||
    env.VITE_KAKAO_MAP_APP_KEY?.trim() ||
    '';

  const kakaoChannelId =
    env.KAKAO_CHANNEL_ID?.trim() ||
    env.VITE_KAKAO_CHANNEL_ID?.trim() ||
    '';

  const naverBookingUrl =
    env.NAVER_BOOKING_URL?.trim() ||
    env.VITE_NAVER_BOOKING_URL?.trim() ||
    '';

  const talkId =
    env.NAVER_TALK_ID?.trim() ||
    env.VITE_NAVER_TALK_ID?.trim() ||
    '';
  const naverTalkUrl =
    env.NAVER_TALK_URL?.trim() ||
    env.VITE_NAVER_TALK_URL?.trim() ||
    (talkId
      ? talkId.startsWith('http')
        ? talkId
        : `https://talk.naver.com/${talkId.replace(/^\/+/, '')}`
      : '');

  return json(
    {
      success: true,
      kakaoAppKey: kakaoAppKey || null,
      kakaoChannelId: kakaoChannelId || null,
      naverBookingUrl: naverBookingUrl || null,
      naverTalkUrl: naverTalkUrl || null,
    },
    200,
    {
      // 키 변경 반영을 위해 짧게 캐시
      'Cache-Control': 'public, max-age=60',
    }
  );
};
