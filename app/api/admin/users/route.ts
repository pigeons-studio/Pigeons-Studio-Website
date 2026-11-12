import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { listAccounts } from '@/lib/accounts';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const accounts = await listAccounts();
  if (!accounts) return NextResponse.json({ error: 'unavailable' }, { status: 503 });
  return NextResponse.json({ accounts });
}
