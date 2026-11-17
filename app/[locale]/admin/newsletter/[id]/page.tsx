import type { Metadata } from 'next';
import NewsletterEditor from '../NewsletterEditor';

export const metadata: Metadata = {
  title: 'Newsletter',
  robots: { index: false, follow: false },
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <NewsletterEditor id={id} />;
}
