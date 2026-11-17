import type { Metadata } from 'next';
import AdminNewsletter from './AdminNewsletter';

export const metadata: Metadata = {
  title: 'Newsletter',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminNewsletter />;
}
