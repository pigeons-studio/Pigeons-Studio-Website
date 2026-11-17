import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Header from '@/app/components/Header';
import OrcaFond from '@/app/components/world/OrcaFond';
import { buildPageMetadata } from '@/lib/seo';
import styles from '../legal/page.module.css';
import SubscribeForm from './SubscribeForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'newsletter' });
  return buildPageMetadata({
    locale,
    pathSegment: 'newsletter',
    title: t('title'),
    description: t('metaDescription'),
  });
}

export default function NewsletterPage() {
  return (
    <div className={`page ${styles.page}`}>
      <Header />
      <main className={styles.main}>
        <OrcaFond patch="contact" />
        <SubscribeForm />
      </main>
    </div>
  );
}
