import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import TodoBadge from '@/app/components/TodoBadge';
import { buildPageMetadata } from '@/lib/seo';
import styles from './page.module.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return buildPageMetadata({
    locale,
    pathSegment: 'about',
    title: t('title'),
    description: t('subtitle'),
  });
}

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <div className={`page ${styles.page}`}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>{t('title')}</h1>
            <p className={styles.subtitle}>{t('subtitle')}</p>
          </div>

          <div className={styles.content}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('sections.mission.title')}</h2>
              <p>{t('sections.mission.content')}</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('sections.koo.title')}</h2>
              <p>{t('sections.koo.content')}</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('sections.julien.title')}</h2>
              <p>{t('sections.julien.content')}</p>
              <div>
                <TodoBadge detail={t('todo.julienBio')} />
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('sections.eightos.title')}</h2>
              <p>{t('sections.eightos.content')}</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('sections.collaborations.title')}</h2>
              <p>{t('sections.collaborations.content')}</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('sections.approach.title')}</h2>
              <p>{t('sections.approach.content')}</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('sources.title')}</h2>
              <ul className={styles.sourceList}>
                <li>
                  <a
                    className={styles.externalLink}
                    href={t('sources.villaAlbertine.url')}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('sources.villaAlbertine.label')}
                  </a>
                </li>
                <li>
                  <a
                    className={styles.externalLink}
                    href={t('sources.eightos.url')}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('sources.eightos.label')}
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
