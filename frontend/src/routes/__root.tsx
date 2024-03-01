import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import React, { Suspense } from 'react';
import { ThemeToggle } from '@/components/layout/theme-toggle.tsx';

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        })),
      );
export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-4 flex gap-2 items-center">
        <Link to={'/'} className="[&.active]:font-bold text-2xl">
          Home
        </Link>
        <Link to={'/upload'} className="[&.active]:font-bold text-2xl">
          Upload
        </Link>
        <ThemeToggle className="ml-auto" />
      </div>

      <Outlet />
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </>
  ),
});
