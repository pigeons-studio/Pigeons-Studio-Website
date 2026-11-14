import { NextRequest, NextResponse } from 'next/server';
import { registerWithPassword } from '@/lib/accounts';
import { memeOrigine } from '@/lib/origin';
import { motDePasseAcceptable } from '@/lib/passwords';
import { adresseIp, limiteAtteinte } from '@/lib/rate-limit';

const MIN_FORM_MS = 1500;

export async function POST(request: NextRequest) {
  if (!memeOrigine(request)) {
    return NextResponse.json({ error: 'origin' }, { status: 403 });
  }
  try {
    const body = await request.json();
    const { email, password, name, locale, acceptCgu, antiBot } = body as {
      email?: string;
      password?: string;
      name?: string;
      locale?: string;
      acceptCgu?: boolean;
      antiBot?: { sliderValue?: number; honeypot?: string; elapsedMs?: number };
    };

    if (await limiteAtteinte(`register:${adresseIp(request)}`, 8, 15 * 60 * 1000)) {
      return NextResponse.json({ error: 'rate' }, { status: 429 });
    }
    if (acceptCgu !== true) {
      return NextResponse.json({ error: 'cgu' }, { status: 400 });
    }

    if ((antiBot?.honeypot ?? '').trim()) {
      return NextResponse.json({ error: 'antiBot' }, { status: 400 });
    }
    const slider = Number(antiBot?.sliderValue ?? 0);
    const elapsed = Number(antiBot?.elapsedMs ?? 0);
    if (!Number.isFinite(slider) || slider < 100 || !Number.isFinite(elapsed) || elapsed < MIN_FORM_MS) {
      return NextResponse.json({ error: 'antiBot' }, { status: 400 });
    }

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'allFieldsRequired' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'invalidEmail' }, { status: 400 });
    }
    if (!motDePasseAcceptable(password)) {
      return NextResponse.json({ error: 'passwordTooShort' }, { status: 400 });
    }

    const result = await registerWithPassword({
      email,
      password,
      name,
      locale: locale === 'en' ? 'en' : 'fr',
    });
    if ('error' in result) {
      if (result.error === 'exists') return NextResponse.json({ error: 'emailExists' }, { status: 400 });
      return NextResponse.json({ error: 'server' }, { status: 503 });
    }
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json({ error: 'server' }, { status: 500 });
  }
}
