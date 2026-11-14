import { NextRequest, NextResponse } from 'next/server';
import { confirmEmail } from '@/lib/accounts';
import { baseUrl } from '@/lib/seo';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? '';
  const locale = request.nextUrl.searchParams.get('locale') === 'en' ? 'en' : 'fr';
  const ok = await confirmEmail(token);
  const dest = ok === 'email'
    ? new URL(`/${locale}/profile`, baseUrl)
    : new URL(`/${locale}`, baseUrl);
  if (ok === 'email') dest.searchParams.set('email', 'confirme');
  else dest.searchParams.set('compte', ok === 'signup' ? 'ok' : 'invalide');
  return NextResponse.redirect(dest);
}
