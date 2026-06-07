import { useEffect, useState } from 'react';
import { AppLayout } from '../layouts/AppLayout';
import { getRouteElement } from './routes';

export function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const handleRouteChange = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return <AppLayout>{getRouteElement(pathname)}</AppLayout>;
}
