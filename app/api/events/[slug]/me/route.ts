import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isRegistered, isSlug } from '@/lib/events';

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  if (!isSlug(slug)) return NextResponse.json({ registered: false });
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ registered: false });
  const registered = await isRegistered(slug, email);
  if (registered === null) return NextResponse.json({ error: 'unavailable' }, { status: 503 });
  return NextResponse.json({ registered });
}
