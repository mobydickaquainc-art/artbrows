import { MESSAGES } from '@/lib/i18n/messages';
import HomeV2Content from '../HomeV2Content';

export const metadata = {
  title: MESSAGES.en.meta.title,
  description: MESSAGES.en.meta.description,
};

export default function EnHome() {
  return <HomeV2Content lang="en" />;
}
