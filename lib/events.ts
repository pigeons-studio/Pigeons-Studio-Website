import { and, asc, count, eq, isNull } from 'drizzle-orm';
import { randomBytes } from 'crypto';
import { Resend } from 'resend';
import { getDb } from '@/lib/db';
import { events, invites, registrations } from '@/lib/db/schema';
import { isEventScene } from '@/lib/event-scenes';
import { mailNoir } from '@/lib/mail-shell';
import { baseUrl } from '@/lib/seo';

export type EventPublic = {
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  tags: string[];
  startsAt: string;
  endsAt: string;
  place: string;
  imageUrl: string | null;
  scene: string | null;
  capacity: number;
  remaining: number;
};

type Locale = 'fr' | 'en';

function asLocale(value: string | null | undefined): Locale {
  return value === 'en' ? 'en' : 'fr';
}

export function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function isSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

export function splitTags(value: string | null | undefined) {
  if (!value) return [];
  return value.split(/[,\n]/).map((part) => part.trim()).filter(Boolean);
}

function toPublic(
  row: typeof events.$inferSelect,
  taken: number,
  locale: Locale
): EventPublic {
  return {
    slug: row.slug,
    title: locale === 'en' ? row.titleEn : row.titleFr,
    subtitle: locale === 'en' ? row.subtitleEn : row.subtitleFr,
    description: locale === 'en' ? row.descriptionEn : row.descriptionFr,
    tags: splitTags(locale === 'en' ? row.tagsEn : row.tagsFr),
    startsAt: row.startsAt.toISOString(),
    endsAt: row.endsAt.toISOString(),
    place: row.place,
    imageUrl: row.imageUrl,
    scene: row.scene && isEventScene(row.scene) ? row.scene : null,
    capacity: row.capacity,
    remaining: Math.max(0, row.capacity - taken),
  };
}

async function takenByEvent() {
  const db = getDb();
  if (!db) return new Map<string, number>();
  const rows = await db
    .select({ eventId: registrations.eventId, n: count() })
    .from(registrations)
    .where(isNull(registrations.inviteId))
    .groupBy(registrations.eventId);
  return new Map(rows.map((row) => [row.eventId, Number(row.n)]));
}

export async function listEvents(localeInput?: string | null) {
  const db = getDb();
  if (!db) return [];
  const locale = asLocale(localeInput);
  const rows = await db.select().from(events).where(eq(events.hidden, false)).orderBy(asc(events.startsAt));
  const taken = await takenByEvent();
  return rows.map((row) => toPublic(row, taken.get(row.id) ?? 0, locale));
}

export async function getEvent(slug: string, localeInput?: string | null) {
  const db = getDb();
  if (!db) return null;
  const locale = asLocale(localeInput);
  const [row] = await db.select().from(events).where(eq(events.slug, slug)).limit(1);
  if (!row || row.hidden) return null;
  const taken = await takenByEvent();
  return toPublic(row, taken.get(row.id) ?? 0, locale);
}

export type RegisterResult =
  | { status: 'ok'; remaining: number; mail?: EventMail }
  | { status: 'full' | 'already' | 'missing' | 'invite' | 'unavailable' };

export type EventMail = {
  email: string;
  name: string;
  slug: string;
  titleFr: string;
  titleEn: string;
  place: string;
  startsAt: string;
  endsAt: string;
};

function echap(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function quandMail(iso: string, locale: 'fr' | 'en') {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Paris',
  }).format(new Date(iso));
}

export async function sendEventConfirmation(mail: EventMail, locale: 'fr' | 'en') {
  const fr = locale === 'fr';
  const origin = process.env.NODE_ENV === 'development'
    ? (process.env.NEXTAUTH_URL || 'http://localhost:3000')
    : baseUrl;
  const link = `${origin.replace(/\/$/, '')}/${locale}/events/${mail.slug}`;
  const titre = echap(fr ? mail.titleFr : mail.titleEn);
  const quand = `${echap(quandMail(mail.startsAt, locale))} — ${echap(quandMail(mail.endsAt, locale))}`;
  const lieu = echap(mail.place);
  const phrase = fr
    ? 'Ton inscription à cet event est confirmée.'
    : 'Your registration for this event is confirmed.';
  const bouton = fr ? 'Voir l’event' : 'See the event';
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'contact@punkhazard.org',
    to: mail.email,
    subject: fr ? `Inscription confirmée · ${mail.titleFr}` : `You’re registered · ${mail.titleEn}`,
    html: mailNoir(`<table class="fond" role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#000000" style="background:#000;">
<tr><td class="fond" align="center" bgcolor="#000000" style="background:#000;">
<table class="fond" role="presentation" width="480" cellpadding="0" cellspacing="0" bgcolor="#000000" style="background:#000;max-width:480px;">
<tr><td class="fond encre" bgcolor="#000000" style="background:#000;padding:32px 24px;font-family:ui-monospace,'IBM Plex Mono',Menlo,Consolas,monospace;color:#f2f0ea;">
<p class="or" style="margin:0 0 24px;letter-spacing:.18em;font-size:12px;color:#ffb545;">PIGEONS//STUDIO</p>
<p class="encre" style="margin:0 0 8px;font-size:14px;letter-spacing:.08em;text-transform:uppercase;color:#f2f0ea;">${titre}</p>
<p class="encre" style="margin:0 0 8px;font-size:12px;letter-spacing:.06em;color:#f2f0ea;">${quand}</p>
<p class="encre" style="margin:0 0 24px;font-size:12px;letter-spacing:.06em;color:#f2f0ea;">${lieu}</p>
<p class="encre" style="margin:0 0 24px;font-size:13px;line-height:1.5;color:#f2f0ea;">${phrase}</p>
<a class="or" href="${link}" style="display:inline-block;padding:10px 16px;border:1px solid #ffb545;color:#ffb545;text-decoration:none;letter-spacing:.12em;text-transform:uppercase;font-size:11px;">${bouton}</a>
<a class="encre" href="${link}" style="display:block;margin:24px 0 0;font-size:11px;line-height:1.4;color:#f2f0ea;text-decoration:none;word-break:break-all;">${link}</a>
</td></tr></table>
</td></tr></table>`),
    text: `${fr ? mail.titleFr : mail.titleEn}\n${quandMail(mail.startsAt, locale)} — ${quandMail(mail.endsAt, locale)}\n${mail.place}\n\n${phrase}\n${link}`,
  });
}

function mailDe(event: typeof events.$inferSelect, name: string, email: string): EventMail {
  return {
    email,
    name,
    slug: event.slug,
    titleFr: event.titleFr,
    titleEn: event.titleEn,
    place: event.place,
    startsAt: event.startsAt.toISOString(),
    endsAt: event.endsAt.toISOString(),
  };
}

export async function registerForEvent(slug: string, name: string, email: string, inviteToken?: string): Promise<RegisterResult> {
  const db = getDb();
  if (!db) return { status: 'unavailable' };
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();

  return db.transaction(async (tx) => {
    const [event] = await tx.select().from(events).where(eq(events.slug, slug)).for('update').limit(1);
    if (!event || event.hidden) return { status: 'missing' };
    const [existing] = await tx
      .select({ id: registrations.id })
      .from(registrations)
      .where(and(eq(registrations.eventId, event.id), eq(registrations.email, cleanEmail)))
      .limit(1);
    if (existing) return { status: 'already' };

    const [{ n }] = await tx
      .select({ n: count() })
      .from(registrations)
      .where(and(eq(registrations.eventId, event.id), isNull(registrations.inviteId)));
    const publicTaken = Number(n);

    if (inviteToken) {
      const [invite] = await tx.select().from(invites).where(eq(invites.token, inviteToken)).for('update').limit(1);
      if (!invite || invite.eventId !== event.id || invite.usedAt) return { status: 'invite' };
      await tx.insert(registrations).values({ eventId: event.id, name: cleanName, email: cleanEmail, inviteId: invite.id });
      await tx.update(invites).set({ usedAt: new Date(), name: cleanName, email: cleanEmail }).where(eq(invites.id, invite.id));
      return {
        status: 'ok' as const,
        remaining: Math.max(0, event.capacity - publicTaken),
        mail: mailDe(event, cleanName, cleanEmail),
      };
    }

    if (publicTaken >= event.capacity) return { status: 'full' };
    await tx.insert(registrations).values({ eventId: event.id, name: cleanName, email: cleanEmail });
    return { status: 'ok' as const, remaining: event.capacity - publicTaken - 1, mail: mailDe(event, cleanName, cleanEmail) };
  });
}

export async function isRegistered(slug: string, email: string) {
  const db = getDb();
  if (!db) return null;
  const cleanEmail = email.trim().toLowerCase();
  const [event] = await db.select({ id: events.id }).from(events).where(eq(events.slug, slug)).limit(1);
  if (!event) return false;
  const [row] = await db
    .select({ id: registrations.id })
    .from(registrations)
    .where(and(eq(registrations.eventId, event.id), eq(registrations.email, cleanEmail)))
    .limit(1);
  return Boolean(row);
}

export async function unregisterForEvent(slug: string, email: string) {
  const db = getDb();
  if (!db) return { status: 'unavailable' as const };
  const cleanEmail = email.trim().toLowerCase();
  return db.transaction(async (tx) => {
    const [event] = await tx.select().from(events).where(eq(events.slug, slug)).for('update').limit(1);
    if (!event) return { status: 'missing' as const };
    const [row] = await tx
      .delete(registrations)
      .where(and(eq(registrations.eventId, event.id), eq(registrations.email, cleanEmail)))
      .returning({ id: registrations.id });
    if (!row) return { status: 'missing' as const };
    const [{ n }] = await tx
      .select({ n: count() })
      .from(registrations)
      .where(and(eq(registrations.eventId, event.id), isNull(registrations.inviteId)));
    return { status: 'ok' as const, remaining: Math.max(0, event.capacity - Number(n)) };
  });
}

export type EventInput = {
  slug?: string;
  titleFr: string;
  titleEn: string;
  subtitleFr?: string;
  subtitleEn?: string;
  descriptionFr: string;
  descriptionEn: string;
  tagsFr?: string;
  tagsEn?: string;
  startsAt: string;
  endsAt: string;
  place: string;
  imageUrl?: string;
  scene?: string;
  hidden?: boolean;
  capacity: number;
};

function parseImage(value: string | undefined) {
  const raw = value?.trim() ?? '';
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

function parseOptional(value: string | undefined) {
  const raw = value?.trim() ?? '';
  return raw || null;
}

function parseTags(value: string | undefined) {
  const tags = splitTags(value);
  return tags.length ? tags.join(', ') : null;
}

function parseScene(value: string | undefined) {
  const raw = value?.trim() ?? '';
  if (!raw) return null;
  if (!isEventScene(raw)) return undefined;
  return raw;
}

function parseInput(input: EventInput) {
  const titleFr = input.titleFr.trim();
  const titleEn = input.titleEn.trim();
  const descriptionFr = input.descriptionFr.trim();
  const descriptionEn = input.descriptionEn.trim();
  const place = input.place.trim();
  const imageUrl = parseImage(input.imageUrl);
  const scene = parseScene(input.scene);
  const subtitleFr = parseOptional(input.subtitleFr);
  const subtitleEn = parseOptional(input.subtitleEn);
  const tagsFr = parseTags(input.tagsFr);
  const tagsEn = parseTags(input.tagsEn);
  const capacity = Number(input.capacity);
  const startsAt = new Date(input.startsAt);
  const endsAt = new Date(input.endsAt);
  const slug = slugify(input.slug?.trim() || titleFr);
  if (!titleFr || !titleEn || !descriptionFr || !descriptionEn || !place || !slug) return null;
  if (!Number.isInteger(capacity) || capacity < 1 || capacity > 5000) return null;
  if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime()) || endsAt < startsAt) return null;
  if (imageUrl === undefined || scene === undefined) return null;
  return { slug, titleFr, titleEn, subtitleFr, subtitleEn, descriptionFr, descriptionEn, tagsFr, tagsEn, place, imageUrl, scene, hidden: Boolean(input.hidden), capacity, startsAt, endsAt };
}

export async function createEvent(input: EventInput) {
  const db = getDb();
  if (!db) return { error: 'unavailable' as const };
  const parsed = parseInput(input);
  if (!parsed) return { error: 'invalid' as const };
  const [created] = await db.insert(events).values(parsed).returning();
  return { event: created };
}

const WORKSHOP = {
  slug: 'ev-micros',
  titleFr: 'WORKSHOP // MICROS',
  titleEn: 'WORKSHOP // MICS',
  subtitleFr: 'Apprendre à souder et bricoler des micros XLR, simplement et pas cher',
  subtitleEn: 'Learn to solder and hack XLR microphones, simply and cheaply',
  descriptionFr: `Un atelier pour apprendre à souder et bricoler des micros XLR, simplement et pas cher. On va explorer et fabriquer plusieurs micros, avec différents principes et designs : des micros à électret (des capsules très variées et très communes), des micros à ruban faits maison (avec une membrane DIY), des micros sensibles aux ondes électromagnétiques et des micros capables d’entendre les ultrasons. Et découvrir d’autres designs, plus ou moins simples, pour différents types de capsules.

L’atelier est animé par Hugo Thomas, étudiant en cinéma d’animation qui passe son temps libre à bricoler : il adore démonter, détourner et fabriquer ses propres outils de création, que ce soit en créant ou modifiant des appareils photo, ou en soudant des micros maison.

- **On fabrique** — électret, ruban fait maison, ondes électromagnétiques, ultrasons
- **Animé par** — Hugo Thomas
- **Organisé par** — Pigeons Studio`,
  descriptionEn: `A workshop to learn how to solder and hack XLR microphones, simply and cheaply. We will explore and build several mics with different principles and designs: electret mics (very varied, very common capsules), homemade ribbon mics (with a DIY membrane), mics sensitive to electromagnetic waves, and mics that can hear ultrasound. And discover other designs, more or less simple, for different kinds of capsules.

The workshop is led by Hugo Thomas, an animation film student who spends his free time tinkering: he loves taking apart, hacking and making his own creative tools, whether building or modifying cameras or soldering homemade mics.

- **We build** — electret, homemade ribbon, electromagnetic, ultrasound
- **Led by** — Hugo Thomas
- **Organised by** — Pigeons Studio`,
  tagsFr: 'Atelier, Soudure, Micros XLR, DIY',
  tagsEn: 'Workshop, Soldering, XLR mics, DIY',
  place: '111 rue Marceau, Montreuil',
  scene: 'ev-micros',
  capacity: 12,
  startsAt: new Date('2026-11-22T14:00:00+01:00'),
  endsAt: new Date('2026-11-22T20:00:00+01:00'),
};

export async function seedWorkshopMicros() {
  const db = getDb();
  if (!db) return { status: 'unavailable' as const };
  const [existing] = await db.select({ id: events.id }).from(events).where(eq(events.slug, WORKSHOP.slug)).limit(1);
  if (existing) return { status: 'exists' as const };
  await db.insert(events).values(WORKSHOP);
  return { status: 'created' as const };
}

export async function updateEvent(id: string, input: EventInput) {
  const db = getDb();
  if (!db) return { error: 'unavailable' as const };
  const parsed = parseInput(input);
  if (!parsed) return { error: 'invalid' as const };
  const [updated] = await db.update(events).set(parsed).where(eq(events.id, id)).returning();
  if (!updated) return { error: 'missing' as const };
  return { event: updated };
}

export async function deleteEvent(id: string) {
  const db = getDb();
  if (!db) return { error: 'unavailable' as const };
  const removed = await db.transaction(async (tx) => {
    await tx.delete(registrations).where(eq(registrations.eventId, id));
    await tx.delete(invites).where(eq(invites.eventId, id));
    const [row] = await tx.delete(events).where(eq(events.id, id)).returning({ id: events.id });
    return row;
  });
  if (!removed) return { error: 'missing' as const };
  return { ok: true as const };
}

export async function listEventsAdmin() {
  const db = getDb();
  if (!db) return null;
  const rows = await db.select().from(events).orderBy(asc(events.startsAt));
  const taken = await takenByEvent();
  return rows.map((row) => ({
    ...row,
    startsAt: row.startsAt.toISOString(),
    endsAt: row.endsAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
    taken: taken.get(row.id) ?? 0,
  }));
}

export async function eventAdminDetail(id: string) {
  const db = getDb();
  if (!db) return null;
  const [event] = await db.select().from(events).where(eq(events.id, id)).limit(1);
  if (!event) return null;
  const people = await db.select({
    name: registrations.name,
    email: registrations.email,
    inviteId: registrations.inviteId,
  }).from(registrations).where(eq(registrations.eventId, id));
  const links = await db.select().from(invites).where(eq(invites.eventId, id)).orderBy(asc(invites.createdAt));
  return {
    id: event.id,
    slug: event.slug,
    titleFr: event.titleFr,
    titleEn: event.titleEn,
    subtitleFr: event.subtitleFr,
    subtitleEn: event.subtitleEn,
    descriptionFr: event.descriptionFr,
    descriptionEn: event.descriptionEn,
    tagsFr: event.tagsFr,
    tagsEn: event.tagsEn,
    startsAt: event.startsAt.toISOString(),
    endsAt: event.endsAt.toISOString(),
    place: event.place,
    imageUrl: event.imageUrl,
    scene: event.scene,
    hidden: event.hidden,
    capacity: event.capacity,
    registrations: people.map((person) => ({
      name: person.name,
      email: person.email,
      invite: Boolean(person.inviteId),
    })),
    invites: links.map((link) => ({
      token: link.token,
      sent: link.sent,
      usedAt: link.usedAt?.toISOString() ?? null,
      name: link.name,
      email: link.email,
    })),
  };
}

export async function setEventHidden(id: string, hidden: boolean) {
  const db = getDb();
  if (!db) return { error: 'unavailable' as const };
  const [updated] = await db.update(events).set({ hidden }).where(eq(events.id, id)).returning({ id: events.id, hidden: events.hidden });
  if (!updated) return { error: 'missing' as const };
  return { event: updated };
}

export async function createInvite(eventId: string) {
  const db = getDb();
  if (!db) return { error: 'unavailable' as const };
  const [event] = await db.select({ id: events.id }).from(events).where(eq(events.id, eventId)).limit(1);
  if (!event) return { error: 'missing' as const };
  const token = randomBytes(16).toString('hex');
  await db.insert(invites).values({ eventId, token });
  return { token };
}

export async function setInviteSent(eventId: string, token: string, sent: boolean) {
  const db = getDb();
  if (!db) return { error: 'unavailable' as const };
  const [row] = await db.select().from(invites).where(and(eq(invites.token, token), eq(invites.eventId, eventId))).limit(1);
  if (!row) return { error: 'missing' as const };
  if (row.usedAt) return { error: 'used' as const };
  await db.update(invites).set({ sent }).where(eq(invites.id, row.id));
  return { ok: true as const };
}

export async function deleteInvite(eventId: string, token: string) {
  const db = getDb();
  if (!db) return { error: 'unavailable' as const };
  const [row] = await db.delete(invites).where(and(eq(invites.token, token), eq(invites.eventId, eventId))).returning({ id: invites.id });
  if (!row) return { error: 'missing' as const };
  return { ok: true as const };
}
