import { NextResponse } from 'next/server';
import { adresseIp, limiteAtteinte } from '@/lib/rate-limit';
import { memeOrigine } from '@/lib/origin';
import { inscrire } from '@/lib/newsletter';

const FENETRE_MS = 15 * 60 * 1000;
const PLAFOND = 5;

export async function POST(request: Request) {
  if (!memeOrigine(request)) return NextResponse.json({ error: 'origin' }, { status: 403 });
  if (await limiteAtteinte(`newsletter:${adresseIp(request)}`, PLAFOND, FENETRE_MS)) {
    return NextResponse.json({ error: 'rate' }, { status: 429 });
  }
  let body: { email?: unknown; locale?: unknown; consent?: unknown; company?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  if (typeof body.company === 'string' && body.company.trim()) {
    return NextResponse.json({ status: 'sent' });
  }
  if (body.consent !== true) return NextResponse.json({ error: 'consent' }, { status: 400 });
  if (typeof body.email !== 'string') return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const locale = body.locale === 'en' ? 'en' : 'fr';
  const result = await inscrire(body.email, locale, 'newsletter');
  if ('error' in result) {
    const status = result.error === 'invalid' ? 400 : 503;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json(result);
}
