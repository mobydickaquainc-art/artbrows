/**
 * 카카오 채널/오픈채팅 URL 중앙 관리 (2026-07-27)
 *   env override 지원 · 실 URL 확정 시 .env.local 만 수정하면 전 페이지 반영
 *
 * K1 = 오픈채팅 (무료 강의방 · 수강생 락인 · 브로드캐스트)
 * CHANNEL = 카톡 채널 (1:1 상담 정본 · 챗봇 · 알림톡 발신)
 */

/** 무료 강의방 · K1 오픈채팅 (수강생 락인) */
export const KAKAO_K1_URL =
  process.env.NEXT_PUBLIC_KAKAO_K1_URL ?? "https://open.kakao.com/o/gWeAkSzi";

/** 카톡 채널 홈 (구독·프로필) — pf.kakao.com/_xXXXX 형식 */
export const KAKAO_CHANNEL_HOME =
  process.env.NEXT_PUBLIC_KAKAO_CHANNEL_HOME ?? "https://pf.kakao.com/_MijiArtbrows"; // TODO 실 URL 대기

/** 카톡 채널 「친구 추가」 딥링크 */
export const KAKAO_CHANNEL_ADD =
  process.env.NEXT_PUBLIC_KAKAO_CHANNEL_ADD ?? `${KAKAO_CHANNEL_HOME}/friend`;

/** 카톡 채널 「1:1 채팅 시작」 딥링크 (챗봇 진입) */
export const KAKAO_CHANNEL_CHAT =
  process.env.NEXT_PUBLIC_KAKAO_CHANNEL_CHAT ?? `${KAKAO_CHANNEL_HOME}/chat`;

/** 인스타 */
export const INSTA_URL = "https://www.instagram.com/artbrows_academy/";

/** 카톡 채널 실제 등록 여부 (env 있으면 true) */
export const KAKAO_CHANNEL_READY = !!process.env.NEXT_PUBLIC_KAKAO_CHANNEL_HOME;

/**
 * 목적별 CTA 이름 매핑 (홈피 UI 카피 통일)
 */
export const KAKAO_CTA_LABEL = {
  k1: {
    ko: "K1 무료 강의방",
    en: "K1 Free Class Room",
    zh: "K1 免费讲义群",
  },
  channelChat: {
    ko: "1:1 카톡 상담",
    en: "1:1 KakaoTalk Consult",
    zh: "1:1 咨询",
  },
  channelAdd: {
    ko: "카톡 채널 추가",
    en: "Add KakaoTalk Channel",
    zh: "添加官方账号",
  },
} as const;
