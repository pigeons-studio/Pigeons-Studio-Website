'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import AdminShell from './AdminShell';
import styles from './admin.module.css';

type Detail = {
  id: string;
  slug: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  startsAt: string;
  endsAt: string;
  place: string;
  imageUrl: string | null;
  capacity: number;
  registrations: { name: string; email: string; invite: boolean }[];
  invites: { token: string; sent: boolean; usedAt: string | null; name: string | null; email: string | null }[];
};

const vide = {
  slug: '',
  titleFr: '',
  titleEn: '',
  descriptionFr: '',
  descriptionEn: '',
  startsAt: '',
  endsAt: '',
  place: '',
  imageUrl: '',
  capacity: '12',
};

function localInput(iso: string) {
  if (!iso) return '';
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function EventEditor({ id }: { id?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const fr = locale === 'fr';
  const [form, setForm] = useState(vide);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [msg, setMsg] = useState('');
  const [manque, setManque] = useState(false);
  const [origin, setOrigin] = useState('');

  const lire = useCallback(async (remplir: boolean) => {
    if (!id) return;
    const r = await fetch(`/api/admin/events/${id}`);
    if (r.status === 404) { setManque(true); return; }
    if (!r.ok) { setMsg(fr ? 'Base indisponible.' : 'Database unavailable.'); return; }
    const data: Detail = await r.json();
    setManque(false);
    setDetail(data);
    if (remplir) {
      setForm({
        slug: data.slug,
        titleFr: data.titleFr,
        titleEn: data.titleEn,
        descriptionFr: data.descriptionFr,
        descriptionEn: data.descriptionEn,
        startsAt: localInput(data.startsAt),
        endsAt: localInput(data.endsAt),
        place: data.place,
        imageUrl: data.imageUrl ?? '',
        capacity: String(data.capacity),
      });
    }
  }, [id, fr]);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (!id) return;
    let stop = false;
    const tick = (remplir: boolean) => {
      if (stop) return;
      if (!remplir && document.hidden) return;
      lire(remplir).catch(() => { if (remplir) setMsg('error'); });
    };
    tick(true);
    const timer = window.setInterval(() => tick(false), 3000);
    return () => { stop = true; window.clearInterval(timer); };
  }, [id, lire]);

  const envoyer = async (e: FormEvent) => {
    e.preventDefault();
    setMsg('');
    const body = {
      ...form,
      capacity: Number(form.capacity),
      startsAt: new Date(form.startsAt).toISOString(),
      endsAt: new Date(form.endsAt).toISOString(),
    };
    const r = await fetch(id ? `/api/admin/events/${id}` : '/api/admin/events', {
      method: id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      setMsg(data.error === 'slug' ? (fr ? 'Ce slug est déjà pris.' : 'This slug is already used.') : (data.error || 'error'));
      return;
    }
    if (!id && data.event?.id) {
      router.push(`/admin/events/${data.event.id}`);
      return;
    }
    setMsg(fr ? 'Enregistré.' : 'Saved.');
    lire(true).catch(() => {});
  };

  const inviter = async () => {
    if (!id) return;
    const r = await fetch(`/api/admin/events/${id}/invites`, { method: 'POST' });
    if (r.ok) lire(false).catch(() => {});
    else setMsg(fr ? 'Le lien n’a pas été créé.' : 'Could not create the link.');
  };

  const marquer = async (token: string, sent: boolean) => {
    if (!id) return;
    setDetail((current) => current && ({
      ...current,
      invites: current.invites.map((link) => (link.token === token ? { ...link, sent } : link)),
    }));
    const r = await fetch(`/api/admin/events/${id}/invites/${token}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sent }),
    });
    if (!r.ok) lire(false).catch(() => {});
  };

  const supprimer = async (token: string) => {
    if (!id) return;
    const r = await fetch(`/api/admin/events/${id}/invites/${token}`, { method: 'DELETE' });
    if (!r.ok) {
      setMsg(fr ? 'Le lien n’a pas été supprimé.' : 'Could not delete the link.');
      return;
    }
    setDetail((current) => current && ({
      ...current,
      invites: current.invites.filter((link) => link.token !== token),
    }));
  };

  const titre = id ? (detail ? (fr ? detail.titleFr : detail.titleEn) : (fr ? 'Éditer' : 'Edit')) : (fr ? 'Créer un event' : 'Create event');
  const pris = detail?.registrations.filter((person) => !person.invite).length ?? 0;
  const dispo = detail ? Math.max(0, detail.capacity - pris) : 0;

  return (
    <AdminShell
      titre={titre}
      retour={{ href: '/admin/events', label: '◂ events' }}
    >
      {manque ? (
        <p>{fr ? 'Cet event n’existe pas.' : 'This event doesn’t exist.'}</p>
      ) : (
        <>
          <form className={styles.form} onSubmit={envoyer}>
            <label>slug<input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="atelier-nantes" /></label>
            <label>titre fr<input required value={form.titleFr} onChange={(e) => setForm({ ...form, titleFr: e.target.value })} /></label>
            <label>title en<input required value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} /></label>
            <label>texte fr<textarea required value={form.descriptionFr} onChange={(e) => setForm({ ...form, descriptionFr: e.target.value })} /></label>
            <label>text en<textarea required value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} /></label>
            <label>{fr ? 'début' : 'start'}<input required type="datetime-local" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} /></label>
            <label>{fr ? 'fin' : 'end'}<input required type="datetime-local" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} /></label>
            <label>{fr ? 'lieu' : 'place'}<input required value={form.place} onChange={(e) => setForm({ ...form, place: e.target.value })} /></label>
            <label>{fr ? 'image (url)' : 'image (url)'}<input type="url" inputMode="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://" /></label>
            <label>{fr ? 'places' : 'seats'}<input required type="number" min={1} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} /></label>
            <button className={styles.btn} type="submit">{id ? (fr ? 'enregistrer' : 'save') : (fr ? 'créer' : 'create')}</button>
            {msg && <p>{msg}</p>}
          </form>
          {detail && (
            <>
              <h2>{fr ? 'Inscrits' : 'Guests'}</h2>
              <p>{fr ? `${dispo} disponibles · ${pris} pris` : `${dispo} available · ${pris} taken`}</p>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>{fr ? 'Nom' : 'Name'}</th>
                      <th>Email</th>
                      <th>{fr ? 'Origine' : 'Source'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.registrations.length === 0 ? (
                      <tr><td colSpan={3} className={styles.muet}>{fr ? 'Personne pour l’instant.' : 'Nobody yet.'}</td></tr>
                    ) : detail.registrations.map((person) => (
                      <tr key={person.email}>
                        <td>{person.name}</td>
                        <td>{person.email}</td>
                        <td>{person.invite ? (fr ? 'lien d’invitation' : 'invitation link') : (fr ? 'inscription' : 'registration')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button type="button" className={styles.btn} onClick={inviter}>{fr ? 'lien d’invitation' : 'invitation link'}</button>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                  <tr>
                    <th>{fr ? 'Lien' : 'Link'}</th>
                    <th>Sent</th>
                    <th>{fr ? 'Statut' : 'Status'}</th>
                    <th className={styles.action} />
                  </tr>
                </thead>
                <tbody>
                  {detail.invites.length === 0 ? (
                    <tr><td colSpan={4} className={styles.muet}>{fr ? 'Aucun lien.' : 'No links yet.'}</td></tr>
                  ) : detail.invites.map((link) => (
                    <tr key={link.token}>
                      <td>{`${origin}/${locale}/events/${detail.slug}?invite=${link.token}`}</td>
                      <td>
                        <label className={styles.sent}>
                          <input
                            type="checkbox"
                            checked={link.sent}
                            disabled={Boolean(link.usedAt)}
                            onChange={(e) => marquer(link.token, e.target.checked)}
                          />
                          {link.sent ? 'sent' : (fr ? 'à envoyer' : 'to send')}
                        </label>
                      </td>
                      <td>{link.usedAt ? `${link.name} · ${link.email}` : (fr ? 'pas encore utilisé' : 'not used yet')}</td>
                      <td className={styles.action}>
                        <button type="button" className={styles.btn} onClick={() => supprimer(link.token)}>{fr ? 'supprimer' : 'delete'}</button>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </AdminShell>
  );
}
