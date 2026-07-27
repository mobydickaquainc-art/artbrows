import '@/lib/artbrows/tokens.css';
import './cardnews.css';
import Dashboard from './Dashboard';

export const metadata = {
  title: 'ARTbrows · 카드뉴스 프로젝트',
  description: '카드뉴스 프로젝트 관리 대시보드 (로컬 JSON)',
};

export default function CardnewsPage() {
  return <Dashboard />;
}
