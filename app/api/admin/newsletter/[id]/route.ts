import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { lireLettre, modifierLettre, supprimerLettre, type LettreSaisie } from '@/lib/newsletter';
import { memeOrigine } from '@/lib/origin';

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const { id } = await context.params;
  const detail = await lireLettre(id);
  if (!detail) return NextResponse.json({ error: 'missing' }, { status: 404 });
  return NextResponse.json(detail);
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!memeOrigine(request)) return NextResponse.json({ error: 'origin' }, { status: 403 });
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const { id } = await context.params;
  let body: LettreSaisie;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  const result = await modifierLettre(id, body);
  if ('error' in result) {
    const status = result.error === 'unavailable' ? 503 : result.error === 'missing' ? 404 : 409;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json({ lettre: result.lettre });
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!memeOrigine(request)) return NextResponse.json({ error: 'origin' }, { status: 403 });
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const { id } = await context.params;
  const result = await supprimerLettre(id);
  if ('error' in result) {
    const status = result.error === 'unavailable' ? 503 : result.error === 'missing' ? 404 : 409;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json({ ok: true });
}
