import { MESSAGES } from '@/lib/i18n/messages';
import HomePage from '../HomePage';

export const metadata = {
  title: `${MESSAGES.ko.meta.title} · 본부장 스토리보드 버전`,
  description: '본부장(이서연) 스토리보드 PDF 원안 그대로 재현 · 핫핑크 CTA + 팔레트 힌트 + WILD BROW 라벨 · 원장님 정본 vs 비교용',
};

export default function ManagerHome() {
  return <HomePage lang="ko" variant="manager" />;
}
