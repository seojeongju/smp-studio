import { loadPublicConfig } from './kakao';
import { trackCta } from '../utils/analytics';

let runtimeBookingUrl: string | null | undefined;
let runtimeTalkUrl: string | null | undefined;

function buildTimeBookingUrl(): string {
  return (import.meta.env.VITE_NAVER_BOOKING_URL as string | undefined)?.trim() || '';
}

function buildTimeTalkUrl(): string {
  const full = (import.meta.env.VITE_NAVER_TALK_URL as string | undefined)?.trim();
  if (full) return full;
  const id = (import.meta.env.VITE_NAVER_TALK_ID as string | undefined)?.trim();
  if (!id) return '';
  if (id.startsWith('http')) return id;
  return `https://talk.naver.com/${id.replace(/^\/+/, '')}`;
}

function normalizeTalkUrl(raw: string | null | undefined): string | undefined {
  const value = raw?.trim();
  if (!value) return undefined;
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  return `https://talk.naver.com/${value.replace(/^\/+/, '')}`;
}

/** 네이버 예약(스마트플레이스) 예약 페이지 URL */
export function getNaverBookingUrl(): string | undefined {
  const fromRuntime = runtimeBookingUrl?.trim();
  if (fromRuntime) return fromRuntime;
  return buildTimeBookingUrl() || undefined;
}

export function isNaverBookingConfigured(): boolean {
  return Boolean(getNaverBookingUrl());
}

export function setNaverBookingUrl(url: string | null | undefined) {
  runtimeBookingUrl = url?.trim() || null;
}

export function openNaverBooking(): boolean {
  const url = getNaverBookingUrl();
  if (!url) return false;
  trackCta('booking');
  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
}

/** 네이버 톡톡 실시간 상담 URL (talk.naver.com/...) */
export function getNaverTalkUrl(): string | undefined {
  return normalizeTalkUrl(runtimeTalkUrl) || normalizeTalkUrl(buildTimeTalkUrl());
}

export function isNaverTalkConfigured(): boolean {
  return Boolean(getNaverTalkUrl());
}

export function setNaverTalkUrl(url: string | null | undefined) {
  runtimeTalkUrl = url?.trim() || null;
}

export function openNaverTalk(): boolean {
  const url = getNaverTalkUrl();
  if (!url) return false;
  trackCta('talk');
  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
}

export async function ensureNaverConfig(): Promise<{
  bookingUrl?: string;
  talkUrl?: string;
}> {
  const config = await loadPublicConfig();
  setNaverBookingUrl(config.naverBookingUrl);
  setNaverTalkUrl(config.naverTalkUrl);
  return {
    bookingUrl: getNaverBookingUrl(),
    talkUrl: getNaverTalkUrl(),
  };
}

export const NAVER_TALK = {
  name: '그레이스샵',
  label: '네이버 톡톡',
};
