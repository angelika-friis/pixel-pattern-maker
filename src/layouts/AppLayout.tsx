import type { ReactNode } from 'react';
import styles from './AppLayout.module.css';

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return <main className={styles['app-shell']}>{children}</main>;
}
