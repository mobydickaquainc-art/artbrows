import '@/lib/artbrows/tokens.css';
import '../../cardnews.css';
import SimpleEditor from '../SimpleEditor';

export const metadata = {
  title: 'ARTbrows · 카드뉴스 편집',
};

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SimpleEditor id={id} />;
}
