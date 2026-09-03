'use client';

import { useTranslations } from 'next-intl';
import styles from './TodoBadge.module.css';

export default function TodoBadge({ detail }: { detail: string }) {
  const t = useTranslations('common.todo');

  return (
    <span className={styles.todoBadge}>
      <span className={styles.todoLabel}>{t('label')}</span>
      <span className={styles.todoDetail}>{detail}</span>
    </span>
  );
}
