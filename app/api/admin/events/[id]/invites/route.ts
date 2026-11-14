import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { createInvite } from '@/lib/events';
import { memeOrigine } from '@/lib/origin';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!memeOrigine(request)) return NextResponse.json({ error: 'origin' }, { status: 403 });
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const { id } = await context.params;
  const result = await createInvite(id);
  if ('error' in result) {
    const status = result.error === 'unavailable' ? 503 : 404;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json({ token: result.token }, { status: 201 });
}
