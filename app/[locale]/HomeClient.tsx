'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import TodoBadge from '@/app/components/TodoBadge';
import styles from './page.module.css';

export default function HomeClient() {
  const t = useTranslations('home');
  const tCommon = useTranslations('common.cta');
  const router = useRouter();
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@punkhazard.org';
  const [glitchIntensity, setGlitchIntensity] = useState<'normal' | 'moderate' | 'intense' | 'extreme' | 'crazy'>('normal');
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const intensityIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const pointerIdRef = useRef<number | null>(null);
  const initialPointerPosRef = useRef<{ x: number; y: number } | null>(null);
  const isLongPressingRef = useRef<boolean>(false);

  const handleLongPressStart = () => {
    if (isLongPressingRef.current) return; // Éviter les doubles déclenchements
    isLongPressingRef.current = true;
    startTimeRef.current = Date.now();
    setGlitchIntensity('moderate');
    
    // Augmenter progressivement l'intensité sur 10 secondes
    intensityIntervalRef.current = setInterval(() => {
      if (!startTimeRef.current || !isLongPressingRef.current) return;
      
      const elapsed = Date.now() - startTimeRef.current;
      
      if (elapsed < 2000) {
        setGlitchIntensity('moderate');
      } else if (elapsed < 4500) {
        setGlitchIntensity('intense');
      } else if (elapsed < 7500) {
        setGlitchIntensity('extreme');
      } else {
        setGlitchIntensity('crazy');
      }
    }, 100);
    
    // Déclencher l'action après 10 secondes
    longPressTimerRef.current = setTimeout(() => {
      if (intensityIntervalRef.current) {
        clearInterval(intensityIntervalRef.current);
        intensityIntervalRef.current = null;
      }
      if (pointerIdRef.current !== null && titleRef.current) {
        try {
          titleRef.current.releasePointerCapture(pointerIdRef.current);
        } catch (e) {
          // Ignore si le pointer n'est plus actif
        }
        pointerIdRef.current = null;
      }
      initialPointerPosRef.current = null;
      isLongPressingRef.current = false;
      startTimeRef.current = null;
      setGlitchIntensity('normal');
      router.push('/bios');
    }, 10000);
  };

  const handleLongPressEnd = () => {
    if (!isLongPressingRef.current) return; // Éviter les doubles arrêts
    isLongPressingRef.current = false;
    setGlitchIntensity('normal');
    
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    if (intensityIntervalRef.current) {
      clearInterval(intensityIntervalRef.current);
      intensityIntervalRef.current = null;
    }
    
    if (pointerIdRef.current !== null && titleRef.current) {
      try {
        titleRef.current.releasePointerCapture(pointerIdRef.current);
      } catch (e) {
        // Ignore si le pointer n'est plus actif
      }
      pointerIdRef.current = null;
    }
    
    initialPointerPosRef.current = null;
    startTimeRef.current = null;
  };

  useEffect(() => {
    const timer = longPressTimerRef.current;
    const interval = intensityIntervalRef.current;
    
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  return (
    <div className={`page ${styles.page}`}>
      <Header />
      {glitchIntensity === 'crazy' && (
        <div className={styles.glitchOverlay} aria-hidden="true">
          <span className={styles.scanline} />
          <span className={styles.noiseOverlay} />
          <span className={styles.vignette} />
        </div>
      )}
      <header className={styles.hero}>
        <div className={styles.container}>
          <span className={styles.badge}>{t('badge')}</span>
          <h1 
            ref={titleRef}
            className={`${styles.heroTitle} ${styles.balloon} ${styles.glitchTitle} ${
              glitchIntensity === 'moderate' ? styles.glitchModerate :
              glitchIntensity === 'intense' ? styles.glitchIntense :
              glitchIntensity === 'extreme' ? styles.glitchExtreme :
              glitchIntensity === 'crazy' ? styles.glitchCrazy : ''
            }`}
            data-text="Pigeons Studio"
            onTouchStart={(event) => {
              event.preventDefault();
              event.stopPropagation();
              if (event.touches.length === 1) {
                const touch = event.touches[0];
                initialPointerPosRef.current = { x: touch.clientX, y: touch.clientY };
                handleLongPressStart();
              }
            }}
            onTouchEnd={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handleLongPressEnd();
            }}
            onTouchCancel={(event) => {
              event.preventDefault();
              event.stopPropagation();
              // Vérifier si le mouvement est petit avant d'annuler
              if (event.changedTouches.length > 0 && initialPointerPosRef.current) {
                const touch = event.changedTouches[0];
                const dx = touch.clientX - initialPointerPosRef.current.x;
                const dy = touch.clientY - initialPointerPosRef.current.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Si le mouvement est trop grand, annuler
                if (distance > 150) {
                  handleLongPressEnd();
                }
                // Sinon, ignorer le cancel (petit mouvement)
              } else {
                handleLongPressEnd();
              }
            }}
            onTouchMove={(event) => {
              // Vérifier la distance depuis la position initiale
              if (event.touches.length > 0 && initialPointerPosRef.current && isLongPressingRef.current) {
                const touch = event.touches[0];
                const dx = touch.clientX - initialPointerPosRef.current.x;
                const dy = touch.clientY - initialPointerPosRef.current.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Si le mouvement est trop grand, annuler
                if (distance > 150) {
                  event.preventDefault();
                  handleLongPressEnd();
                }
              }
            }}
            onPointerDown={(event) => {
              // Pour les souris, utiliser pointer events
              if (event.pointerType === 'mouse') {
                event.preventDefault();
                event.stopPropagation();
                pointerIdRef.current = event.pointerId;
                initialPointerPosRef.current = { x: event.clientX, y: event.clientY };
                const element = event.currentTarget;
                element.setPointerCapture(event.pointerId);
                handleLongPressStart();
              }
            }}
            onPointerUp={(event) => {
              if (event.pointerType === 'mouse' && pointerIdRef.current === event.pointerId) {
                event.preventDefault();
                event.stopPropagation();
                event.currentTarget.releasePointerCapture(event.pointerId);
                pointerIdRef.current = null;
                initialPointerPosRef.current = null;
                handleLongPressEnd();
              }
            }}
            onPointerCancel={(event) => {
              if (event.pointerType === 'mouse' && pointerIdRef.current === event.pointerId) {
                event.preventDefault();
                event.stopPropagation();
                event.currentTarget.releasePointerCapture(event.pointerId);
                pointerIdRef.current = null;
                initialPointerPosRef.current = null;
                handleLongPressEnd();
              }
            }}
            onPointerMove={(event) => {
              // Pour les souris uniquement
              if (event.pointerType === 'mouse' && pointerIdRef.current === event.pointerId && startTimeRef.current !== null) {
                if (initialPointerPosRef.current) {
                  const dx = event.clientX - initialPointerPosRef.current.x;
                  const dy = event.clientY - initialPointerPosRef.current.y;
                  const distance = Math.sqrt(dx * dx + dy * dy);
                  
                  if (distance > 150) {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                    pointerIdRef.current = null;
                    initialPointerPosRef.current = null;
                    handleLongPressEnd();
                  }
                }
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <span className={styles.glitchTitleText}>{t('title')}</span>
          </h1>
          <p className={styles.duoLine}>{t('duoLine')}</p>
          <p className={styles.duoCaption}>{t('duoCaption')}</p>
          <p className={`${styles.subtitle} ${styles.terminalLine}`}>
            {t('subtitle')}
          </p>
          <div className={styles.todoStack}>
            <TodoBadge detail={t('todo.valueProposition')} />
            <TodoBadge detail={t('todo.identity')} />
          </div>
        </div>
      </header>

      <main>
        <section id="duo" className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>{t('sections.duo.title')}</h2>
            <p className={styles.sectionSubtitle}>{t('sections.duo.subtitle')}</p>
            <div className={`${styles.grid} ${styles.gridTwoCols}`}>
              <div className={styles.card}>
                <div className={styles.portraitPlaceholder}>
                  <TodoBadge detail={t('sections.duo.todo.portraitKoo')} />
                </div>
                <h3>{t('sections.duo.koo.name')}</h3>
                <p className={styles.memberRole}>{t('sections.duo.koo.role')}</p>
                <div className={styles.bioParagraphs}>
                  {t.raw('sections.duo.koo.paragraphs').map((paragraph: string, i: number) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
                <p className={styles.releasesTitle}>{t('sections.duo.koo.releases.title')}</p>
                <ul>
                  {t.raw('sections.duo.koo.releases.items').map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.card}>
                <div className={styles.portraitPlaceholder}>
                  <TodoBadge detail={t('sections.duo.todo.portraitJulien')} />
                </div>
                <h3>{t('sections.duo.julien.name')}</h3>
                <p className={styles.memberRole}>{t('sections.duo.julien.role')}</p>
                <p>{t('sections.duo.julien.description')}</p>
              </div>
            </div>
            <div className={styles.historyBlock}>
              <h3 className={styles.historyTitle}>{t('sections.duo.history.title')}</h3>
              <div className={styles.ecosystemProse}>
                <p>
                  {t.rich('sections.duo.history.p1', {
                    matrice: (chunks) => (
                      <a
                        className={styles.inlineLink}
                        href="https://www.matrice.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {chunks}
                      </a>
                    ),
                  })}
                </p>
                <p>
                  {t.rich('sections.duo.history.p2', {
                    eightos: (chunks) => (
                      <a
                        className={styles.inlineLink}
                        href="https://8os.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {chunks}
                      </a>
                    ),
                  })}
                </p>
                <p>{t('sections.duo.history.p3')}</p>
              </div>
            </div>
            <div className={styles.todoStack}>
              <TodoBadge detail={t('sections.duo.todo.duoPhotos')} />
              <TodoBadge detail={t('sections.duo.todo.bios')} />
              <TodoBadge detail={t('sections.duo.todo.tattoo')} />
            </div>
          </div>
        </section>

        <section id="activites" className={styles.sectionAlt}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>{t('sections.activities.title')}</h2>
            <p className={styles.sectionSubtitle}>{t('sections.activities.subtitle')}</p>

            <h3 className={`${styles.highlightsTitle} ${styles.highlightsTitleFirst}`}>
              {t('sections.activities.heading')}
            </h3>
            <div className={`${styles.grid} ${styles.activitiesGrid}`}>
              {(['data', 'consulting', 'direction', 'digitalArt', 'physical', 'cdm', 'robotic'] as const).map((key) => (
                <div key={key} className={styles.card}>
                  <h3>{t(`sections.activities.items.${key}.title`)}</h3>
                  <p>{t(`sections.activities.items.${key}.description`)}</p>
                </div>
              ))}
            </div>

            <div id="capacites">
              <h3 className={styles.highlightsTitle}>{t('sections.capabilities.title')}</h3>
              <p className={styles.sectionSubtitle}>{t('sections.capabilities.subtitle')}</p>
              <div className={styles.grid}>
                {(['sensors', 'robots', 'translation', 'spatial', 'modes'] as const).map((key) => (
                  <div key={key} className={styles.card}>
                    <h3>{t(`sections.capabilities.items.${key}.title`)}</h3>
                    <p>{t(`sections.capabilities.items.${key}.description`)}</p>
                    <ul>
                      {t.raw(`sections.capabilities.items.${key}.features`).map((feature: string, i: number) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className={styles.todoStack}>
                <TodoBadge detail={t('sections.capabilities.todo.media')} />
                <TodoBadge detail={t('sections.capabilities.todo.rider')} />
                <TodoBadge detail={t('sections.capabilities.todo.inventory')} />
                <TodoBadge detail={t('sections.capabilities.todo.software')} />
                <TodoBadge detail={t('sections.capabilities.todo.networks')} />
                <TodoBadge detail={t('sections.expertise.todo.perPerson')} />
              </div>
            </div>
          </div>
        </section>

        <section id="realisations" className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>{t('sections.work.title')}</h2>
            <p className={styles.sectionSubtitle}>{t('sections.work.subtitle')}</p>

            <h3 className={`${styles.highlightsTitle} ${styles.highlightsTitleFirst}`}>
              {t('sections.duo.highlights.title')}
            </h3>
            <div className={styles.workGrid}>
              {(['intuition', 'selm', 'activateCities'] as const).map((key) => (
                <div key={key} className={styles.card}>
                  <p className={styles.highlightMeta}>{t(`sections.duo.highlights.items.${key}.meta`)}</p>
                  <h3>{t(`sections.duo.highlights.items.${key}.title`)}</h3>
                  <p>{t(`sections.duo.highlights.items.${key}.description`)}</p>
                </div>
              ))}
            </div>

            <h3 className={styles.highlightsTitle}>{t('sections.projects.heading')}</h3>
            <div className={styles.workGrid}>
              <div className={styles.card}>
                <div className={styles.cardImage}>
                  <Image
                    src="/products/placeholder.svg"
                    alt={t('sections.projects.items.as-simt.title')}
                    fill
                    sizes="(max-width: 960px) 100vw, 33vw"
                  />
                </div>
                <h3>{t('sections.projects.items.as-simt.title')}</h3>
                <div className={styles.workMeta}>
                  {t.raw('sections.projects.items.as-simt.tags').map((tag: string) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
                <p>{t('sections.projects.items.as-simt.description')}</p>
              </div>

              <div className={styles.card}>
                <div className={styles.cardImage}>
                  <Image
                    src="/products/placeholder.svg"
                    alt={t('sections.projects.items.go2.title')}
                    fill
                    sizes="(max-width: 960px) 100vw, 33vw"
                  />
                </div>
                <h3>{t('sections.projects.items.go2.title')}</h3>
                <div className={styles.workMeta}>
                  {t.raw('sections.projects.items.go2.tags').map((tag: string) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
                <p>{t('sections.projects.items.go2.description')}</p>
              </div>

              <div className={styles.card}>
                <div className={styles.cardImage}>
                  <Image
                    src="/products/placeholder.svg"
                    alt={t('sections.projects.items.installations.title')}
                    fill
                    sizes="(max-width: 960px) 100vw, 33vw"
                  />
                </div>
                <h3>{t('sections.projects.items.installations.title')}</h3>
                <div className={styles.workMeta}>
                  {t.raw('sections.projects.items.installations.tags').map((tag: string) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
                <p>{t('sections.projects.items.installations.description')}</p>
              </div>
            </div>
            <div className={styles.todoStack}>
              <TodoBadge detail={t('sections.projects.todo.timeline')} />
              <TodoBadge detail={t('sections.projects.todo.showreel')} />
            </div>

            <div id="references">
              <h3 className={styles.highlightsTitle}>{t('sections.references.title')}</h3>
              <p className={styles.sectionSubtitle}>{t('sections.references.subtitle')}</p>
              <div className={styles.grid}>
                <div id="partenaires" className={styles.card}>
                  <h3>{t('sections.references.brands.title')}</h3>
                  <p>{t('sections.references.brands.description')}</p>
                  <div className={`${styles.todoStack} ${styles.todoStackTight}`}>
                    <TodoBadge detail={t('sections.references.todo.brands')} />
                  </div>
                </div>
                <div className={styles.card}>
                  <h3>{t('sections.references.institutions.title')}</h3>
                  <p>{t('sections.references.institutions.description')}</p>
                </div>
                <div className={styles.card}>
                  <h3>{t('sections.references.residencies.title')}</h3>
                  <p>{t('sections.references.residencies.description')}</p>
                </div>
                <div className={styles.card}>
                  <h3>{t('sections.references.press.title')}</h3>
                  <p>{t('sections.references.press.description')}</p>
                  <div className={`${styles.todoStack} ${styles.todoStackTight}`}>
                    <TodoBadge detail={t('sections.references.todo.press')} />
                  </div>
                </div>
              </div>
              <div className={styles.todoStack}>
                <TodoBadge detail={t('sections.references.todo.discography')} />
              </div>
            </div>
          </div>
        </section>

        <section id="ecosysteme" className={styles.sectionAlt}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>{t('sections.ecosystem.title')}</h2>
            <p className={styles.sectionSubtitle}>{t('sections.ecosystem.subtitle')}</p>
            <div className={styles.ecosystemProse}>
              {t.raw('sections.ecosystem.paragraphs').map((paragraph: string, i: number) => (
                <p key={i}>{paragraph}</p>
              ))}
              <a
                className={styles.externalLink}
                href={t('sections.ecosystem.linkUrl')}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('sections.ecosystem.linkLabel')}
              </a>
            </div>
          </div>
        </section>

        <section id="contact" className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>{t('sections.contact.title')}</h2>
            <p className={styles.contactText}>{t('sections.contact.description')}</p>
            <div className={styles.ctas}>
              <Link
                className={styles.primary}
                href="/contact"
              >
                {tCommon('contact')}
              </Link>
            </div>
            <p className={styles.contactLine}>
              <span>{t('sections.contact.email')}</span>
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            </p>
            <div className={styles.todoStack}>
              <TodoBadge detail={t('sections.contact.todo.structure')} />
              <TodoBadge detail={t('sections.contact.todo.billing')} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
