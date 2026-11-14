import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isSlug, registerForEvent, sendEventConfirmation, unregisterForEvent } from '@/lib/events';
import { memeOrigine } from '@/lib/origin';
import { adresseIp, FENETRE_TENTATIVES_MS, limiteAtteinte, PLAFOND_TENTATIVES } from '@/lib/rate-limit';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_FORM_MS = 1500;

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  if (!memeOrigine(request)) return NextResponse.json({ error: 'origin' }, { status: 403 });
  if (await limiteAtteinte(`event:${adresseIp(request)}`, PLAFOND_TENTATIVES, FENETRE_TENTATIVES_MS)) {
    return NextResponse.json({ error: 'rate' }, { status: 429 });
  }
  const { slug } = await context.params;
  if (!isSlug(slug)) return NextResponse.json({ error: 'missing' }, { status: 404 });

  let body: {
    name?: string;
    email?: string;
    invite?: string;
    locale?: string;
    compte?: boolean;
    antiBot?: { sliderValue?: number; honeypot?: string; elapsedMs?: number };
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  const invite = body.invite?.trim() || undefined;
  let name = body.name?.trim() ?? '';
  let email = body.email?.trim() ?? '';

  if (body.compte) {
    const session = await getServerSession(authOptions);
    email = session?.user?.email?.trim() ?? '';
    name = session?.user?.name?.trim() || email.split('@')[0] || '';
    if (!email) return NextResponse.json({ error: 'invalid' }, { status: 401 });
  } else {
    if ((body.antiBot?.honeypot ?? '').trim()) return NextResponse.json({ error: 'antiBot' }, { status: 400 });
    const slider = Number(body.antiBot?.sliderValue ?? 0);
    const elapsed = Number(body.antiBot?.elapsedMs ?? 0);
    if (!Number.isFinite(slider) || slider < 100 || !Number.isFinite(elapsed) || elapsed < MIN_FORM_MS) {
      return NextResponse.json({ error: 'antiBot' }, { status: 400 });
    }
  }

  if (name.length < 1 || name.length > 120 || !EMAIL.test(email)) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  const result = await registerForEvent(slug, name, email, invite);
  if (result.status === 'ok') {
    if (result.mail) {
      const locale = body.locale === 'en' ? 'en' : 'fr';
      await sendEventConfirmation(result.mail, locale).catch(() => {});
    }
    return NextResponse.json({ status: 'ok', remaining: result.remaining });
  }
  const status = result.status === 'unavailable' ? 503 : result.status === 'missing' ? 404 : result.status === 'invite' ? 410 : 409;
  return NextResponse.json({ error: result.status }, { status });
}

export async function DELETE(request: Request, context: { params: Promise<{ slug: string }> }) {
  if (!memeOrigine(request)) return NextResponse.json({ error: 'origin' }, { status: 403 });
  const { slug } = await context.params;
  if (!isSlug(slug)) return NextResponse.json({ error: 'missing' }, { status: 404 });
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ error: 'invalid' }, { status: 401 });
  const result = await unregisterForEvent(slug, email);
  if (result.status === 'ok') return NextResponse.json(result);
  const status = result.status === 'unavailable' ? 503 : 404;
  return NextResponse.json({ error: result.status }, { status });
}
