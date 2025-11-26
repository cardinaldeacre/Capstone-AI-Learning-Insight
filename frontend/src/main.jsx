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
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Auth/LoginPage';
import { AuthProvider } from './contexts/AuthContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <LayoutProvider>
          <Routes>
            {/* publik */}
            <Route path="/login" element={<Login />} />

            {/* private */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />

                {/* courses */}
                <Route path="courses">
                  <Route index element={<CourseListPage />} />

                  <Route path=":courseId">
                    <Route index element={<CourseDetailPage />} />
                    <Route
                      path="lesson/:lessonId"
                      element={<LessonListPage />}
                    />
                  </Route>
                </Route>

                <Route path="/profile" element={<Profile />} />
              </Route>
            </Route>
          </Routes>
        </LayoutProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
