import type { Metadata } from 'next';
import AdminUsers from './AdminUsers';

export const metadata: Metadata = {
  title: 'Comptes',
  robots: { index: false, follow: false },
};

export default function AdminUsersPage() {
  return <AdminUsers />;
}
