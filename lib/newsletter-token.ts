import { createHash, createHmac, randomBytes, timingSafeEqual } from 'crypto';

function secret() {
  return process.env.NEXTAUTH_SECRET || null;
}

export function nouveauJeton() {
  const token = randomBytes(32).toString('base64url');
  return { token, hash: hashJeton(token) };
}

export function hashJeton(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export function jetonDesinscription(email: string) {
  const cle = secret();
  if (!cle) return null;
  const charge = Buffer.from(JSON.stringify({ email: email.toLowerCase() })).toString('base64url');
  const signature = createHmac('sha256', cle).update(`newsletter.unsub.${charge}`).digest('base64url');
  return `${charge}.${signature}`;
}

export function lireDesinscription(jeton: string) {
  const cle = secret();
  if (!cle) return null;
  const point = jeton.lastIndexOf('.');
  if (point <= 0) return null;
  const charge = jeton.slice(0, point);
  const signature = jeton.slice(point + 1);
  const attendue = createHmac('sha256', cle).update(`newsletter.unsub.${charge}`).digest('base64url');
  const gauche = Buffer.from(signature);
  const droite = Buffer.from(attendue);
  if (gauche.length !== droite.length || !timingSafeEqual(gauche, droite)) return null;
  try {
    const data = JSON.parse(Buffer.from(charge, 'base64url').toString()) as { email?: unknown };
    if (typeof data.email !== 'string' || !data.email.includes('@')) return null;
    return { email: data.email.toLowerCase() };
  } catch {
    return null;
  }
}
