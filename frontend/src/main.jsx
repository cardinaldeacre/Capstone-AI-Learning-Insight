import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import MainLayout from './layouts/MainLayout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import CourseListPage from './pages/Course/CourseListPage';
import Profile from './components/Profile/Profile';
import CourseDetailPage from './pages/Course/CourseDetailPage';
import LessonListPage from './pages/Lesson/LessonListPage';
import { LayoutProvider } from './contexts/LayoutContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LayoutProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            {/* courses */}
            <Route path="courses">
              <Route index element={<CourseListPage />} />

              <Route path=":courseId">
                <Route index element={<CourseDetailPage />} />
                <Route path="lesson/:lessonId" element={<LessonListPage />} />
              </Route>
            </Route>

            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </LayoutProvider>
    </BrowserRouter>
  </StrictMode>
);
