import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { exporterCompte } from '@/lib/account-actions';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.trim();
  if (!session || !email) return NextResponse.json({ error: 'auth' }, { status: 401 });
  const data = await exporterCompte(email, session.user?.id);
  if (!data) return NextResponse.json({ error: 'missing' }, { status: 404 });
  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': 'attachment; filename="pigeons-studio-donnees.json"',
    },
  });
}
