import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { envoyerLettre, essaiLettre } from '@/lib/newsletter';
import { memeOrigine } from '@/lib/origin';

export const maxDuration = 60;

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!memeOrigine(request)) return NextResponse.json({ error: 'origin' }, { status: 403 });
  const admin = await requireAdmin();
  if (!admin?.user?.email) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const { id } = await context.params;
  let body: { test?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  if (body.test === true) {
    const result = await essaiLettre(id, admin.user.email);
    if ('error' in result) {
      const status = result.error === 'missing' ? 404 : result.error === 'empty' ? 400 : 503;
      return NextResponse.json({ error: result.error }, { status });
    }
    return NextResponse.json(result);
  }
  const result = await envoyerLettre(id);
  if ('error' in result) {
    const status = result.error === 'missing' ? 404 : 503;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json(result);
}
