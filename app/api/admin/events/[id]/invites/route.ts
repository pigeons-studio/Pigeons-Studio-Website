import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { createInvite } from '@/lib/events';

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
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
