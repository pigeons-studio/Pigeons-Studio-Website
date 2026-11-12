import type { Metadata } from 'next';
import AdminEvents from './AdminEvents';

export const metadata: Metadata = {
  title: 'Events',
  robots: { index: false, follow: false },
};

export default function AdminEventsPage() {
  return <AdminEvents />;
}
