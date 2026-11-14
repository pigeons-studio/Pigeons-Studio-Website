import { createHash, randomBytes } from 'crypto';
import { hash, compare } from 'bcryptjs';
import { and, asc, eq, gt } from 'drizzle-orm';
import { Resend } from 'resend';
import { getDb } from '@/lib/db';
import { emailTokens, users } from '@/lib/db/schema';
import { baseUrl } from '@/lib/seo';
import { isAdminEmail } from '@/lib/admin-emails';

const TOKEN_MS = 24 * 60 * 60 * 1000;

export function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export async function hashPassword(password: string) {
  return hash(password, 10);
}

export async function passwordMatches(password: string, passwordHash: string) {
  return compare(password, passwordHash);
}

function roleFor(email: string) {
  return isAdminEmail(email) ? 'admin' : 'user';
}

export async function findUserByEmail(email: string) {
  const db = getDb();
  if (!db) return null;
  const [row] = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
  return row ?? null;
}

async function issueToken(userId: string) {
  const db = getDb();
  if (!db) return null;
  const token = randomBytes(32).toString('hex');
  await db.delete(emailTokens).where(eq(emailTokens.userId, userId));
  await db.insert(emailTokens).values({
    userId,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + TOKEN_MS),
  });
  return token;
}

export async function sendConfirmationEmail(email: string, token: string, locale: 'fr' | 'en') {
  const origin = process.env.NODE_ENV === 'development'
    ? (process.env.NEXTAUTH_URL || 'http://localhost:3000')
    : baseUrl;
  const link = `${origin.replace(/\/$/, '')}/api/compte/confirm?token=${token}&locale=${locale}`;
  const fr = locale === 'fr';
  const titre = fr ? 'Confirme ton compte' : 'Confirm your account';
  const phrase = fr
    ? 'Confirme ton adresse pour activer le compte Pigeons Studio.'
    : 'Confirm your address to activate your Pigeons Studio account.';
  const bouton = fr ? 'Confirmer' : 'Confirm';
  const expire = fr ? 'Le lien expire dans 24 h.' : 'This link expires in 24 hours.';
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'contact@punkhazard.org',
    to: email,
    subject: fr ? 'Confirme ton compte Pigeons Studio' : 'Confirm your Pigeons Studio account',
    html: `<!DOCTYPE html><html><body style="margin:0;background:#000;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#000000" style="background:#000000;">
<tr><td align="center">
<table role="presentation" width="480" cellpadding="0" cellspacing="0" bgcolor="#000000" style="background:#000000;max-width:480px;">
<tr><td bgcolor="#000000" style="background:#000000;padding:32px 24px;font-family:ui-monospace,'IBM Plex Mono',Menlo,Consolas,monospace;color:#f2f0ea;">
<p style="margin:0 0 24px;letter-spacing:.18em;font-size:12px;color:#ffb545;">PIGEONS//STUDIO</p>
<p style="margin:0 0 8px;font-size:14px;letter-spacing:.08em;text-transform:uppercase;color:#f2f0ea;">${titre}</p>
<p style="margin:0 0 24px;font-size:13px;line-height:1.5;color:#f2f0ea;">${phrase}</p>
<a href="${link}" style="display:inline-block;padding:10px 16px;border:1px solid #ffb545;color:#ffb545;text-decoration:none;letter-spacing:.12em;text-transform:uppercase;font-size:11px;">${bouton}</a>
<p style="margin:24px 0 8px;font-size:11px;color:#f2f0ea;">${expire}</p>
<p style="margin:0;font-size:11px;line-height:1.4;color:#f2f0ea;word-break:break-all;">${link}</p>
</td></tr></table>
</td></tr></table>
</body></html>`,
    text: `${phrase}\n${link}\n\n${expire}`,
  });
}

export async function registerWithPassword(input: { email: string; password: string; name: string; locale: 'fr' | 'en' }) {
  const db = getDb();
  if (!db) return { error: 'unavailable' as const };
  const email = input.email.toLowerCase().trim();
  const name = input.name.trim();
  const existing = await findUserByEmail(email);
  if (existing?.emailVerifiedAt) return { error: 'exists' as const };
  if (existing?.googleSub && !existing.passwordHash) return { error: 'exists' as const };

  if (existing && !existing.emailVerifiedAt) {
    const token = await issueToken(existing.id);
    if (!token) return { error: 'unavailable' as const };
    await sendConfirmationEmail(email, token, input.locale);
    return { ok: true as const };
  }

  const passwordHash = await hashPassword(input.password);
  let userId = existing?.id;
  if (existing) {
    await db.update(users).set({ name, passwordHash, role: roleFor(email) }).where(eq(users.id, existing.id));
  } else {
    const [created] = await db.insert(users).values({
      email,
      name,
      passwordHash,
      role: roleFor(email),
    }).returning({ id: users.id });
    userId = created?.id;
  }
  if (!userId) return { error: 'unavailable' as const };
  const token = await issueToken(userId);
  if (!token) return { error: 'unavailable' as const };
  await sendConfirmationEmail(email, token, input.locale);
  return { ok: true as const };
}

export async function confirmEmail(token: string) {
  const db = getDb();
  if (!db || !token) return false;
  const now = new Date();
  const [row] = await db.select().from(emailTokens).where(and(
    eq(emailTokens.tokenHash, hashToken(token)),
    gt(emailTokens.expiresAt, now),
  )).limit(1);
  if (!row) return false;
  await db.update(users).set({ emailVerifiedAt: now }).where(eq(users.id, row.userId));
  await db.delete(emailTokens).where(eq(emailTokens.userId, row.userId));
  return true;
}

export async function loginWithPassword(emailRaw: string, password: string) {
  const user = await findUserByEmail(emailRaw);
  if (!user?.passwordHash) return null;
  const ok = await passwordMatches(password, user.passwordHash);
  if (!ok) return null;
  if (!user.emailVerifiedAt) return { unverified: true as const };
  const email = user.email;
  if (isAdminEmail(email) && user.role !== 'admin') {
    const db = getDb();
    await db?.update(users).set({ role: 'admin' }).where(eq(users.id, user.id));
  }
  return { id: user.id, email, name: user.name };
}

export async function linkGoogleAccount(input: { email: string; name: string; sub: string }) {
  const db = getDb();
  if (!db) return null;
  const email = input.email.toLowerCase();
  const now = new Date();
  const existing = await findUserByEmail(email);
  if (existing) {
    await db.update(users).set({
      googleSub: existing.googleSub ?? input.sub,
      emailVerifiedAt: existing.emailVerifiedAt ?? now,
      name: existing.name || input.name,
      role: isAdminEmail(email) ? 'admin' : existing.role,
    }).where(eq(users.id, existing.id));
    return existing.id;
  }
  const [created] = await db.insert(users).values({
    email,
    name: input.name || email,
    googleSub: input.sub,
    emailVerifiedAt: now,
    role: roleFor(email),
  }).returning({ id: users.id });
  return created?.id ?? null;
}

export async function listAccounts() {
  const db = getDb();
  if (!db) return null;
  const rows = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    role: users.role,
    emailVerifiedAt: users.emailVerifiedAt,
  }).from(users).orderBy(asc(users.createdAt));
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    confirmed: Boolean(row.emailVerifiedAt),
    locked: isAdminEmail(row.email),
  }));
}

export async function setAccountRole(id: string, role: 'admin' | 'user', actorEmail?: string) {
  const db = getDb();
  if (!db) return { error: 'unavailable' as const };
  const [row] = await db.select({ id: users.id, email: users.email, role: users.role }).from(users).where(eq(users.id, id)).limit(1);
  if (!row) return { error: 'missing' as const };
  if (role === 'user' && actorEmail && row.email.toLowerCase() === actorEmail.toLowerCase()) {
    return { error: 'self' as const };
  }
  if (role === 'user' && isAdminEmail(row.email)) return { error: 'locked' as const };
  if (row.role !== role) {
    await db.update(users).set({ role }).where(eq(users.id, id));
  }
  return { ok: true as const };
}
