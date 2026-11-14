import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Header from '@/app/components/Header';
import OrcaFond from '@/app/components/world/OrcaFond';
import { buildPageMetadata } from '@/lib/seo';
import styles from '../../legal/page.module.css';
import LeaveForm from './LeaveForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'leave' });
  return buildPageMetadata({
    locale,
    pathSegment: 'events/leave',
    title: t('title'),
    description: t('metaDescription'),
    noIndex: true,
  });
}

export default async function LeavePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className={`page ${styles.page}`}>
      <Header />
      <main className={styles.main}>
        <OrcaFond patch="contact" />
        <LeaveForm token={token ?? ''} />
      </main>
    </div>
  );
}
