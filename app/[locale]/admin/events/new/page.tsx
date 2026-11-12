import type { Metadata } from 'next';
import EventEditor from '../EventEditor';

export const metadata: Metadata = {
  title: 'Create event',
  robots: { index: false, follow: false },
};

export default function NewEventPage() {
  return <EventEditor />;
}
