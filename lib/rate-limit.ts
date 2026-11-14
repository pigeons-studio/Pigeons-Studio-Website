import { eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { rateLimits } from '@/lib/db/schema';

const memoire = new Map<string, { hits: number; debut: number }>();

function autoriseMemoire(cle: string, limite: number, fenetreMs: number) {
  const maintenant = Date.now();
  const ligne = memoire.get(cle);
  if (!ligne || maintenant - ligne.debut >= fenetreMs) {
    memoire.set(cle, { hits: 1, debut: maintenant });
    return true;
  }
  if (ligne.hits >= limite) return false;
  ligne.hits += 1;
  return true;
}

export function adresseIp(request: { headers: Headers | Record<string, string | string[] | undefined> }) {
  const headers = request.headers;
  const lire = (nom: string) => {
    if (typeof (headers as Headers).get === 'function') return (headers as Headers).get(nom);
    const valeur = (headers as Record<string, string | string[] | undefined>)[nom];
    return Array.isArray(valeur) ? valeur[0] : valeur ?? null;
  };
  const transmis = lire('x-forwarded-for');
  const ip = transmis?.split(',')[0]?.trim() || lire('x-real-ip') || 'local';
  return ip.slice(0, 80);
}

export async function limiteAtteinte(cle: string, limite: number, fenetreMs: number) {
  const db = getDb();
  if (!db) return !autoriseMemoire(cle, limite, fenetreMs);
  const maintenant = new Date();
  try {
    const [ligne] = await db.select().from(rateLimits).where(eq(rateLimits.key, cle)).limit(1);
    const expiree = !ligne || maintenant.getTime() - ligne.windowStart.getTime() >= fenetreMs;
    if (expiree) {
      await db.insert(rateLimits).values({ key: cle, hits: 1, windowStart: maintenant }).onConflictDoUpdate({
        target: rateLimits.key,
        set: { hits: 1, windowStart: maintenant },
      });
      return false;
    }
    if (ligne.hits >= limite) return true;
    await db.update(rateLimits).set({ hits: ligne.hits + 1 }).where(eq(rateLimits.key, cle));
    return false;
  } catch (error) {
    console.error('Rate limit indisponible, repli mémoire:', error);
    return !autoriseMemoire(cle, limite, fenetreMs);
  }
}
