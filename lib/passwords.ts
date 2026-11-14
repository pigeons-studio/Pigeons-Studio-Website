import { timingSafeEqual } from 'crypto';

export function motDePasseAcceptable(password: string) {
  return password.length >= 8 && /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(password) && /\d/.test(password);
}

export function egalTempsConstant(gauche: string, droite: string) {
  const a = Buffer.from(gauche);
  const b = Buffer.from(droite);
  if (a.length !== b.length) {
    timingSafeEqual(a, a);
    return false;
  }
  return timingSafeEqual(a, b);
}
