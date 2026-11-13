import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { setAccountRole } from '@/lib/accounts';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const { id } = await context.params;

  let role: 'admin' | 'user' = 'admin';
  const text = await request.text();
  if (text) {
    let body: { role?: string };
    try {
      body = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: 'invalid' }, { status: 400 });
    }
    if (body.role === 'user') role = 'user';
    else if (body.role !== 'admin' && body.role !== undefined) {
      return NextResponse.json({ error: 'invalid' }, { status: 400 });
    }
  }

  const result = await setAccountRole(id, role, admin.user?.email ?? undefined);
  if ('error' in result) {
    const status = result.error === 'unavailable' ? 503 : result.error === 'missing' ? 404 : 409;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json({ ok: true });
}
