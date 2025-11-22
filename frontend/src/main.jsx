import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import MainLayout from './layouts/MainLayout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import CourseListPage from './pages/Course/CourseListPage';
import Profile from './components/Profile/Profile';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="courses">
            <Route index element={<CourseListPage />} />
          </Route>
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
