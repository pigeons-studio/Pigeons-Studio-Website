import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { setEventHidden } from '@/lib/events';
import { memeOrigine } from '@/lib/origin';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!memeOrigine(request)) return NextResponse.json({ error: 'origin' }, { status: 403 });
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const { id } = await context.params;
  let hidden: unknown;
  try {
    hidden = (await request.json()).hidden;
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  if (typeof hidden !== 'boolean') return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const result = await setEventHidden(id, hidden);
  if ('error' in result) {
    const status = result.error === 'unavailable' ? 503 : 404;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json(result);
}
