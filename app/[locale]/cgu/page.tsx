import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Header from '@/app/components/Header';
import OrcaFond from '@/app/components/world/OrcaFond';
import { buildPageMetadata } from '@/lib/seo';
import styles from '../legal/page.module.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'cgu' });
  return buildPageMetadata({
    locale,
    pathSegment: 'cgu',
    title: t('title'),
    description: t('metaDescription'),
  });
}

const SECTIONS = ['object', 'account', 'events', 'requests', 'conduct'] as const;

export default function CguPage() {
  const t = useTranslations('cgu');

  return (
    <div className={`page ${styles.page}`}>
      <Header />
      <main className={styles.main}>
        <OrcaFond patch="contact" />
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>{t('title')}</h1>
          </div>
          <div className={styles.content}>
            {SECTIONS.map((key) => (
              <section key={key} className={styles.section}>
                <h2 className={styles.sectionTitle}>{t(`sections.${key}.title`)}</h2>
                <p>{t(`sections.${key}.content`)}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
