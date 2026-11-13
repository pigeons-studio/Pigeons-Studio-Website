'use client';

import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import Scene from '@/app/components/world/Scene';
import { isEventScene } from '@/lib/event-scenes';
import { splitTags } from '@/lib/events';
import cadre from '../animations/animations.module.css';
import styles from './admin.module.css';

export type Apercu = {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  startsAt: string;
  endsAt: string;
  place: string;
  imageUrl: string | null;
  scene: string | null;
  capacity: number;
  remaining: number;
  hidden: boolean;
};

type Langue = 'fr' | 'en';

function quand(iso: string, locale: Langue) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Paris',
  }).format(date);
}

export function apercuDepuisForm(form: {
  titleFr: string;
  titleEn: string;
  subtitleFr: string;
  subtitleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  tagsFr: string;
  tagsEn: string;
  startsAt: string;
  endsAt: string;
  place: string;
  imageUrl: string;
  scene: string;
  capacity: string;
  hidden: boolean;
}, locale: string): Apercu {
  const fr = locale === 'fr';
  const capacity = Number(form.capacity);
  const scene = form.scene && isEventScene(form.scene) ? form.scene : null;
  return {
    title: fr ? form.titleFr : form.titleEn,
    subtitle: fr ? form.subtitleFr : form.subtitleEn,
    description: fr ? form.descriptionFr : form.descriptionEn,
    tags: splitTags(fr ? form.tagsFr : form.tagsEn),
    startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : '',
    endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : '',
    place: form.place,
    imageUrl: form.imageUrl || null,
    scene,
    capacity: Number.isFinite(capacity) ? capacity : 0,
    remaining: Number.isFinite(capacity) ? capacity : 0,
    hidden: form.hidden,
  };
}

export function apercuDepuisDetail(detail: {
  titleFr: string;
  titleEn: string;
  subtitleFr: string | null;
  subtitleEn: string | null;
  descriptionFr: string;
  descriptionEn: string;
  tagsFr: string | null;
  tagsEn: string | null;
  startsAt: string;
  endsAt: string;
  place: string;
  imageUrl: string | null;
  scene: string | null;
  capacity: number;
  hidden: boolean;
  registrations?: { invite: boolean }[];
}, locale: string): Apercu {
  const fr = locale === 'fr';
  const pris = detail.registrations?.filter((person) => !person.invite).length ?? 0;
  const scene = detail.scene && isEventScene(detail.scene) ? detail.scene : null;
  return {
    title: fr ? detail.titleFr : detail.titleEn,
    subtitle: (fr ? detail.subtitleFr : detail.subtitleEn) ?? '',
    description: fr ? detail.descriptionFr : detail.descriptionEn,
    tags: splitTags(fr ? detail.tagsFr : detail.tagsEn),
    startsAt: detail.startsAt,
    endsAt: detail.endsAt,
    place: detail.place,
    imageUrl: detail.imageUrl,
    scene,
    capacity: detail.capacity,
    remaining: Math.max(0, detail.capacity - pris),
    hidden: detail.hidden,
  };
}

export default function EventApercu({
  apercu,
  locale,
  onClose,
}: {
  apercu: Apercu | null;
  locale: string;
  onClose: () => void;
}) {
  if (!apercu || typeof document === 'undefined') return null;
  const fr = locale === 'fr';
  const langue: Langue = fr ? 'fr' : 'en';
  const debut = quand(apercu.startsAt, langue);
  const fin = quand(apercu.endsAt, langue);
  return createPortal(
    <div className={styles.voile} role="dialog" aria-modal="true" aria-labelledby="apercu-titre" onClick={onClose}>
      <div className={`${styles.fenetre} ${styles.fenetreLarge}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.choix}>
          <p id="apercu-titre">{fr ? 'Aperçu' : 'Preview'}{apercu.hidden ? (fr ? ' · masqué' : ' · hidden') : ''}</p>
          <button type="button" className={styles.btn} onClick={onClose}>{fr ? 'fermer' : 'close'}</button>
        </div>
        <article className={styles.apercu}>
          {(debut || fin) && <p className={styles.quand}>{debut}{debut && fin ? ' — ' : ''}{fin}</p>}
          <h2>{apercu.title || (fr ? 'sans titre' : 'untitled')}</h2>
          {apercu.subtitle && <p className={styles.sous}>{apercu.subtitle}</p>}
          {apercu.place && <p className={styles.sous}>{apercu.place}</p>}
          <p>{fr
            ? `${apercu.remaining} ${apercu.remaining === 1 ? 'restante' : 'restantes'} / ${apercu.capacity}`
            : `${apercu.remaining} left / ${apercu.capacity}`}</p>
          {apercu.scene && (
            <div className={cadre.cadre} style={{ width: '100%', maxWidth: '100%', height: 'auto', aspectRatio: '16 / 10' }}>
              <Scene id={apercu.scene} css="#ff8a5b" locale={langue} />
            </div>
          )}
          {apercu.imageUrl && <img src={apercu.imageUrl} alt={apercu.title} />}
          {apercu.tags.length > 0 && <div className={styles.tags}>{apercu.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}
          {apercu.description && (
            <div className={styles.md}><ReactMarkdown rehypePlugins={[rehypeSanitize]}>{apercu.description}</ReactMarkdown></div>
          )}
        </article>
      </div>
    </div>,
    document.body,
  );
}
