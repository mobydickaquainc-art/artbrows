import '@/lib/artbrows/tokens.css';
import '../../../cardnews.css';
import Editor from '../../Editor';

export const metadata = {
  title: 'ARTbrows · 카드뉴스 편집 (Pro 3분할)',
};

/**
 * Pro 모드 · 기존 3분할 편집기 (2026-07-20 이전 방식)
 * - 2026-07-21 회의 결정: 기본은 SimpleEditor (Card-by-Card)
 * - 이 경로는 파워 유저 · 다국어 대량 편집 · 슬라이드 순서 조작 위주 사용
 */
export default async function EditProPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Editor id={id} />;
}
