import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { deleteInvite, setInviteSent } from '@/lib/events';

export async function PATCH(request: Request, context: { params: Promise<{ id: string; token: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const { id, token } = await context.params;
  let body: { sent?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  if (typeof body.sent !== 'boolean') return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const result = await setInviteSent(id, token, body.sent);
  if ('error' in result) {
    const status = result.error === 'unavailable' ? 503 : result.error === 'missing' ? 404 : 409;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string; token: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const { id, token } = await context.params;
  const result = await deleteInvite(id, token);
  if ('error' in result) {
    const status = result.error === 'unavailable' ? 503 : 404;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json({ ok: true });
}
