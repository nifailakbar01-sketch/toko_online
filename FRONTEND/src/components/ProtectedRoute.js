import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from './Common';

// ========================================
// ProtectedRoute: Lindungi halaman yang memerlukan login
// ========================================
export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Jika ada role requirement, cek apakah user memiliki role tersebut
  if (requiredRole) {
    // Support single role (string) atau multiple roles (array)
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!allowedRoles.includes(user.role)) {
      return (
        <div className="alert alert-danger" role="alert">
          Anda tidak memiliki akses ke halaman ini. Diperlukan role: <strong>{allowedRoles.join(', ')}</strong>
        </div>
      );
    }
  }

  return children;
};
