import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import MainLayout from './layouts/MainLayout';
import { Toaster } from '@/components/ui/sonner';
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
import ManageQuizPage from './pages/Quiz/ManageQuizPage';
import TeacherModuleCreatePage from './pages/Module/TeacherModuleCreatePage';
import TeacherModuleEditPage from './pages/Module/TeacherModuleEditPage';
import TeacherModuleListPage from './pages/Module/TeacherModuleListPage';
import LandingPage from './pages/LandingPage';
import TeacherListAssigmentPage from './pages/Assigment/TeacherListAssigmentPage';
import TeacherCreateAssignmentPage from './pages/Assigment/TeacherCreateAssigmentPage';
import TakeQuizPage from './pages/Quiz/TakeQuizPage';
import QuizResultPage from './pages/Quiz/QuizResultPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <LayoutProvider>
          <Toaster />
          <Routes>
            {/* publik */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* private */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />

                {/* courses */}
                <Route path="courses">
                  <Route index element={<CourseListPage />} />

                  <Route path=":courseId">
                    <Route index element={<CourseDetailPage />} />

                    {/* modules */}
                    <Route path="modules">
                      <Route index element={<ModuleListPage />} />
                      <Route path="teacher">
                        <Route index element={<TeacherModuleListPage />} />
                        <Route
                          path="create"
                          element={<TeacherModuleCreatePage />}
                        />
                        <Route
                          path="edit/:moduleId"
                          element={<TeacherModuleEditPage />}
                        />
                      </Route>
                    </Route>

                    {/* assigments */}
                    <Route path="assigments">
                      <Route index element={<TeacherListAssigmentPage />} />
                      <Route
                        path="create"
                        element={<TeacherCreateAssignmentPage />}
                      />
                    </Route>

                    {/* quiz */}
                    <Route path="quiz">
                      <Route path="create" element={<AppendQuizPage />} />
                      <Route path=":quizId" element={<ManageQuizPage />} />
                      <Route path=":quizId/take" element={<TakeQuizPage />} />
                    </Route>
                  </Route>
                </Route>

                <Route path="quiz-result/:quizId" element={<QuizResultPage />} />
                {/* get course */}
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
