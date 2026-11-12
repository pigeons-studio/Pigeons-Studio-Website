import { NextResponse } from 'next/server';
import { isSlug, registerForEvent, sendEventConfirmation } from '@/lib/events';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_FORM_MS = 1500;

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  if (!isSlug(slug)) return NextResponse.json({ error: 'missing' }, { status: 404 });

  let body: {
    name?: string;
    email?: string;
    invite?: string;
    locale?: string;
    antiBot?: { sliderValue?: number; honeypot?: string; elapsedMs?: number };
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  const name = body.name?.trim() ?? '';
  const email = body.email?.trim() ?? '';
  const invite = body.invite?.trim() || undefined;
  if (name.length < 1 || name.length > 120 || !EMAIL.test(email)) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  if (invite) {
    if ((body.antiBot?.honeypot ?? '').trim()) return NextResponse.json({ error: 'antiBot' }, { status: 400 });
    const slider = Number(body.antiBot?.sliderValue ?? 0);
    const elapsed = Number(body.antiBot?.elapsedMs ?? 0);
    if (!Number.isFinite(slider) || slider < 100 || !Number.isFinite(elapsed) || elapsed < MIN_FORM_MS) {
      return NextResponse.json({ error: 'antiBot' }, { status: 400 });
    }
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
