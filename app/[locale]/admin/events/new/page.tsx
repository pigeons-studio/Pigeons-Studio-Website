import type { Metadata } from 'next';
import EventEditor from '../EventEditor';

export const metadata: Metadata = {
  title: 'Create event',
  robots: { index: false, follow: false },
};

export default async function NewEventPage({ searchParams }: { searchParams: Promise<{ scene?: string }> }) {
  const { scene } = await searchParams;
  return <EventEditor initialScene={scene} />;
}
