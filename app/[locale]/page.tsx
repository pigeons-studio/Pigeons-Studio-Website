import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { baseUrl, buildPageMetadata } from '@/lib/seo';
import Header from '@/app/components/Header';
import World from '@/app/components/world/World';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  return buildPageMetadata({
    locale,
    pathSegment: '',
    title: t('title'),
    description: t('subtitle'),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  const jsonLd = {
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
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'FR',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'Pigeons Studio',
        inLanguage: locale,
        publisher: {
          '@id': `${baseUrl}/#organization`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <h1 className="sr-only">{t('title')} · {t('duoLine')}</h1>
        <World />
      </main>
    </>
  );
}
