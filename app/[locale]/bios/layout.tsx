import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    pathSegment: 'bios',
    title: 'BIOS',
    description:
      locale === 'fr'
        ? 'Page expérimentale non destinée à l’indexation.'
        : 'Experimental page not intended for indexing.',
    noIndex: true,
  });
}

export default function BiosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
