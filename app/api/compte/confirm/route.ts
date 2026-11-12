import { NextRequest, NextResponse } from 'next/server';
import { confirmEmail } from '@/lib/accounts';
import { baseUrl } from '@/lib/seo';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? '';
  const locale = request.nextUrl.searchParams.get('locale') === 'en' ? 'en' : 'fr';
  const ok = await confirmEmail(token);
  const dest = new URL(`/${locale}`, baseUrl);
  dest.searchParams.set('compte', ok ? 'ok' : 'invalide');
  return NextResponse.redirect(dest);
}
