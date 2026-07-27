import { MESSAGES } from '@/lib/i18n/messages';
import HomePage from '../HomePage';

export const metadata = {
  title: MESSAGES.en.meta.title,
  description: MESSAGES.en.meta.description,
};

export default function EnHome() {
  return <HomePage lang="en" />;
}
