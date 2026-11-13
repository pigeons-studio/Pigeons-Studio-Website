'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import Scene from '@/app/components/world/Scene';
import { isEventScene, sceneIds } from '@/lib/event-scenes';
import AdminShell from '../events/AdminShell';
import shell from '../events/admin.module.css';
import styles from './animations.module.css';

export default function AdminAnimations({ initialScene }: { initialScene?: string }) {
  const fr = useLocale() === 'fr';
  const router = useRouter();
  const ids = sceneIds();
  const [scene, setScene] = useState(initialScene && isEventScene(initialScene) ? initialScene : ids[0] ?? '');
  const [copie, setCopie] = useState(false);

  const choisir = (id: string) => {
    setScene(id);
    setCopie(false);
    router.replace(`/admin/animations?scene=${id}`, { scroll: false });
  };

  const copier = async () => {
    if (!scene) return;
    try {
      await navigator.clipboard.writeText(scene);
      setCopie(true);
    } catch {
      setCopie(false);
    }
  };

  return (
    <AdminShell
      large
      titre={fr ? 'Animations' : 'Animations'}
      retour={{ href: '/profile', label: fr ? '◂ profil' : '◂ profile' }}
      extra={<p><Link className={shell.lien} href="/admin/events">events</Link></p>}
    >
      <p className={shell.muet}>{fr
        ? 'Une animation à la fois, dans le même canvas que le site. Copiez son identifiant pour l’attacher à un event.'
        : 'One animation at a time, in the same canvas as the site. Copy its id to attach it to an event.'}</p>
      <ul className={styles.liste}>
        {ids.map((id) => (
          <li key={id}>
            <button type="button" aria-current={id === scene} onClick={() => choisir(id)}>{id}</button>
          </li>
        ))}
      </ul>
      {scene && (
        <>
          <div className={shell.choix}>
            <code>{scene}</code>
            <button type="button" className={shell.btn} onClick={copier}>{copie ? (fr ? 'copié' : 'copied') : (fr ? 'copier' : 'copy')}</button>
            <Link className={shell.btn} href={`/admin/events/new?scene=${scene}`}>{fr ? 'créer un event avec cette animation' : 'create an event with this animation'}</Link>
          </div>
          <div className={styles.cadre}>
            <Scene key={scene} id={scene} css="#ff8a5b" locale={fr ? 'fr' : 'en'} />
          </div>
        </>
      )}
    </AdminShell>
  );
}
