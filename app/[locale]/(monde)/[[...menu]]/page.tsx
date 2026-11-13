import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { baseUrl, buildPageMetadata } from '@/lib/seo';
import { isFloor } from '@/lib/menus';
import { isSlug } from '@/lib/events';
import CONTENU from '@/app/components/world/contenu.json';

type Famille = { id: string; nom: string; blocs: { t: string; items?: { id?: string }[]; fiches?: { id?: string }[] }[] };

function ficheConnue(locale: 'fr' | 'en', floor: string, fiche?: string) {
  if (!fiche) return true;
  if (floor === 'events') return isSlug(fiche);
  const familles = (CONTENU as Record<string, Famille[]>)[locale] ?? [];
  const famille = familles.find((item) => item.id === floor);
  return Boolean(famille?.blocs.some((bloc) =>
    (bloc.t === 'explorer' ? bloc.items : bloc.fiches)?.some((item) => item.id === fiche)
  ));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; menu?: string[] }>;
}): Promise<Metadata> {
  const { locale, menu } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  const floor = menu?.[0];
  const familles = (CONTENU as Record<string, Famille[]>)[locale] ?? [];
  const nom = familles.find((item) => item.id === floor)?.nom;
  const segment = (menu ?? []).join('/');
  return buildPageMetadata({
    locale,
    pathSegment: segment,
    title: nom ? `${nom} | ${t('title')}` : t('title'),
    description: t('subtitle'),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string; menu?: string[] }>;
}) {
  const { locale, menu } = await params;
  const safeLocale = locale === 'en' ? 'en' : 'fr';
  const [floor, fiche, extra] = menu ?? [];
  if (extra || (floor && !isFloor(floor)) || (floor && !ficheConnue(safeLocale, floor, fiche))) notFound();

  const t = await getTranslations({ locale, namespace: 'home' });
  const jsonLd = floor ? null : {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'Pigeons Studio',
        url: baseUrl,
        email: 'contact@punkhazard.org',
        description: t('subtitle'),
        founder: [
          { '@type': 'Person', name: t('sections.duo.koo.name') },
          { '@type': 'Person', name: t('sections.duo.julien.name') },
        ],
        address: { '@type': 'PostalAddress', addressCountry: 'FR' },
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'Pigeons Studio',
        inLanguage: locale,
        publisher: { '@id': `${baseUrl}/#organization` },
      },
    ],
  };

  return (
    <>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <h1 className="sr-only">{t('title')} · {t('duoLine')}</h1>
    </>
  );
}
