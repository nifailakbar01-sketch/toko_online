import axios from 'axios';

// ========================================
// Konfigurasi BASE URL API
// ========================================
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

// Buat instance axios dengan konfigurasi default
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========================================
// Interceptor untuk menambahkan token ke setiap request
// ========================================
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    console.log('[API Request]', config.url, '| Token:', token ? '✓ Ada' : '✗ Tidak ada');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ========================================
// Interceptor untuk handle response error
// ========================================
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    console.error('[API Error]', error.config?.url, '| Status:', status, '| Message:', message);
    
    if (status === 401) {
      // Token expired, redirect ke login
      console.warn('⚠️ Token expired atau invalid, redirecting to login...');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    if (status === 403) {
      const user = localStorage.getItem('user');
      const userObj = user ? JSON.parse(user) : null;
      console.error('❌ Access Forbidden - User role:', userObj?.role || 'Unknown');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
