import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin-emails';
import { findUserByEmail } from '@/lib/accounts';

export { adminEmails, isAdminEmail } from '@/lib/admin-emails';

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  if (!email) return null;
  if (isAdminEmail(email)) return session;
  const account = await findUserByEmail(email);
  if (account?.role === 'admin') return session;
  return null;
}
