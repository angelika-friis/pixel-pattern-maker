import { HomePage } from '../pages/HomePage';

export const routes = [
  {
    path: '/',
    element: <HomePage />,
  },
] as const;

export function getRouteElement(pathname: string) {
  return routes.find((route) => route.path === pathname)?.element ?? <HomePage />;
}
