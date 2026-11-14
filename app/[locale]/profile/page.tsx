'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, Link } from '@/i18n/routing';
import Header from '@/app/components/Header';
import DeleteAccountModal from '@/app/components/DeleteAccountModal';
import type { OrderView } from '@/lib/order-types';
import styles from './page.module.css';
import OrcaFond from '@/app/components/world/OrcaFond';

const ETATS: Record<string, { fr: string; en: string }> = {
  received: { fr: 'reçue', en: 'received' },
  confirmed: { fr: 'confirmée', en: 'confirmed' },
  making: { fr: 'en fabrication', en: 'in production' },
  ready: { fr: 'prête', en: 'ready' },
  cancelled: { fr: 'annulée', en: 'cancelled' },
};

function etatCommande(status: string, locale: string) {
  const lib = ETATS[status];
  return lib ? lib[locale === 'en' ? 'en' : 'fr'] : status;
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const t = useTranslations('profile');
  const locale = useLocale();
  const tInfo = useTranslations('profile.sections.info');
  const tOrders = useTranslations('profile.sections.orders');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [commandes, setCommandes] = useState<OrderView[]>([]);
  const [edition, setEdition] = useState(false);
  const [nom, setNom] = useState('');
  const [messageNom, setMessageNom] = useState('');
  const [sauve, setSauve] = useState(false);
  
  // Rediriger si non connecté
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/admin/me').then((r) => setAdmin(r.ok)).catch(() => setAdmin(false));
    fetch('/api/orders').then((r) => r.ok ? r.json() : { orders: [] }).then((d) => setCommandes(d.orders || [])).catch(() => setCommandes([]));
  }, [status]);

  const enregistrerNom = async () => {
    setSauve(true);
    setMessageNom('');
    try {
      const reponse = await fetch('/api/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nom }),
      });
      const data = await reponse.json();
      if (!reponse.ok) {
        setMessageNom(tInfo('nameInvalid'));
        return;
      }
      await update({ name: data.name });
      setEdition(false);
    } catch {
      setMessageNom(tInfo('nameInvalid'));
    } finally {
      setSauve(false);
    }
  };

  const exporter = () => {
    window.location.href = '/api/account/export';
  };

  if (status === 'loading') {
    return (
      <div className={`page ${styles.page}`}>
        <Header />
        <main className={styles.main}>
        <OrcaFond patch="contact" />
          <div className={styles.container}>
            <div className={styles.loading}>Chargement...</div>
          </div>
        </main>
        </div>
    );
  }

  if (!session) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className={`page ${styles.page}`}>
      <Header />
      <main className={styles.main}>
        <OrcaFond patch="contact" />
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>{t('title')}</h1>
            <p className={styles.subtitle}>{t('subtitle')}</p>
          </div>

          <div className={styles.content}>
            {/* Section Informations personnelles */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{tInfo('title')}</h2>
              <div className={styles.infoCard}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>{tInfo('email')}</span>
                  <span className={styles.infoValue}>{session.user?.email || '-'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>{tInfo('name')}</span>
                  {edition ? (
                    <span className={styles.inlineActions}>
                      <input className={styles.nameInput} value={nom} onChange={(e) => setNom(e.target.value)} maxLength={80} />
                      <button type="button" className={styles.textButton} onClick={enregistrerNom} disabled={sauve}>{sauve ? tInfo('saving') : tInfo('save')}</button>
                      <button type="button" className={styles.textButton} onClick={() => setEdition(false)}>{tInfo('cancelEdit')}</button>
                    </span>
                  ) : (
                    <span className={styles.inlineActions}>
                      <span className={styles.infoValue}>{session.user?.name || '-'}</span>
                      <button type="button" className={styles.textButton} onClick={() => { setNom(session.user?.name || ''); setEdition(true); }}>{tInfo('edit')}</button>
                    </span>
                  )}
                </div>
                {messageNom && <p className={styles.dangerZoneWarning}>{messageNom}</p>}
                <button type="button" className={styles.textButton} onClick={exporter}>{tInfo('export')}</button>
                {admin && (
                  <div className={styles.adminBlock}>
                    <span className={styles.infoLabel}>admin</span>
                    <div className={styles.adminLinks}>
                      <Link href="/admin/users" className={styles.adminLink}>
                        <span>{locale === 'fr' ? 'comptes' : 'accounts'}</span>
                        <small>{locale === 'fr'
                          ? 'Voir les comptes, et donner ou retirer l’accès admin.'
                          : 'See the accounts, and grant or revoke admin access.'}</small>
                      </Link>
                      <Link href="/admin/events" className={styles.adminLink}>
                        <span>events</span>
                        <small>{locale === 'fr'
                          ? 'Créer les rendez-vous, les places, les inscriptions et les liens d’invitation.'
                          : 'Create the dates, the seats, the registrations and the invitation links.'}</small>
                      </Link>
                      <Link href="/admin/animations" className={styles.adminLink}>
                        <span>animations</span>
                        <small>{locale === 'fr'
                          ? 'Regarder les animations du site et copier leur identifiant pour l’attacher à un event.'
                          : 'Watch the site animations and copy an id to attach one to an event.'}</small>
                      </Link>
                      <Link href="/admin/orders" className={styles.adminLink}>
                        <span>{locale === 'fr' ? 'commandes' : 'orders'}</span>
                        <small>{locale === 'fr'
                          ? 'Voir toutes les commandes et précommandes, et changer leur état.'
                          : 'See every order and pre-order, and change its status.'}</small>
                      </Link>
                    </div>
                  </div>
                )}
                <div className={styles.dangerZone}>
                  <div className={styles.dangerZoneHeader}>
                    <h3 className={styles.dangerZoneTitle}>{tInfo('dangerZone')}</h3>
                    <p className={styles.dangerZoneWarning}>{tInfo('deleteAccountWarning')}</p>
                  </div>
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className={styles.deleteAccountButton}
                  >
                    {tInfo('deleteAccount')}
                  </button>
                </div>
              </div>
            </section>

            {/* Section Commandes */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{tOrders('title')}</h2>
              
              {commandes.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>{tOrders('empty')}</p>
                </div>
              ) : (
                <div className={styles.ordersList}>
                  {commandes.map((order) => (
                    <div key={order.id} className={styles.orderCard}>
                      <div className={styles.orderHeader}>
                        <div className={styles.orderInfo}>
                          <span className={styles.orderNumber}>
                            {order.kind === 'preorder' ? (locale === 'fr' ? 'Précommande' : 'Pre-order') : (locale === 'fr' ? 'Commande' : 'Order')}
                          </span>
                          <span className={styles.orderDate}>
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                        <div className={styles.orderMeta}>
                          <span className={styles.orderStatus}>
                            {etatCommande(order.status, locale)}
                          </span>
                        </div>
                      </div>
                      <div className={styles.orderItems}>
                        {order.items.map((item) => (
                          <div key={`${item.productId}-${item.color || ''}`} className={styles.orderItem}>
                            <div className={styles.orderItemInfo}>
                              <span className={styles.orderItemName}>
                                {(locale === 'en' ? item.nameEn : item.nameFr)}{item.color ? ` · ${item.color}` : ''}
                              </span>
                              <span className={styles.orderItemQuantity}>
                                x{item.quantity}
                              </span>
                            </div>
                            <div className={styles.orderItemPrice}>{item.priceLabel}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        userId={session.user?.id || ''}
      />
    </div>
  );
}
