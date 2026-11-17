import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { desinscrireEmail, etatNewsletter, inscrire } from '@/lib/newsletter';
import { memeOrigine } from '@/lib/origin';
import { adresseIp, limiteAtteinte } from '@/lib/rate-limit';

const FENETRE_MS = 15 * 60 * 1000;
const PLAFOND = 5;

async function emailSession() {
  const session = await getServerSession(authOptions);
  return session?.user?.email?.trim().toLowerCase() || '';
}

export async function GET() {
  const email = await emailSession();
  if (!email) return NextResponse.json({ error: 'auth' }, { status: 401 });
  const etat = await etatNewsletter(email);
  return NextResponse.json({ status: etat?.status || 'none' });
}

export async function POST(request: Request) {
  if (!memeOrigine(request)) return NextResponse.json({ error: 'origin' }, { status: 403 });
  const email = await emailSession();
  if (!email) return NextResponse.json({ error: 'auth' }, { status: 401 });
  let body: { action?: unknown; consent?: unknown; locale?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  if (body.action === 'unsubscribe') {
    await desinscrireEmail(email);
    return NextResponse.json({ status: 'unsubscribed' });
  }
  if (body.consent !== true) return NextResponse.json({ error: 'consent' }, { status: 400 });
  if (await limiteAtteinte(`newsletter:${adresseIp(request)}`, PLAFOND, FENETRE_MS)) {
    return NextResponse.json({ error: 'rate' }, { status: 429 });
  }
  const locale = body.locale === 'en' ? 'en' : 'fr';
  const result = await inscrire(email, locale, 'profile');
  if ('error' in result) {
    const status = result.error === 'invalid' ? 400 : 503;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json(result);
}
