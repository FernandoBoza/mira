import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import React, { Suspense } from 'react';
import { ThemeToggle } from '@/components/layout/ThemeToggle.tsx';

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null // Render nothing in production
    : React.lazy(() =>
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      );
export const Route = createRootRoute({
  component: () => (
    <>
      <nav className="p-4 flex gap-2 items-center">
        <Link to={'/'} className="[&.active]:font-bold text-2xl">
          Home
        </Link>
        <Link to={'/gallery'} className="[&.active]:font-bold text-2xl">
          Gallery
        </Link>
        <Link to={'/projects'} className="[&.active]:font-bold text-2xl">
          Projects
        </Link>
        <ThemeToggle />
      </nav>

      <Outlet />
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </>
  ),
});
