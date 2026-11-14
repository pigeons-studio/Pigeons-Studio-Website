import { eq, or } from 'drizzle-orm';
import { findUserByEmail } from '@/lib/accounts';
import { getDb } from '@/lib/db';
import { events, invites, orders, registrations, users } from '@/lib/db/schema';
import { listOrders } from '@/lib/orders';

const NOM_ANONYME = '—';
const EMAIL_ANONYME = 'supprime@anonyme.invalid';

export async function renommerCompte(email: string, name: string) {
  const db = getDb();
  if (!db) return { error: 'unavailable' as const };
  const propre = name.trim();
  if (propre.length < 1 || propre.length > 80) return { error: 'invalid' as const };
  const user = await findUserByEmail(email);
  if (!user) return { error: 'missing' as const };
  await db.update(users).set({ name: propre }).where(eq(users.id, user.id));
  return { ok: true as const, name: propre };
}

export async function exporterCompte(email: string, userId?: string) {
  const db = getDb();
  if (!db) return null;
  const user = await findUserByEmail(email);
  if (!user) return null;
  const commandes = await listOrders({ email: user.email, userId: userId || user.id });
  const inscriptions = await db
    .select({
      id: registrations.id,
      name: registrations.name,
      email: registrations.email,
      createdAt: registrations.createdAt,
      eventSlug: events.slug,
      titleFr: events.titleFr,
      titleEn: events.titleEn,
    })
    .from(registrations)
    .innerJoin(events, eq(events.id, registrations.eventId))
    .where(eq(registrations.email, user.email));
  return {
    account: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
    orders: commandes ?? [],
    registrations: inscriptions,
  };
}

export async function supprimerCompte(email: string) {
  const db = getDb();
  if (!db) return { error: 'unavailable' as const };
  const user = await findUserByEmail(email);
  if (!user) return { error: 'missing' as const };
  await db.delete(registrations).where(eq(registrations.email, user.email));
  await db.update(orders).set({
    name: NOM_ANONYME,
    email: EMAIL_ANONYME,
    userId: null,
  }).where(or(eq(orders.userId, user.id), eq(orders.email, user.email)));
  await db.update(invites).set({ name: null, email: null }).where(eq(invites.email, user.email));
  await db.delete(users).where(eq(users.id, user.id));
  return { ok: true as const };
}
