'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { Link, usePathname } from '@/i18n/routing';
import LanguageSwitcher from './LanguageSwitcher';
import { useCartStore } from '@/app/store/cartStore';
import Cart from './Cart';
import LoginModal from './LoginModal';
import UserMenu from './UserMenu';
import styles from "./Header.module.css";

export default function Header() {
  const t = useTranslations('common.nav');
  const tAuth = useTranslations('auth');
  const tCart = useTranslations('cart');
  const totalItems = useCartStore((state) => state.getTotalItems());
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Bloquer le scroll du body quand une modale est ouverte
  useEffect(() => {
    // Gérer les modales (cart, login) - besoin de position: fixed et compensation scrollbar
    if (isCartOpen || isLoginOpen) {
      const scrollY = window.scrollY;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      const supportsStableGutter = typeof CSS !== 'undefined' && CSS.supports('scrollbar-gutter: stable');
      
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = supportsStableGutter ? '0px' : `${scrollbarWidth}px`;
      
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        window.scrollTo(0, scrollY);
      };
    }
    
    // Gérer le menu mobile - juste bloquer le scroll sans position: fixed
    // pour éviter le décalage visuel (le menu est déjà en position: fixed)
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isCartOpen, isLoginOpen, isMobileMenuOpen]);

  // Fermer le menu mobile quand on clique en dehors
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`.${styles.nav}`) && !target.closest(`.${styles.mobileMenuButton}`)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname === '/fr' || pathname === '/en';
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} aria-label={t('home')}>
          PIGEONS//STUDIO
        </Link>
        <div className={styles.cadreActions}>
          {mounted && totalItems > 0 && (
            <button type="button" className={styles.cadreLien} onClick={() => setIsCartOpen(true)}>
              {tCart('title')} · {totalItems}
            </button>
          )}
          {session ? (
            <UserMenu />
          ) : (
            <button type="button" className={styles.cadreLien} onClick={() => setIsLoginOpen(true)}>
              {tAuth('login')}
            </button>
          )}
          <Link href="/contact" className={`${styles.cadreLien} ${styles.cadreOr} ${isActive('/contact') ? styles.active : ''}`}>
            {t('contact')}
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
      {mounted && isCartOpen && createPortal(
        <div className={styles.cartModal} onClick={() => setIsCartOpen(false)}>
          <div className={styles.cartModalContent} onClick={(e) => e.stopPropagation()}>
            <Cart />
            <button className={styles.closeCartButton} onClick={() => setIsCartOpen(false)}>
              ×
            </button>
          </div>
        </div>,
        document.body
      )}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </header>
  );
}
