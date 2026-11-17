import { NextResponse } from 'next/server';
import { desinscrireJeton } from '@/lib/newsletter';

async function jetonDe(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('token') || '';
  const type = request.headers.get('content-type') || '';
  if (type.includes('application/json')) {
    const body = await request.json().catch(() => null) as { token?: unknown } | null;
    if (typeof body?.token === 'string' && body.token) return body.token;
  }
  return query;
}

export async function POST(request: Request) {
  const token = await jetonDe(request);
  if (!token) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const result = await desinscrireJeton(token);
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ ok: true });
}
