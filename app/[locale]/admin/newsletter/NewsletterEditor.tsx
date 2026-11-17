'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { lettreHtml } from '@/lib/newsletter-html';
import AdminShell from '../events/AdminShell';
import styles from '../events/admin.module.css';

type Formulaire = {
  subjectFr: string;
  subjectEn: string;
  previewFr: string;
  previewEn: string;
  bodyFr: string;
  bodyEn: string;
};

type Comptes = { subscribed: number; fr: number; en: number };

const vide: Formulaire = {
  subjectFr: '', subjectEn: '', previewFr: '', previewEn: '', bodyFr: '', bodyEn: '',
};

function pret(form: Formulaire, locale: 'fr' | 'en') {
  if (locale === 'en') return Boolean(form.subjectEn.trim() && form.bodyEn.trim());
  return Boolean(form.subjectFr.trim() && form.bodyFr.trim());
}

export default function NewsletterEditor({ id }: { id?: string }) {
  const fr = useLocale() === 'fr';
  const router = useRouter();
  const [form, setForm] = useState<Formulaire>(vide);
  const [statut, setStatut] = useState('draft');
  const [comptes, setComptes] = useState<Comptes | null>(null);
  const [reste, setReste] = useState(0);
  const [echecs, setEchecs] = useState<{ email: string; error: string | null }[]>([]);
  const [msg, setMsg] = useState('');
  const [apercu, setApercu] = useState<'fr' | 'en' | null>(null);
  const [busy, setBusy] = useState(false);
  const [sale, setSale] = useState(false);
  const [manque, setManque] = useState(false);
  const zone = useRef<'fr' | 'en'>('fr');
  const zoneFr = useRef<HTMLTextAreaElement>(null);
  const zoneEn = useRef<HTMLTextAreaElement>(null);
  const verrou = statut !== 'draft';

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/newsletter/${id}`)
      .then((r) => {
        if (r.status === 404) { setManque(true); return null; }
        return r.json();
      })
      .then((data) => {
        if (!data?.lettre) return;
        const lettre = data.lettre;
        setForm({
          subjectFr: lettre.subjectFr || '',
          subjectEn: lettre.subjectEn || '',
          previewFr: lettre.previewFr || '',
          previewEn: lettre.previewEn || '',
          bodyFr: lettre.bodyFr || '',
          bodyEn: lettre.bodyEn || '',
        });
        setStatut(lettre.status);
        setComptes(data.comptes);
        setReste(data.reste ?? 0);
        setEchecs(data.echecs ?? []);
      })
      .catch(() => setMsg(fr ? 'Base indisponible.' : 'Database unavailable.'));
  }, [id, fr]);

  const changer = (cle: keyof Formulaire, valeur: string) => {
    setSale(true);
    setForm((actuel) => ({ ...actuel, [cle]: valeur }));
  };

  const rafraichir = async (lettreId: string) => {
    const data = await fetch(`/api/admin/newsletter/${lettreId}`).then((reponse) => reponse.json()).catch(() => null);
    if (!data?.lettre) return;
    setStatut(data.lettre.status);
    setComptes(data.comptes);
    setReste(data.reste ?? 0);
    setEchecs(data.echecs ?? []);
  };

  const enregistrer = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMsg('');
    const r = await fetch(id ? `/api/admin/newsletter/${id}` : '/api/admin/newsletter', {
      method: id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) {
      setMsg(data.error === 'locked'
        ? (fr ? 'Cette lettre est déjà partie. Elle ne se modifie plus.' : 'This letter has already been sent. It can no longer be edited.')
        : (fr ? 'Enregistrement impossible.' : 'Could not save.'));
      return;
    }
    if (!id && data.lettre?.id) {
      router.push(`/admin/newsletter/${data.lettre.id}`);
      return;
    }
    setSale(false);
    setMsg(fr ? 'Enregistré.' : 'Saved.');
    if (id) await rafraichir(id);
  };

  const inserer = (url: string) => {
    const locale = zone.current;
    const el = locale === 'en' ? zoneEn.current : zoneFr.current;
    const cle = locale === 'en' ? 'bodyEn' : 'bodyFr';
    const snippet = `\n\n![image](${url})\n`;
    setSale(true);
    setForm((actuel) => {
      const texte = actuel[cle];
      if (!el) return { ...actuel, [cle]: `${texte}${snippet}` };
      const debut = el.selectionStart ?? texte.length;
      const fin = el.selectionEnd ?? texte.length;
      return { ...actuel, [cle]: `${texte.slice(0, debut)}${snippet}${texte.slice(fin)}` };
    });
  };

  const image = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setMsg('');
    const body = new FormData();
    body.set('file', file);
    const r = await fetch('/api/admin/newsletter/image', { method: 'POST', body });
    const data = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) {
      setMsg(data.error === 'blob'
        ? (fr ? 'Le store Blob Vercel n’est pas configuré.' : 'The Vercel Blob store is not configured.')
        : (fr ? 'Image refusée. JPEG, PNG, GIF ou WebP, 4 Mo maximum.' : 'Image refused. JPEG, PNG, GIF or WebP, 4 MB maximum.'));
      return;
    }
    inserer(data.url);
  };

  const envoyer = async (test: boolean) => {
    if (!id || sale) {
      setMsg(fr ? 'Enregistrez la lettre avant de l’envoyer.' : 'Save the letter before sending it.');
      return;
    }
    setBusy(true);
    setMsg('');
    const r = await fetch(`/api/admin/newsletter/${id}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test }),
    });
    const data = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) {
      setMsg(data.error === 'empty'
        ? (fr ? 'Il manque un sujet et un texte, en français ou en anglais.' : 'A subject and a text are missing, in French or in English.')
        : (fr ? 'L’envoi n’a pas abouti.' : 'The send did not go through.'));
      return;
    }
    if (test) {
      setMsg(fr ? 'Essai envoyé sur ton adresse admin.' : 'Test sent to your admin address.');
      return;
    }
    if (typeof data.remaining === 'number') setReste(data.remaining);
    if (data.empty) {
      setMsg(fr ? 'Aucun inscrit confirmé pour les langues rédigées.' : 'No confirmed subscriber for the languages you wrote.');
      return;
    }
    setMsg(fr
      ? `${data.sent} envoyés, ${data.failed} échecs, ${data.remaining} restants.`
      : `${data.sent} sent, ${data.failed} failed, ${data.remaining} remaining.`);
    await rafraichir(id);
  };

  const supprimer = async () => {
    if (!id) return;
    setBusy(true);
    const r = await fetch(`/api/admin/newsletter/${id}`, { method: 'DELETE' });
    setBusy(false);
    if (!r.ok) {
      setMsg(fr ? 'Suppression impossible.' : 'Could not delete.');
      return;
    }
    router.push('/admin/newsletter');
  };

  const htmlApercu = apercu ? lettreHtml({
    locale: apercu,
    apercu: apercu === 'en' ? form.previewEn : form.previewFr,
    corps: apercu === 'en' ? form.bodyEn : form.bodyFr,
    lienDesinscription: 'https://pigeons.studio/newsletter/leave',
  }) : '';

  return (
    <AdminShell retour={{ href: '/admin/newsletter', label: fr ? '◂ newsletter' : '◂ newsletter' }} titre={fr ? 'lettre' : 'letter'} large>
      {manque ? <p>{fr ? 'Cette lettre n’existe pas.' : 'This letter does not exist.'}</p> : (
        <form className={styles.form} onSubmit={enregistrer}>
          <p className={styles.muet}>
            {fr
              ? 'Titres avec #, gras avec **deux étoiles**, italique avec *une étoile*, liens [texte](https://…) et images ![légende](https://…). Une langue vide n’est pas envoyée.'
              : 'Headings with #, bold with **two stars**, italic with *one star*, links [text](https://…) and images ![caption](https://…). An empty language is not sent.'}
          </p>
          {comptes && (
            <p className={styles.muet}>
              {fr
                ? `${comptes.fr} inscrits français${pret(form, 'fr') ? '' : ' (texte manquant)'}, ${comptes.en} inscrits anglais${pret(form, 'en') ? '' : ' (texte manquant)'}. ${reste} encore à envoyer.`
                : `${comptes.fr} French subscribers${pret(form, 'fr') ? '' : ' (text missing)'}, ${comptes.en} English subscribers${pret(form, 'en') ? '' : ' (text missing)'}. ${reste} still to send.`}
            </p>
          )}
          <label>
            {fr ? 'Sujet français' : 'French subject'}
            <input value={form.subjectFr} disabled={verrou} onChange={(event) => changer('subjectFr', event.target.value)} />
          </label>
          <label>
            {fr ? 'Aperçu français' : 'French preview'}
            <input value={form.previewFr} disabled={verrou} onChange={(event) => changer('previewFr', event.target.value)} />
          </label>
          <label>
            {fr ? 'Texte français' : 'French text'}
            <textarea ref={zoneFr} value={form.bodyFr} disabled={verrou} onFocus={() => { zone.current = 'fr'; }} onChange={(event) => changer('bodyFr', event.target.value)} />
          </label>
          <label>
            {fr ? 'Sujet anglais' : 'English subject'}
            <input value={form.subjectEn} disabled={verrou} onChange={(event) => changer('subjectEn', event.target.value)} />
          </label>
          <label>
            {fr ? 'Aperçu anglais' : 'English preview'}
            <input value={form.previewEn} disabled={verrou} onChange={(event) => changer('previewEn', event.target.value)} />
          </label>
          <label>
            {fr ? 'Texte anglais' : 'English text'}
            <textarea ref={zoneEn} value={form.bodyEn} disabled={verrou} onFocus={() => { zone.current = 'en'; }} onChange={(event) => changer('bodyEn', event.target.value)} />
          </label>
          {!verrou && (
            <label>
              {fr ? 'Ajouter une image' : 'Add an image'}
              <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={(event) => { void image(event.target.files?.[0]); event.target.value = ''; }} />
            </label>
          )}
          <div className={styles.choix}>
            {!verrou && <button className={styles.btn} type="submit" disabled={busy}>{fr ? 'enregistrer' : 'save'}</button>}
            <button className={styles.btn} type="button" onClick={() => setApercu('fr')}>{fr ? 'aperçu fr' : 'preview fr'}</button>
            <button className={styles.btn} type="button" onClick={() => setApercu('en')}>{fr ? 'aperçu en' : 'preview en'}</button>
            <button className={styles.btn} type="button" disabled={busy || !id} onClick={() => { void envoyer(true); }}>{fr ? 'essai' : 'test'}</button>
            {reste > 0 && <button className={styles.btn} type="button" disabled={busy || !id} onClick={() => { void envoyer(false); }}>{statut === 'draft' ? (fr ? 'envoyer' : 'send') : (fr ? 'reprendre' : 'resume')}</button>}
            {id && !verrou && <button className={styles.btn} type="button" disabled={busy} onClick={() => { void supprimer(); }}>{fr ? 'supprimer' : 'delete'}</button>}
          </div>
          {msg && <p>{msg}</p>}
          {echecs.length > 0 && (
            <ul className={styles.liste}>
              {echecs.map((echec) => <li key={echec.email}><span>{echec.email}</span><span>{echec.error}</span></li>)}
            </ul>
          )}
        </form>
      )}
      {apercu && (
        <div className={styles.voile} onClick={() => setApercu(null)}>
          <div className={`${styles.fenetre} ${styles.fenetreLarge}`} onClick={(event) => event.stopPropagation()}>
            <iframe title={fr ? 'Aperçu' : 'Preview'} srcDoc={htmlApercu} style={{ width: '100%', height: 640, border: 0, background: '#000' }} />
            <button className={styles.btn} type="button" onClick={() => setApercu(null)}>{fr ? 'fermer' : 'close'}</button>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
