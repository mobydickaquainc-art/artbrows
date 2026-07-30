/**
 * / (root) · 2026-07-29 · 원장님/본부장님 시안 (course-detail_6.html) 기반 통합 홈
 * 이전 HomePageDesktop / HomePageMobile / UA 분기 폐기 · HomeV2Content 로 통합
 * (HomePageDesktop.tsx · HomePageMobile.tsx 는 참조용으로 남겨둠 · 사용 안 됨)
 */
import { MESSAGES } from '@/lib/i18n/messages';
import HomeV2Content from './HomeV2Content';

export const metadata = {
  title: MESSAGES.ko.meta.title,
  description: MESSAGES.ko.meta.description,
};

export default function Home() {
  return <HomeV2Content lang="ko" />;
}
