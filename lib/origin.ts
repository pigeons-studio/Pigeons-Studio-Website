function hoteDe(value: string | null | undefined) {
  if (!value) return null;
  try {
    return new URL(value).host.toLowerCase();
  } catch {
    return null;
  }
}

export function memeOrigine(request: Request) {
  const source = request.headers.get('origin') || request.headers.get('referer');
  const hoteSource = hoteDe(source);
  if (!hoteSource || hoteSource === 'null') return false;

  const autorises = new Set<string>();
  const hote = request.headers.get('x-forwarded-host') || request.headers.get('host');
  if (hote) autorises.add(hote.toLowerCase());
  for (const valeur of [process.env.NEXTAUTH_URL, process.env.NEXT_PUBLIC_SITE_URL]) {
    const hoteConnu = hoteDe(valeur);
    if (hoteConnu) autorises.add(hoteConnu);
  }
  return autorises.has(hoteSource);
}
