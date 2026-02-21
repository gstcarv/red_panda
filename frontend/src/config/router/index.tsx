import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import { BaseLayout } from '@/components/layout/base-layout';
import { AuthGuard } from '@/components/layout/auth-guard';
import { GraduationAccessGuard } from '@/components/layout/graduation-access-guard';
import { GuestOnlyGuard } from '@/components/layout/guest-only-guard';
import { Dashboard } from '@/pages/dashboard';
import { ExploreCourses } from '@/pages/explore-courses';
import { Login } from '@/pages/login';
import { Schedule } from '@/pages/schedule';

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
            <Schedule />
          </GraduationAccessGuard>
        ),
      },
      {
        path: '/courses',
        element: (
          <GraduationAccessGuard>
            <ExploreCourses />
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
