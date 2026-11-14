export const CGU_VERSION = '2026-11-14';
export const CGU_COOKIE = 'cgu';

export function poserCookieCgu() {
  if (typeof document === 'undefined') return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${CGU_COOKIE}=${CGU_VERSION}; Max-Age=600; Path=/; SameSite=Lax${secure}`;
}
