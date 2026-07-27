import { MESSAGES } from '@/lib/i18n/messages';
import HomePage from '../HomePage';

export const metadata = {
  title: MESSAGES.zh.meta.title,
  description: MESSAGES.zh.meta.description,
};

export default function ZhHome() {
  return <HomePage lang="zh" />;
}
