import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  const loadCurrentUser = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.getMe();
      if (res.success) {
        setUser(res.user);
        setProfile(res.profile);
      } else {
        localStorage.removeItem('auth_token');
        setUser(null);
        setProfile(null);
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
      localStorage.removeItem('auth_token');
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCurrentUser();

    const handleExpired = () => {
      setUser(null);
      setProfile(null);
      toast.warning('Your session has expired. Please sign in again.', 'Session Expired');
      navigate('/login');
    };

    window.addEventListener('auth-expired', handleExpired);
    return () => window.removeEventListener('auth-expired', handleExpired);
  }, [loadCurrentUser, navigate, toast]);

  const login = async (email, password) => {
    try {
      const res = await api.login(email, password);
      if (res.success) {
        localStorage.setItem('auth_token', res.token);
        setUser(res.user);
        setProfile(res.profile);
        toast.success(`Welcome back, ${res.user.name}!`, 'Signed In');

        // Redirect based on role
        if (res.user.role === 'admin') {
          navigate('/admin');
        } else if (res.user.role === 'trainer') {
          navigate('/trainer');
        } else if (res.user.role === 'student') {
          navigate('/student');
        } else {
          navigate('/');
        }
        return { success: true };
      }
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.', 'Authentication Error');
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await api.logout().catch(() => {});
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
      setProfile(null);
      toast.info('You have been logged out securely.', 'Logged Out');
      navigate('/login');
    }
  };

  const refreshProfile = async () => {
    try {
      const res = await api.getMe();
      if (res.success) {
        setUser(res.user);
        setProfile(res.profile);
      }
    } catch (err) {
      console.error('Refresh profile error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        role: user?.role || null,
        isAuthenticated: !!user,
        login,
        logout,
        refreshProfile,
        setUser,
        setProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
