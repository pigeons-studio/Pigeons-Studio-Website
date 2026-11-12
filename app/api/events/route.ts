import { NextResponse } from 'next/server';
import { listEvents } from '@/lib/events';

export async function GET(request: Request) {
  const locale = new URL(request.url).searchParams.get('locale');
  const events = await listEvents(locale);
  return NextResponse.json({ events, ready: Boolean(process.env.DATABASE_URL) });
}
