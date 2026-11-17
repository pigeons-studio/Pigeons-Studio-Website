import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Header from '@/app/components/Header';
import OrcaFond from '@/app/components/world/OrcaFond';
import { confirmerInscription } from '@/lib/newsletter';
import { buildPageMetadata } from '@/lib/seo';
import styles from '../../legal/page.module.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'newsletter' });
  return buildPageMetadata({
    locale,
    pathSegment: 'newsletter/confirm',
    title: t('confirmTitle'),
    description: t('metaDescription'),
    noIndex: true,
  });
}

export default async function ConfirmPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale } = await params;
  const { token } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'newsletter' });
  const result = token ? await confirmerInscription(token) : { error: 'invalid' as const };
  const ok = 'status' in result;

  return (
    <div className={`page ${styles.page}`}>
      <Header />
      <main className={styles.main}>
        <OrcaFond patch="contact" />
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>{t('confirmTitle')}</h1>
          </div>
          <div className={styles.content}>
            <p>{ok ? t('confirmOk') : t('confirmInvalid')}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
