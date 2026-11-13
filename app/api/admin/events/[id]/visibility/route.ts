import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { setEventHidden } from '@/lib/events';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
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
