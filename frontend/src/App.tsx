import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { BaseLayout } from './components/layout/base-layout';
import { GraduationAccessGuard } from './components/layout/graduation-access-guard';
import { Dashboard } from './pages/dashboard';
import { Schedule } from './pages/schedule';
import { ExploreCourses } from './pages/explore-courses';
import './App.css';
import { QueryClientProvider } from './lib/react-query';
import { Toaster } from 'sonner';

function App() {
  return (
    <QueryClientProvider>
      <BrowserRouter>
        <BaseLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/schedule"
              element={
                <GraduationAccessGuard>
                  <Schedule />
                </GraduationAccessGuard>
              }
            />
            <Route
              path="/courses"
              element={
                <GraduationAccessGuard>
                  <ExploreCourses />
                </GraduationAccessGuard>
              }
            />
          </Routes>
        </BaseLayout>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
