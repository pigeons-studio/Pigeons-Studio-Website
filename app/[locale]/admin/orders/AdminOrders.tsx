'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import AdminShell from '../events/AdminShell';
import styles from '../events/admin.module.css';
import { ORDER_STATUSES, type OrderView } from '@/lib/order-types';

const ETATS: Record<string, { fr: string; en: string }> = {
  received: { fr: 'reçue', en: 'received' },
  confirmed: { fr: 'confirmée', en: 'confirmed' },
  making: { fr: 'en fabrication', en: 'in production' },
  ready: { fr: 'prête', en: 'ready' },
  cancelled: { fr: 'annulée', en: 'cancelled' },
};

export default function AdminOrders() {
  const fr = useLocale() === 'fr';
  const [orders, setOrders] = useState<OrderView[]>([]);
  const [erreur, setErreur] = useState('');

  const charger = () => {
    fetch('/api/admin/orders')
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((d) => setOrders(d.orders || []))
      .catch(() => setErreur(fr ? 'Liste indisponible.' : 'List unavailable.'));
  };

  useEffect(() => { charger(); }, []);

  const changer = async (id: string, status: string) => {
    const r = await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!r.ok) return;
    const d = await r.json();
    setOrders((liste) => liste.map((order) => order.id === id ? d.order : order));
  };

  return (
    <AdminShell retour={{ href: '/profile', label: fr ? '◂ profil' : '◂ profile' }} titre={fr ? 'Commandes' : 'Orders'} large>
      {erreur && <p>{erreur}</p>}
      <ul className={styles.liste}>
        {orders.map((order) => (
          <li key={order.id}>
            <span>
              {order.kind === 'preorder' ? (fr ? 'Précommande' : 'Pre-order') : (fr ? 'Commande' : 'Order')}
              {' · '}{order.name} · {order.email}
            </span>
            <span>
              {order.items.map((item) => `${fr ? item.nameFr : item.nameEn}${item.color ? ` · ${item.color}` : ''} × ${item.quantity} — ${item.priceLabel}`).join(' / ')}
            </span>
            <select value={order.status} onChange={(e) => changer(order.id, e.target.value)} aria-label={fr ? 'État' : 'Status'}>
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>{ETATS[status][fr ? 'fr' : 'en']}</option>
              ))}
            </select>
          </li>
        ))}
      </ul>
      {!erreur && orders.length === 0 && <p>{fr ? 'Aucune commande.' : 'No orders.'}</p>}
    </AdminShell>
  );
}
