import { and, desc, eq, sql } from 'drizzle-orm';
import { Resend } from 'resend';
import { getDb } from '@/lib/db';
import { newsletterDeliveries, newsletters, subscribers } from '@/lib/db/schema';
import { echap, uneLigne } from '@/lib/html';
import { lettreHtml, lettreTexte, type LangueLettre } from '@/lib/newsletter-html';
import { hashJeton, jetonDesinscription, lireDesinscription, nouveauJeton } from '@/lib/newsletter-token';
import { baseUrl } from '@/lib/seo';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TAILLE_LOT = 100;
const MAX_PAR_REQUETE = 400;
const FILE_PERIMEE_MS = 10 * 60 * 1000;

export type LettreSaisie = {
  subjectFr?: string;
  subjectEn?: string;
  previewFr?: string;
  previewEn?: string;
  bodyFr?: string;
  bodyEn?: string;
};

type Lettre = typeof newsletters.$inferSelect;
type Inscrit = typeof subscribers.$inferSelect;

function racine() {
  const origin = process.env.NODE_ENV === 'development'
    ? (process.env.NEXTAUTH_URL || 'http://localhost:3000')
    : baseUrl;
  return origin.replace(/\/$/, '');
}

function adresseNewsletter() {
  const raw = (process.env.NEWSLETTER_FROM_EMAIL || 'newsletter@pigeons.studio').trim();
  const entre = raw.match(/<([^>]+)>/);
  return (entre?.[1] || raw).trim();
}

export function expediteur() {
  const raw = (process.env.NEWSLETTER_FROM_EMAIL || '').trim();
  if (raw.includes('<')) return raw;
  return `Pigeons Studio <${adresseNewsletter()}>`;
}

function reponse() {
  return adresseNewsletter();
}

function langue(valeur: string): LangueLettre {
  return valeur === 'en' ? 'en' : 'fr';
}

function champ(valeur: unknown, max: number) {
  return typeof valeur === 'string' ? valeur.trim().slice(0, max) : '';
}

function saisie(input: LettreSaisie) {
  return {
    subjectFr: champ(input.subjectFr, 200),
    subjectEn: champ(input.subjectEn, 200),
    previewFr: champ(input.previewFr, 240),
    previewEn: champ(input.previewEn, 240),
    bodyFr: champ(input.bodyFr, 20000),
    bodyEn: champ(input.bodyEn, 20000),
  };
}

export function languePrete(lettre: Pick<Lettre, 'subjectFr' | 'subjectEn' | 'bodyFr' | 'bodyEn'>, locale: LangueLettre) {
  if (locale === 'en') return Boolean(lettre.subjectEn && lettre.bodyEn);
  return Boolean(lettre.subjectFr && lettre.bodyFr);
}

function apercuDe(lettre: Lettre, locale: LangueLettre) {
  const ecrit = locale === 'en' ? lettre.previewEn : lettre.previewFr;
  if (ecrit) return ecrit;
  const corps = locale === 'en' ? lettre.bodyEn : lettre.bodyFr;
  return uneLigne(corps.replace(/[#*[\]]/g, ' '), 140);
}

function liens(email: string, locale: LangueLettre) {
  const jeton = jetonDesinscription(email);
  if (!jeton) return null;
  const page = `${racine()}/${locale}/newsletter/leave?token=${encodeURIComponent(jeton)}`;
  const direct = `${racine()}/api/newsletter/unsubscribe?token=${encodeURIComponent(jeton)}`;
  return { page, direct };
}

function messageLettre(lettre: Lettre, email: string, locale: LangueLettre) {
  const liensLettre = liens(email, locale);
  if (!liensLettre) return null;
  const sujet = locale === 'en' ? lettre.subjectEn : lettre.subjectFr;
  const corps = locale === 'en' ? lettre.bodyEn : lettre.bodyFr;
  const apercu = apercuDe(lettre, locale);
  return {
    from: expediteur(),
    to: email,
    replyTo: reponse(),
    subject: uneLigne(sujet, 200),
    html: lettreHtml({ locale, apercu, corps, lienDesinscription: liensLettre.page }),
    text: lettreTexte({ locale, corps, lienDesinscription: liensLettre.page }),
    headers: {
      'List-Unsubscribe': `<${liensLettre.direct}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  };
}

async function envoyerConfirmation(email: string, locale: LangueLettre, token: string) {
  const cle = process.env.RESEND_API_KEY;
  if (!cle) return false;
  const fr = locale === 'fr';
  const lien = `${racine()}/${locale}/newsletter/confirm?token=${encodeURIComponent(token)}`;
  const sujet = fr ? 'Confirme ton inscription à la newsletter' : 'Confirm your newsletter subscription';
  const phrase = fr
    ? 'Confirme ton inscription pour recevoir la newsletter de Pigeons Studio. Sans ce lien, rien n’est envoyé.'
    : 'Confirm your subscription to receive the Pigeons Studio newsletter. Nothing is sent without this link.';
  const bouton = fr ? 'Confirmer' : 'Confirm';
  const ignore = fr
    ? 'Si tu n’as pas demandé cette inscription, ignore ce message.'
    : 'If you did not ask for this, ignore this message.';
  const resend = new Resend(cle);
  const { error } = await resend.emails.send({
    from: expediteur(),
    to: email,
    replyTo: reponse(),
    subject: sujet,
    html: `<!DOCTYPE html><html><body style="margin:0;background:#000;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#000000" style="background:#000000;">
<tr><td align="center">
<table role="presentation" width="480" cellpadding="0" cellspacing="0" bgcolor="#000000" style="background:#000000;max-width:480px;">
<tr><td bgcolor="#000000" style="background:#000000;padding:32px 24px;font-family:ui-monospace,'IBM Plex Mono',Menlo,Consolas,monospace;color:#f2f0ea;">
<p style="margin:0 0 24px;letter-spacing:.18em;font-size:12px;color:#ffb545;">PIGEONS//STUDIO</p>
<p style="margin:0 0 24px;font-size:13px;line-height:1.5;color:#f2f0ea;">${phrase}</p>
<a href="${echap(lien)}" style="display:inline-block;padding:10px 16px;border:1px solid #ffb545;color:#ffb545;text-decoration:none;letter-spacing:.12em;text-transform:uppercase;font-size:11px;">${bouton}</a>
<p style="margin:24px 0 0;font-size:11px;line-height:1.4;color:#f2f0ea;">${ignore}</p>
</td></tr></table>
</td></tr></table>
</body></html>`,
    text: `${phrase}\n${lien}\n\n${ignore}`,
  });
  return !error;
}

export async function inscrire(email: string, localeBrut: string, source: string) {
  const db = getDb();
  if (!db) return { error: 'unavailable' as const };
  const propre = email.trim().toLowerCase();
  if (!EMAIL.test(propre) || propre.length > 200) return { error: 'invalid' as const };
  const locale = langue(localeBrut);
  const [existant] = await db.select().from(subscribers).where(eq(subscribers.email, propre)).limit(1);
  if (existant?.status === 'subscribed') return { status: 'already' as const };
  const { token, hash } = nouveauJeton();
  const maintenant = new Date();
  if (!existant) {
    await db.insert(subscribers).values({
      email: propre,
      locale,
      status: 'pending',
      source,
      consentAt: maintenant,
      confirmTokenHash: hash,
    });
  } else {
    await db.update(subscribers).set({
      locale,
      status: 'pending',
      source,
      consentAt: maintenant,
      confirmTokenHash: hash,
    }).where(eq(subscribers.id, existant.id));
  }
  const parti = await envoyerConfirmation(propre, locale, token);
  if (!parti) return { error: 'send' as const };
  return { status: 'sent' as const };
}

export async function confirmerInscription(token: string) {
  const db = getDb();
  if (!db) return { error: 'unavailable' as const };
  if (!token || token.length > 400) return { error: 'invalid' as const };
  const [ligne] = await db.select().from(subscribers).where(eq(subscribers.confirmTokenHash, hashJeton(token))).limit(1);
  if (!ligne) return { error: 'invalid' as const };
  await db.update(subscribers).set({
    status: 'subscribed',
    confirmedAt: new Date(),
    confirmTokenHash: null,
    unsubscribedAt: null,
  }).where(eq(subscribers.id, ligne.id));
  return { status: 'ok' as const };
}

export async function desinscrireJeton(token: string) {
  const lu = lireDesinscription(token);
  if (!lu) return { error: 'invalid' as const };
  const fait = await desinscrireEmail(lu.email);
  if (!fait) return { error: 'invalid' as const };
  return { status: 'ok' as const };
}

export async function desinscrireEmail(email: string) {
  const db = getDb();
  if (!db) return false;
  const propre = email.trim().toLowerCase();
  const [ligne] = await db.select({ id: subscribers.id, status: subscribers.status }).from(subscribers).where(eq(subscribers.email, propre)).limit(1);
  if (!ligne) return false;
  if (ligne.status === 'unsubscribed') return true;
  await db.update(subscribers).set({
    status: 'unsubscribed',
    unsubscribedAt: new Date(),
    confirmTokenHash: null,
  }).where(eq(subscribers.id, ligne.id));
  return true;
}

export async function etatNewsletter(email: string) {
  const db = getDb();
  if (!db) return null;
  const [ligne] = await db.select({
    status: subscribers.status,
    locale: subscribers.locale,
    consentAt: subscribers.consentAt,
    confirmedAt: subscribers.confirmedAt,
    unsubscribedAt: subscribers.unsubscribedAt,
  }).from(subscribers).where(eq(subscribers.email, email.toLowerCase())).limit(1);
  return ligne ?? null;
}

export async function compteInscrits() {
  const db = getDb();
  if (!db) return null;
  const lignes = await db.select({
    status: subscribers.status,
    locale: subscribers.locale,
    n: sql<number>`count(*)::int`,
  }).from(subscribers).groupBy(subscribers.status, subscribers.locale);
  const comptes = { subscribed: 0, pending: 0, unsubscribed: 0, fr: 0, en: 0 };
  for (const ligne of lignes) {
    const n = Number(ligne.n) || 0;
    if (ligne.status === 'subscribed' || ligne.status === 'pending' || ligne.status === 'unsubscribed') {
      comptes[ligne.status] += n;
    }
    if (ligne.status === 'subscribed' && (ligne.locale === 'fr' || ligne.locale === 'en')) comptes[ligne.locale] += n;
  }
  return comptes;
}

export async function listerLettres() {
  const db = getDb();
  if (!db) return null;
  const lettres = await db.select().from(newsletters).orderBy(desc(newsletters.createdAt));
  const comptes = await compteInscrits();
  return { lettres, comptes };
}

export async function lireLettre(id: string) {
  const db = getDb();
  if (!db) return null;
  const [lettre] = await db.select().from(newsletters).where(eq(newsletters.id, id)).limit(1);
  if (!lettre) return null;
  const comptes = await compteInscrits();
  const reste = await compterRestants(lettre);
  const echecs = await db.select({
    email: subscribers.email,
    error: newsletterDeliveries.error,
  }).from(newsletterDeliveries)
    .innerJoin(subscribers, eq(subscribers.id, newsletterDeliveries.subscriberId))
    .where(and(eq(newsletterDeliveries.newsletterId, id), eq(newsletterDeliveries.status, 'failed')))
    .limit(20);
  return { lettre, comptes, reste, echecs };
}

async function compterRestants(lettre: Lettre) {
  const db = getDb();
  if (!db) return 0;
  const inscrits = await db.select().from(subscribers).where(eq(subscribers.status, 'subscribed'));
  const envoyes = await db.select({ subscriberId: newsletterDeliveries.subscriberId }).from(newsletterDeliveries).where(and(
    eq(newsletterDeliveries.newsletterId, lettre.id),
    eq(newsletterDeliveries.status, 'sent'),
  ));
  const deja = new Set(envoyes.map((ligne) => ligne.subscriberId));
  return inscrits.filter((inscrit) => languePrete(lettre, langue(inscrit.locale)) && !deja.has(inscrit.id)).length;
}

export async function creerLettre(input: LettreSaisie) {
  const db = getDb();
  if (!db) return { error: 'unavailable' as const };
  const [lettre] = await db.insert(newsletters).values(saisie(input)).returning();
  return { lettre };
}

export async function modifierLettre(id: string, input: LettreSaisie) {
  const db = getDb();
  if (!db) return { error: 'unavailable' as const };
  const [actuelle] = await db.select().from(newsletters).where(eq(newsletters.id, id)).limit(1);
  if (!actuelle) return { error: 'missing' as const };
  if (actuelle.status !== 'draft') return { error: 'locked' as const };
  const [lettre] = await db.update(newsletters).set(saisie(input)).where(eq(newsletters.id, id)).returning();
  return { lettre };
}

export async function supprimerLettre(id: string) {
  const db = getDb();
  if (!db) return { error: 'unavailable' as const };
  const [actuelle] = await db.select().from(newsletters).where(eq(newsletters.id, id)).limit(1);
  if (!actuelle) return { error: 'missing' as const };
  if (actuelle.status !== 'draft') return { error: 'locked' as const };
  await db.delete(newsletters).where(eq(newsletters.id, id));
  return { ok: true as const };
}

async function reclamer(newsletterId: string, ids: string[]) {
  const db = getDb();
  if (!db) return [];
  const pris: string[] = [];
  for (const subscriberId of ids) {
    const inserted = await db.insert(newsletterDeliveries).values({
      newsletterId,
      subscriberId,
      status: 'queued',
    }).onConflictDoNothing().returning({ subscriberId: newsletterDeliveries.subscriberId });
    if (inserted.length) {
      pris.push(subscriberId);
      continue;
    }
    const [ligne] = await db.select().from(newsletterDeliveries).where(and(
      eq(newsletterDeliveries.newsletterId, newsletterId),
      eq(newsletterDeliveries.subscriberId, subscriberId),
    )).limit(1);
    if (!ligne || ligne.status === 'sent') continue;
    const perimee = ligne.status === 'queued' && Date.now() - new Date(ligne.sentAt).getTime() > FILE_PERIMEE_MS;
    if (ligne.status === 'failed' || perimee) {
      await db.update(newsletterDeliveries).set({ status: 'queued', error: null, sentAt: new Date() }).where(eq(newsletterDeliveries.id, ligne.id));
      pris.push(subscriberId);
    }
  }
  return pris;
}

async function marquer(newsletterId: string, subscriberId: string, status: 'sent' | 'failed', error?: string) {
  const db = getDb();
  if (!db) return;
  await db.update(newsletterDeliveries).set({
    status,
    error: error ?? null,
    sentAt: new Date(),
  }).where(and(
    eq(newsletterDeliveries.newsletterId, newsletterId),
    eq(newsletterDeliveries.subscriberId, subscriberId),
  ));
}

export async function essaiLettre(id: string, email: string) {
  const db = getDb();
  if (!db) return { error: 'unavailable' as const };
  const cle = process.env.RESEND_API_KEY;
  if (!cle || !process.env.NEXTAUTH_SECRET) return { error: 'unavailable' as const };
  const [lettre] = await db.select().from(newsletters).where(eq(newsletters.id, id)).limit(1);
  if (!lettre) return { error: 'missing' as const };
  const locales = (['fr', 'en'] as const).filter((locale) => languePrete(lettre, locale));
  if (!locales.length) return { error: 'empty' as const };
  const resend = new Resend(cle);
  for (const locale of locales) {
    const message = messageLettre(lettre, email, locale);
    if (!message) return { error: 'unavailable' as const };
    const prefixe = locale === 'fr' ? '[essai]' : '[test]';
    const { error } = await resend.emails.send({ ...message, subject: `${prefixe} ${message.subject}` });
    if (error) return { error: 'send' as const };
  }
  return { ok: true as const, locales };
}

export async function envoyerLettre(id: string) {
  const db = getDb();
  if (!db) return { error: 'unavailable' as const };
  const cle = process.env.RESEND_API_KEY;
  if (!cle || !process.env.NEXTAUTH_SECRET) return { error: 'unavailable' as const };
  const [lettre] = await db.select().from(newsletters).where(eq(newsletters.id, id)).limit(1);
  if (!lettre) return { error: 'missing' as const };
  const inscrits = await db.select().from(subscribers).where(eq(subscribers.status, 'subscribed'));
  const eligibles = inscrits.filter((inscrit) => languePrete(lettre, langue(inscrit.locale)));
  if (!eligibles.length) return { sent: 0, failed: 0, remaining: 0, empty: true as const };
  const envoyes = await db.select({ subscriberId: newsletterDeliveries.subscriberId }).from(newsletterDeliveries).where(and(
    eq(newsletterDeliveries.newsletterId, lettre.id),
    eq(newsletterDeliveries.status, 'sent'),
  ));
  const deja = new Set(envoyes.map((ligne) => ligne.subscriberId));
  const aFaire = eligibles.filter((inscrit) => !deja.has(inscrit.id));
  const pris = await reclamer(lettre.id, aFaire.slice(0, MAX_PAR_REQUETE).map((inscrit) => inscrit.id));
  const parId = new Map(eligibles.map((inscrit) => [inscrit.id, inscrit]));
  const cibles = pris.map((subscriberId) => parId.get(subscriberId)).filter((inscrit): inscrit is Inscrit => Boolean(inscrit));
  const resend = new Resend(cle);
  let sent = 0;
  let failed = 0;
  for (let i = 0; i < cibles.length; i += TAILLE_LOT) {
    const lot = cibles.slice(i, i + TAILLE_LOT);
    const messages = lot.map((inscrit) => messageLettre(lettre, inscrit.email, langue(inscrit.locale)));
    if (messages.some((message) => !message)) return { error: 'unavailable' as const };
    let result: Awaited<ReturnType<typeof resend.batch.send>>;
    try {
      result = await resend.batch.send(messages as NonNullable<(typeof messages)[number]>[], {
        batchValidation: 'permissive',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'send';
      for (const inscrit of lot) {
        await marquer(lettre.id, inscrit.id, 'failed', message);
        failed += 1;
      }
      break;
    }
    if (result.error || !result.data) {
      const message = result.error?.message || 'send';
      for (const inscrit of lot) {
        await marquer(lettre.id, inscrit.id, 'failed', message);
        failed += 1;
      }
      break;
    }
    const data = result.data as { errors?: { index: number; message: string }[] };
    const erreurs = new Map((data.errors ?? []).map((erreur) => [erreur.index, erreur.message]));
    for (let index = 0; index < lot.length; index += 1) {
      const erreur = erreurs.get(index);
      if (erreur) {
        await marquer(lettre.id, lot[index].id, 'failed', erreur);
        failed += 1;
      } else {
        await marquer(lettre.id, lot[index].id, 'sent');
        sent += 1;
      }
    }
  }
  const reste = await compterRestants(lettre);
  if (reste === 0) {
    await db.update(newsletters).set({
      status: 'sent',
      sentAt: lettre.sentAt ?? new Date(),
    }).where(eq(newsletters.id, lettre.id));
  } else if (sent || failed) {
    await db.update(newsletters).set({ status: 'sending' }).where(eq(newsletters.id, lettre.id));
  }
  return { sent, failed, remaining: reste };
}
