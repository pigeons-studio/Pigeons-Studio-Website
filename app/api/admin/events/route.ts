import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { createEvent, listEventsAdmin, type EventInput } from '@/lib/events';
import { memeOrigine } from '@/lib/origin';

function isUniqueViolation(error: unknown) {
  return typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === '23505';
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const events = await listEventsAdmin();
  if (!events) return NextResponse.json({ error: 'unavailable' }, { status: 503 });
  return NextResponse.json({ events });
}

export async function POST(request: Request) {
  if (!memeOrigine(request)) return NextResponse.json({ error: 'origin' }, { status: 403 });
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  let body: EventInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  try {
    const result = await createEvent(body);
    if ('error' in result) {
      const status = result.error === 'unavailable' ? 503 : 400;
      return NextResponse.json({ error: result.error }, { status });
    }
    return NextResponse.json({ event: result.event }, { status: 201 });
  } catch (error) {
    if (isUniqueViolation(error)) return NextResponse.json({ error: 'slug' }, { status: 409 });
    throw error;
  }
}
