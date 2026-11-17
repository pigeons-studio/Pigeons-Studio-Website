import type { Metadata } from 'next';
import NewsletterEditor from '../NewsletterEditor';

export const metadata: Metadata = {
  title: 'Newsletter',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <NewsletterEditor />;
}
