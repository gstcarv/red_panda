import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { BaseLayout } from './components/layout/base-layout';
import { Dashboard } from './pages/dashboard';
import { Schedule } from './pages/schedule';
import { Courses } from './pages/courses';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <BaseLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/courses" element={<Courses />} />
        </Routes>
      </BaseLayout>
    </BrowserRouter>
  );
}

export default App;
