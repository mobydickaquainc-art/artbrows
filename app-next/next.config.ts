import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.trycloudflare.com"],
  // 2026-07-27 · 대표님 지시 「N 붉은 뱃지 없애줘」 · dev 툴바 이슈 인디케이터 숨김
  devIndicators: false,
};

export default nextConfig;
