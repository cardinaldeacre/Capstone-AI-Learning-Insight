import React, { createContext, useState, useEffect } from 'react';
import axiosClient from '@/lib/api/axiosClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [loading, setLoading] = useState(true);

  //cek token pertama kali
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
      setAuth({ user, accessToken: token });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await axiosClient.post('/users/login', {
      email,
      password
    });

    // response
    const { user, accessToken, refreshToken } = response.data;

    setAuth({ user, accessToken });
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));

    return true;
  };

  const logout = async () => {
    try {
      await axiosClient.post('/users/logout');
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      setAuth({});
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
