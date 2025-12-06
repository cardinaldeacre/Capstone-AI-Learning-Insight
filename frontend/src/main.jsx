import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import MainLayout from './layouts/MainLayout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import CourseListPage from './pages/Course/CourseListPage';
import Profile from './components/Profile/Profile';
import CourseDetailPage from './pages/Course/CourseDetailPage';
import ModuleListPage from './pages/Module/LearningPage';
import { LayoutProvider } from './contexts/LayoutContext';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Auth/LoginPage';
import Register from './pages/Auth/RegisterPage';
import { AuthProvider } from './contexts/AuthContext';
import ClassListPage from './pages/Classes/ClassListPage';
import AppendQuizPage from './pages/Quiz/AppendQuizPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <LayoutProvider>
          <Routes>
            {/* publik */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register/>}/>

            {/* private */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />

                {/* courses */}
                <Route path="courses">
                  <Route index element={<CourseListPage />} />

                  <Route path=":courseId">
                    <Route index element={<CourseDetailPage />} />

                    <Route path="modules" element={<ModuleListPage />} />
                    <Route path="quiz/create" element={<AppendQuizPage />} />
                  </Route>
                </Route>

                <Route path="classes">
                  <Route index element={<ClassListPage />} />
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
