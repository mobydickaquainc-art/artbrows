'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * 자동 방문 트래킹 · 페이지 로드/이동 시 POST /api/analytics/visit
 * 관리자·API 라우트는 제외 · 봇/자동화도 서버에서 감지.
 */
export function VisitTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/')) return;
    const lang = pathname.startsWith('/en') ? 'en' : pathname.startsWith('/zh') ? 'zh' : 'ko';
    const variant = pathname === '/manager' ? 'manager' : 'founder';
    // 페이지 초기 렌더 직후 · sendBeacon 시도 (실패 시 fetch)
    const payload = JSON.stringify({ path: pathname, lang, variant });
    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon('/api/analytics/visit', blob);
      } else {
        fetch('/api/analytics/visit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true });
      }
    } catch { /* silent */ }
  }, [pathname]);
  return null;
}
