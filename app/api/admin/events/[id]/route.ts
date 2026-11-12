import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { eventAdminDetail, updateEvent, type EventInput } from '@/lib/events';

function isUniqueViolation(error: unknown) {
  return typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === '23505';
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const { id } = await context.params;
  const detail = await eventAdminDetail(id);
  if (!detail) return NextResponse.json({ error: 'missing' }, { status: 404 });
  return NextResponse.json(detail);
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const { id } = await context.params;
  let body: EventInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  try {
    const result = await updateEvent(id, body);
    if ('error' in result) {
      const status = result.error === 'unavailable' ? 503 : result.error === 'missing' ? 404 : 400;
      return NextResponse.json({ error: result.error }, { status });
    }
    return NextResponse.json({ event: result.event });
  } catch (error) {
    if (isUniqueViolation(error)) return NextResponse.json({ error: 'slug' }, { status: 409 });
    throw error;
  }
}
