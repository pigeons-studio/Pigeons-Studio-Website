import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { renommerCompte, supprimerCompte } from '@/lib/account-actions';
import { authOptions } from '@/lib/auth';
import { memeOrigine } from '@/lib/origin';

async function sessionEmail() {
  const session = await getServerSession(authOptions);
  return session?.user?.email?.trim() || '';
}

export async function PATCH(request: Request) {
  if (!memeOrigine(request)) return NextResponse.json({ error: 'origin' }, { status: 403 });
  const email = await sessionEmail();
  if (!email) return NextResponse.json({ error: 'auth' }, { status: 401 });
  let name = '';
  try {
    name = String((await request.json()).name || '');
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  const result = await renommerCompte(email, name);
  if ('error' in result) {
    const status = result.error === 'unavailable' ? 503 : result.error === 'missing' ? 404 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json({ name: result.name });
}

export async function DELETE(request: Request) {
  if (!memeOrigine(request)) return NextResponse.json({ error: 'origin' }, { status: 403 });
  const email = await sessionEmail();
  if (!email) return NextResponse.json({ error: 'auth' }, { status: 401 });
  const result = await supprimerCompte(email);
  if ('error' in result) {
    const status = result.error === 'unavailable' ? 503 : 404;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json({ ok: true });
}
