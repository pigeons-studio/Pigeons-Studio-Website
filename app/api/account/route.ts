import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { demanderChangementEmail, findUserByEmail, findUserById } from '@/lib/accounts';
import { renommerCompte, supprimerCompte } from '@/lib/account-actions';
import { authOptions } from '@/lib/auth';
import { memeOrigine } from '@/lib/origin';
import { adresseIp, FENETRE_TENTATIVES_MS, limiteAtteinte, PLAFOND_TENTATIVES } from '@/lib/rate-limit';

async function sessionCourante() {
  const session = await getServerSession(authOptions);
  return {
    email: session?.user?.email?.trim() || '',
    id: session?.user?.id || '',
  };
}

export async function GET() {
  const { email, id } = await sessionCourante();
  if (!email && !id) return NextResponse.json({ error: 'auth' }, { status: 401 });
  const user = (id && await findUserById(id)) || (email ? await findUserByEmail(email) : null);
  if (!user) return NextResponse.json({ error: 'missing' }, { status: 404 });
  return NextResponse.json({ email: user.email, name: user.name, pendingEmail: user.pendingEmail });
}

export async function POST(request: Request) {
  if (!memeOrigine(request)) return NextResponse.json({ error: 'origin' }, { status: 403 });
  if (await limiteAtteinte(`email:${adresseIp(request)}`, PLAFOND_TENTATIVES, FENETRE_TENTATIVES_MS)) {
    return NextResponse.json({ error: 'rate' }, { status: 429 });
  }
  const { email } = await sessionCourante();
  if (!email) return NextResponse.json({ error: 'auth' }, { status: 401 });
  let body: { email?: string; locale?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  const result = await demanderChangementEmail(email, body.email || '', body.locale === 'en' ? 'en' : 'fr');
  if ('error' in result) {
    const status = result.error === 'unavailable' ? 503 : result.error === 'missing' ? 404 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  if (!memeOrigine(request)) return NextResponse.json({ error: 'origin' }, { status: 403 });
  const { email } = await sessionCourante();
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
  const { email } = await sessionCourante();
  if (!email) return NextResponse.json({ error: 'auth' }, { status: 401 });
  const result = await supprimerCompte(email);
  if ('error' in result) {
    const status = result.error === 'unavailable' ? 503 : 404;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json({ ok: true });
}
