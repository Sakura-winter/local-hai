import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi } from '../api/auth';
import { DEMO_USERS } from '../mock/data';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('localhai_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('localhai_token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await loginApi({ email, password });
      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem('localhai_token', data.access_token);
      localStorage.setItem('localhai_user', JSON.stringify(data.user));
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await registerApi(userData);
      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem('localhai_token', data.access_token);
      localStorage.setItem('localhai_user', JSON.stringify(data.user));
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const quickDemoLogin = (role = 'customer') => {
    const demoUser = role === 'shop_owner' ? DEMO_USERS.shop_owner : DEMO_USERS.customer;
    const demoToken = `mock-demo-${role}-${Date.now()}`;
    setToken(demoToken);
    setUser(demoUser);
    localStorage.setItem('localhai_token', demoToken);
    localStorage.setItem('localhai_user', JSON.stringify(demoUser));
    return demoUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('localhai_token');
    localStorage.removeItem('localhai_user');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    quickDemoLogin,
    logout,
    isAuthenticated: !!token && !!user,
    isOwner: user?.role === 'shop_owner',
    isCustomer: user?.role === 'customer'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

