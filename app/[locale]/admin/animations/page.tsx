import type { Metadata } from 'next';
import AdminAnimations from './AdminAnimations';

export const metadata: Metadata = {
  title: 'Animations',
  robots: { index: false, follow: false },
};

export default async function AdminAnimationsPage({ searchParams }: { searchParams: Promise<{ scene?: string }> }) {
  const { scene } = await searchParams;
  return <AdminAnimations initialScene={scene} />;
}
