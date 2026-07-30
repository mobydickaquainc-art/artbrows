import { MESSAGES } from '@/lib/i18n/messages';
import HomeV2Content from '../HomeV2Content';

export const metadata = {
  title: MESSAGES.zh.meta.title,
  description: MESSAGES.zh.meta.description,
};

export default function ZhHome() {
  return <HomeV2Content lang="zh" />;
}
