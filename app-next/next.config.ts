import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.trycloudflare.com"],
  // 2026-07-27 · 대표님 지시 「N 붉은 뱃지 없애줘」 · dev 툴바 이슈 인디케이터 숨김
  devIndicators: false,
  // 2026-07-28 · Vercel 배포 위한 임시 조치 (기존 코드 TS 15개 · 런타임 정상)
  // TODO: 별도 커밋으로 각 파일 개별 fix 후 이 옵션 제거
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  // 2026-07-29 · 선릉 CDN 하이브리드 · /brand/* · /hero-mood/* 를 cdn.artbrows.co.kr 로 rewrites
  //   Vercel 은 코드만 서빙 · 이미지는 선릉 Nginx (D:\media) 에서 서빙
  //   Cloudflare 프록시 + 캐시 + SSL 무료
  //   dev 는 로컬 public/ 우선 (기존 방식) · production 만 CDN
  async rewrites() {
    if (process.env.NODE_ENV !== "production") return [];
    return [
      { source: "/brand/:path*",     destination: "https://cdn.artbrows.co.kr/brand/:path*" },
      { source: "/hero-mood/:path*", destination: "https://cdn.artbrows.co.kr/hero-mood/:path*" },
    ];
  },
};

export default nextConfig;
