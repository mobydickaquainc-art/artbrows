import { MESSAGES } from '@/lib/i18n/messages';
import { headers } from 'next/headers';
import HomePageDesktop from './HomePageDesktop';
import HomePageMobile from './HomePageMobile';

export const metadata = {
  title: MESSAGES.ko.meta.title,
  description: MESSAGES.ko.meta.description,
};

// 2026-07-27 · 대표님 지시 「데스크톱·모바일 2개 분리」 → user-agent 로 SSR 분기
// 반응형 미디어쿼리 X · 유미처럼 진짜 두 컴포넌트 사용
function isMobileUA(ua: string): boolean {
  return /Mobile|Android|iPhone|iPad|iPod|IEMobile|Opera Mini|BlackBerry/i.test(ua);
}

// 2026-07-27 · 대표님 시연용 · ?device=mobile / ?device=desktop 쿼리로 UA 우회 가능
export default async function Home({ searchParams }: { searchParams: Promise<{ device?: string }> }) {
  const h = await headers();
  const ua = h.get('user-agent') ?? '';
  const sp = await searchParams;
  const forced = sp?.device;
  const mobile = forced === 'mobile' ? true : forced === 'desktop' ? false : isMobileUA(ua);
  return mobile ? <HomePageMobile lang="ko" /> : <HomePageDesktop lang="ko" />;
}
