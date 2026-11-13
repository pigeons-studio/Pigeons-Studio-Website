import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createOrder, listOrders, type OrderLineInput } from '@/lib/orders';

export async function GET() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ error: 'auth' }, { status: 401 });
  const orders = await listOrders({ email, userId: session.user?.id });
  if (!orders) return NextResponse.json({ error: 'unavailable' }, { status: 503 });
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  let body: { kind?: string; locale?: string; name?: string; email?: string; items?: OrderLineInput[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  const name = session?.user?.name?.trim() || (typeof body.name === 'string' ? body.name : '');
  const email = session?.user?.email?.trim() || (typeof body.email === 'string' ? body.email : '');
  const result = await createOrder({
    kind: body.kind || '',
    locale: body.locale,
    name,
    email,
    items: Array.isArray(body.items) ? body.items : [],
  });
  if ('error' in result) {
    const status = result.error === 'unavailable' ? 503 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json({ order: result.order }, { status: 201 });
}
