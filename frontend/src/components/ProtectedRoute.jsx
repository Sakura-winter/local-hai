import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <span className="material-symbols-outlined animate-spin text-[36px] text-primary">progress_activity</span>
        <p className="font-body-md text-secondary">Spinning the web...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // If a customer attempts to access owner portal or vice versa
    if (user?.role === 'shop_owner') {
      return <Navigate to="/owner/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}

