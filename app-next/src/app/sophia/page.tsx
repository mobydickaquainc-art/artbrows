/**
 * /sophia · 2026-07-29 · HomeV2Content 공용 컴포넌트로 통합
 * / 와 /sophia 동일 렌더링 (A/B 비교 이력용 별도 URL 유지)
 * 이전 인라인 코드는 히스토리 참조: git show ab4c2d4:app-next/src/app/sophia/page.tsx
 */
import HomeV2Content from '../HomeV2Content';

export const metadata = {
  title: '극사실눈썹 | ARTBROWS ACADEMY 정규 커리큘럼 안내',
  description: '특허받은 극사실눈썹, 창시자 장미지 대표원장이 직접 가르치는 4단계 커리큘럼. 이지클래스부터 실전실습까지.',
};

export default function SophiaPage() {
  return <HomeV2Content />;
}
