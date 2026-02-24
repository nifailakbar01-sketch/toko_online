import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../services/api';

// ========================================
// Buat Auth Context
// ========================================
const AuthContext = createContext();

// ========================================
// Auth Provider Component
// ========================================
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('accessToken'));

  // Cek apakah user sudah login saat aplikasi dimulai
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('accessToken');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  // ========================================
  // Login function
  // ========================================
  const login = async (username, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        username,
        password,
      });

      const { accessToken, refreshToken, user: userData } = response.data;

      // Simpan ke localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setToken(accessToken);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };

  // ========================================
  // Logout function
  // ========================================
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await apiClient.post('/auth/logout', { token: refreshToken });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Hapus dari localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      setUser(null);
      setToken(null);
    }
  };

  // ========================================
  // Refresh Token function
  // ========================================
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return;

      const response = await apiClient.post('/auth/token', {
        token: refreshToken,
      });

      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      setToken(accessToken);
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    refreshAccessToken,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ========================================
// Hook untuk menggunakan Auth Context
// ========================================
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
};
