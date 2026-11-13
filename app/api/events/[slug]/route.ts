import { NextResponse } from 'next/server';
import { getEvent, isSlug } from '@/lib/events';

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  if (!isSlug(slug)) return NextResponse.json({ error: 'missing' }, { status: 404 });
  const locale = new URL(request.url).searchParams.get('locale');
  const event = await getEvent(slug, locale);
  if (!event) return NextResponse.json({ error: 'missing' }, { status: 404 });
  return NextResponse.json({ event });
}
