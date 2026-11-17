import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { creerLettre, listerLettres, type LettreSaisie } from '@/lib/newsletter';
import { memeOrigine } from '@/lib/origin';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const liste = await listerLettres();
  if (!liste) return NextResponse.json({ error: 'unavailable' }, { status: 503 });
  return NextResponse.json(liste);
}

export async function POST(request: Request) {
  if (!memeOrigine(request)) return NextResponse.json({ error: 'origin' }, { status: 403 });
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  let body: LettreSaisie = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const result = await creerLettre(body);
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: 503 });
  return NextResponse.json({ lettre: result.lettre });
}
