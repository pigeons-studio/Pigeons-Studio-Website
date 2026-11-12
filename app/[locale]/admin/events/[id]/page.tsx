import type { Metadata } from 'next';
import EventEditor from '../EventEditor';

export const metadata: Metadata = {
  title: 'Edit event',
  robots: { index: false, follow: false },
};

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EventEditor id={id} />;
}
