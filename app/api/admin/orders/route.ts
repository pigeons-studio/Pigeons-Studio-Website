import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { listOrders } from '@/lib/orders';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const orders = await listOrders();
  if (!orders) return NextResponse.json({ error: 'unavailable' }, { status: 503 });
  return NextResponse.json({ orders });
}
