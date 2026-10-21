import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { buildPageMetadata } from '@/lib/seo';
import SoftwaresClient from './SoftwaresClient';
import styles from './page.module.css';
import OrcaFond from '@/app/components/world/OrcaFond';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'softwares' });
  return buildPageMetadata({
    locale,
    pathSegment: 'softwares',
    title: t('title'),
    description: t('subtitle'),
  });
}

export default function LogicielsPage() {
  const t = useTranslations('softwares');

  return (
    <div className={`page ${styles.page}`}>
      <Header />
      <main className={styles.main}>
        <OrcaFond patch="logiciels" />
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>{t('title')}</h1>
            <p className={styles.subtitle}>{t('subtitle')}</p>
          </div>
          <SoftwaresClient />
        </div>
      </main>
      <Footer />
    </div>
  );
}

