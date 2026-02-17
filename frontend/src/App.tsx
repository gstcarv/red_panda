import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { BaseLayout } from './components/layout/base-layout';
import { Dashboard } from './pages/dashboard';
import { Schedule } from './pages/schedule';
import { ExploreCourses } from './pages/explore-courses';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <BaseLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/courses" element={<ExploreCourses />} />
        </Routes>
      </BaseLayout>
    </BrowserRouter>
  );
}

export default App;
