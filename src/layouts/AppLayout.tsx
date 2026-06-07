import type { ReactNode } from 'react';

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return <main className="app-shell">{children}</main>;
}
