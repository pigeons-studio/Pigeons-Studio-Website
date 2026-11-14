import { createHmac, timingSafeEqual } from 'crypto';

const DUREE_MS = 180 * 24 * 60 * 60 * 1000;

function secret() {
  return process.env.NEXTAUTH_SECRET || null;
}

export function signerDesinscription(slug: string, email: string) {
  const cle = secret();
  if (!cle) return null;
  const charge = Buffer.from(JSON.stringify({
    slug,
    email: email.toLowerCase(),
    exp: Date.now() + DUREE_MS,
  })).toString('base64url');
  const signature = createHmac('sha256', cle).update(charge).digest('base64url');
  return `${charge}.${signature}`;
}

export function lireDesinscription(jeton: string) {
  const cle = secret();
  if (!cle) return null;
  const [charge, signature] = jeton.split('.');
  if (!charge || !signature) return null;
  const attendue = createHmac('sha256', cle).update(charge).digest('base64url');
  const gauche = Buffer.from(signature);
  const droite = Buffer.from(attendue);
  if (gauche.length !== droite.length || !timingSafeEqual(gauche, droite)) return null;
  try {
    const data = JSON.parse(Buffer.from(charge, 'base64url').toString()) as {
      slug?: unknown;
      email?: unknown;
      exp?: unknown;
    };
    if (typeof data.slug !== 'string' || typeof data.email !== 'string' || typeof data.exp !== 'number') return null;
    if (data.exp < Date.now()) return null;
    return { slug: data.slug, email: data.email };
  } catch {
    return null;
  }
}
