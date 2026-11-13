import { desc, eq, or } from 'drizzle-orm';
import { Resend } from 'resend';
import { orderEmails } from '@/lib/admin-emails';
import { findUserByEmail } from '@/lib/accounts';
import { getDb } from '@/lib/db';
import { orderItems, orders } from '@/lib/db/schema';
import { baseUrl } from '@/lib/seo';
import { ORDER_KINDS, ORDER_STATUSES, type OrderKind, type OrderLine, type OrderStatus, type OrderView } from '@/lib/order-types';

export type { OrderKind, OrderLine, OrderStatus, OrderView };
export { ORDER_KINDS, ORDER_STATUSES };

export type OrderLineInput = {
  productId: string;
  nameFr: string;
  nameEn: string;
  color?: string | null;
  quantity: number;
  priceLabel: string;
  detail?: string | null;
};

function echap(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function asKind(value: string): OrderKind | null {
  return ORDER_KINDS.includes(value as OrderKind) ? (value as OrderKind) : null;
}

function asStatus(value: string): OrderStatus | null {
  return ORDER_STATUSES.includes(value as OrderStatus) ? (value as OrderStatus) : null;
}

function ligne(item: OrderLine, locale: 'fr' | 'en') {
  const nom = locale === 'en' ? item.nameEn : item.nameFr;
  const couleur = item.color ? ` · ${item.color}` : '';
  return `${nom}${couleur} × ${item.quantity} — ${item.priceLabel}`;
}

function mailHtml(locale: 'fr' | 'en', titre: string, lignes: string[], phrase: string, bouton: string, lien: string) {
  const corps = lignes.map((l) => `<p style="margin:0 0 8px;font-size:13px;line-height:1.5;color:#f2f0ea;">${echap(l)}</p>`).join('');
  return `<!DOCTYPE html><html><head><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"></head><body style="margin:0;background:#000;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#000000" style="background:#000000;">
<tr><td align="center">
<table role="presentation" width="480" cellpadding="0" cellspacing="0" bgcolor="#000000" style="background:#000000;max-width:480px;">
<tr><td bgcolor="#000000" style="background:#000000;padding:32px 24px;font-family:ui-monospace,'IBM Plex Mono',Menlo,Consolas,monospace;color:#f2f0ea;">
<p style="margin:0 0 24px;letter-spacing:.18em;font-size:12px;color:#ffb545;">PIGEONS//STUDIO</p>
<p style="margin:0 0 16px;font-size:14px;letter-spacing:.08em;text-transform:uppercase;color:#f2f0ea;">${echap(titre)}</p>
${corps}
<p style="margin:16px 0 24px;font-size:13px;line-height:1.5;color:#f2f0ea;">${echap(phrase)}</p>
<a href="${lien}" style="display:inline-block;padding:10px 16px;border:1px solid #ffb545;color:#ffb545;text-decoration:none;letter-spacing:.12em;text-transform:uppercase;font-size:11px;">${echap(bouton)}</a>
</td></tr></table>
</td></tr></table>
</body></html>`;
}

async function envoyerMails(order: OrderView) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const fr = order.locale !== 'en';
  const locale = fr ? 'fr' : 'en';
  const lignes = order.items.map((item) => ligne(item, locale));
  const details = order.items.map((item) => item.detail).filter((d): d is string => Boolean(d));
  const clientLignes = [...lignes, ...details];
  const studioLignes = [
    `${fr ? 'Nom' : 'Name'} : ${order.name}`,
    `${fr ? 'Email' : 'Email'} : ${order.email}`,
    ...lignes,
    ...details,
  ];
  const sorte = order.kind === 'preorder' ? (fr ? 'Précommande' : 'Pre-order') : (fr ? 'Commande' : 'Order');
  const lien = `${baseUrl.replace(/\/$/, '')}/${locale}/profile`;
  const resend = new Resend(key);
  const from = process.env.RESEND_FROM_EMAIL || 'contact@punkhazard.org';
  await resend.emails.send({
    from,
    to: orderEmails(),
    replyTo: order.email,
    subject: `[${sorte}] ${order.name}`,
    html: mailHtml(locale, sorte, studioLignes, fr ? 'Nouvelle demande.' : 'New request.', fr ? 'Voir le profil' : 'See the profile', lien),
    text: [sorte, ...studioLignes].join('\n'),
  });
  await resend.emails.send({
    from,
    to: order.email,
    subject: fr ? `${sorte} reçue · Pigeons Studio` : `${sorte} received · Pigeons Studio`,
    html: mailHtml(
      locale,
      sorte,
      clientLignes,
      fr ? 'Nous avons bien reçu ta demande. On te répond dès que c’est confirmé.' : 'We have received your request. We will write back once it is confirmed.',
      fr ? 'Voir mes commandes' : 'See my orders',
      lien,
    ),
    text: [sorte, ...clientLignes, fr ? 'Nous avons bien reçu ta demande.' : 'We have received your request.', lien].join('\n'),
  });
}

function vue(
  order: typeof orders.$inferSelect,
  items: (typeof orderItems.$inferSelect)[],
): OrderView {
  return {
    id: order.id,
    kind: asKind(order.kind) || 'order',
    status: asStatus(order.status) || 'received',
    name: order.name,
    email: order.email,
    locale: order.locale === 'en' ? 'en' : 'fr',
    createdAt: order.createdAt.toISOString(),
    items: items.map((item) => ({
      productId: item.productId,
      nameFr: item.nameFr,
      nameEn: item.nameEn,
      color: item.color,
      quantity: item.quantity,
      priceLabel: item.priceLabel,
      detail: item.detail,
    })),
  };
}

async function avecLignes(rows: (typeof orders.$inferSelect)[]): Promise<OrderView[]> {
  const db = getDb();
  if (!db || !rows.length) return [];
  const lines = await db.select().from(orderItems);
  return rows.map((order) => vue(order, lines.filter((line) => line.orderId === order.id)));
}

export async function listOrders(filtre?: { email?: string; userId?: string | null }) {
  const db = getDb();
  if (!db) return null;
  const email = filtre?.email?.trim().toLowerCase();
  const userId = filtre?.userId || null;
  const rows = email || userId
    ? await db.select().from(orders).where(
      email && userId ? or(eq(orders.email, email), eq(orders.userId, userId)) : email ? eq(orders.email, email) : eq(orders.userId, userId as string),
    ).orderBy(desc(orders.createdAt))
    : await db.select().from(orders).orderBy(desc(orders.createdAt));
  return avecLignes(rows);
}

export async function createOrder(input: {
  kind: string;
  locale?: string;
  name: string;
  email: string;
  items: OrderLineInput[];
}) {
  const db = getDb();
  if (!db) return { error: 'unavailable' as const };
  const kind = asKind(input.kind);
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const items = input.items.filter((item) => item.productId && item.nameFr && item.quantity > 0);
  if (!kind || !name || !email.includes('@') || !items.length) return { error: 'invalid' as const };
  const account = await findUserByEmail(email);
  const [order] = await db.insert(orders).values({
    userId: account?.id ?? null,
    name,
    email,
    locale: input.locale === 'en' ? 'en' : 'fr',
    kind,
    status: 'received',
  }).returning();
  if (!order) return { error: 'unavailable' as const };
  const lines = await db.insert(orderItems).values(items.map((item) => ({
    orderId: order.id,
    productId: item.productId.slice(0, 80),
    nameFr: item.nameFr.slice(0, 200),
    nameEn: (item.nameEn || item.nameFr).slice(0, 200),
    color: item.color?.slice(0, 40) || null,
    quantity: Math.min(99, Math.max(1, Math.floor(item.quantity))),
    priceLabel: item.priceLabel.slice(0, 80),
    detail: item.detail?.slice(0, 500) || null,
  }))).returning();
  const view = vue(order, lines);
  try {
    await envoyerMails(view);
  } catch (error) {
    console.error('mail commande', error);
  }
  return { order: view };
}

export async function setOrderStatus(id: string, status: string) {
  const db = getDb();
  const next = asStatus(status);
  if (!db || !next) return null;
  const [order] = await db.update(orders).set({ status: next }).where(eq(orders.id, id)).returning();
  if (!order) return null;
  const lines = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  return vue(order, lines);
}
