// src/components/PrivateRoute.jsx
import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateRoute = () => {
  const { auth, loading } = useAuth();
  const location = useLocation();

  // 1. Tunggu proses cek token di localStorage selesai (dari AuthContext)
  if (loading) {
    return <div>Loading...</div>; // Atau ganti dengan Spinner component
  }

  // 2. Cek apakah ada accessToken
  return auth?.accessToken ? (
    <Outlet /> // Jika ada, render halaman tujuan (child routes)
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
  // Jika tidak, lempar ke login, bawa data lokasi asal (state)
};

export default PrivateRoute;
