import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import { BaseLayout } from '@/components/layout/base-layout';
import { AuthGuard } from '@/components/layout/auth-guard';
import { GraduationAccessGuard } from '@/components/layout/graduation-access-guard';
import { GuestOnlyGuard } from '@/components/layout/guest-only-guard';
import { Dashboard } from '@/pages/dashboard';
import { Login } from '@/pages/login';

const Schedule = lazy(() =>
  import('@/pages/schedule').then((module) => ({ default: module.Schedule })),
);
const ExploreCourses = lazy(() =>
  import('@/pages/explore-courses').then((module) => ({
    default: module.ExploreCourses,
  })),
);

function RouteLoadingFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" aria-label="Loading page">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}

function ProtectedLayout() {
  return (
    <AuthGuard>
      <BaseLayout>
        <Outlet />
      </BaseLayout>
    </AuthGuard>
  );
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <GuestOnlyGuard>
        <Login />
      </GuestOnlyGuard>
    ),
  },
  {
    element: <ProtectedLayout />,
    children: [
      { path: '/', element: <Dashboard /> },
      {
        path: '/schedule',
        element: (
          <GraduationAccessGuard>
            <Suspense fallback={<RouteLoadingFallback />}>
              <Schedule />
            </Suspense>
          </GraduationAccessGuard>
        ),
      },
      {
        path: '/courses',
        element: (
          <GraduationAccessGuard>
            <Suspense fallback={<RouteLoadingFallback />}>
              <ExploreCourses />
            </Suspense>
          </GraduationAccessGuard>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
