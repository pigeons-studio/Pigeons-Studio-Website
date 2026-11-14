import type { Metadata } from 'next';
import AdminOrders from './AdminOrders';

export const metadata: Metadata = {
  title: 'Orders',
  robots: { index: false, follow: false },
};

export default function AdminOrdersPage() {
  return <AdminOrders />;
}
