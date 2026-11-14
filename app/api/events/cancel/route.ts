import { NextResponse } from 'next/server';
import { lireDesinscription } from '@/lib/event-cancel';
import { unregisterForEvent } from '@/lib/events';
import { memeOrigine } from '@/lib/origin';
import { adresseIp, FENETRE_TENTATIVES_MS, limiteAtteinte, PLAFOND_TENTATIVES } from '@/lib/rate-limit';

export async function POST(request: Request) {
  if (!memeOrigine(request)) return NextResponse.json({ error: 'origin' }, { status: 403 });
  if (await limiteAtteinte(`event-cancel:${adresseIp(request)}`, PLAFOND_TENTATIVES, FENETRE_TENTATIVES_MS)) {
    return NextResponse.json({ error: 'rate' }, { status: 429 });
  }
  let token = '';
  try {
    token = String((await request.json()).token || '');
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  const lu = lireDesinscription(token);
  if (!lu) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const result = await unregisterForEvent(lu.slug, lu.email);
  if (result.status === 'ok') return NextResponse.json({ ok: true });
  const status = result.status === 'unavailable' ? 503 : 404;
  return NextResponse.json({ error: result.status }, { status });
}
