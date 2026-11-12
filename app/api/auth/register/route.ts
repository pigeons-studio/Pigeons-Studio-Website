import { NextRequest, NextResponse } from 'next/server';
import { registerWithPassword } from '@/lib/accounts';

const MIN_FORM_MS = 1500;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, locale, antiBot } = body as {
      email?: string;
      password?: string;
      name?: string;
      locale?: string;
      antiBot?: { sliderValue?: number; honeypot?: string; elapsedMs?: number };
    };

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
    if (password.length < 8) {
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
