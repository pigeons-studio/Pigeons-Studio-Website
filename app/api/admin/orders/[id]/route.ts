import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { setOrderStatus } from '@/lib/orders';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const { id } = await context.params;
  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  const order = await setOrderStatus(id, body.status || '');
  if (!order) return NextResponse.json({ error: 'missing' }, { status: 404 });
  return NextResponse.json({ order });
}
