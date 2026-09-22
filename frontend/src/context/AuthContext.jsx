import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('techstore_token');
        const storedUser = localStorage.getItem('techstore_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Silently revalidate user profile
          try {
            const profileRes = await authService.getProfile();
            if (profileRes.success && profileRes.data) {
              setUser(profileRes.data);
              localStorage.setItem('techstore_user', JSON.stringify(profileRes.data));
            }
          } catch (e) {
            // Token may have expired
            console.warn('Session expired or network error:', e.message);
          }
        }
      } catch (err) {
        console.error('Failed to initialize auth state:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password);
      if (res.success && res.data) {
        const { token: jwtToken, ...userData } = res.data;
        setUser(userData);
        setToken(jwtToken);
        localStorage.setItem('techstore_token', jwtToken);
        localStorage.setItem('techstore_user', JSON.stringify(userData));
        toast.success(`Welcome back, ${userData.name}!`);
        return { success: true, user: userData };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check credentials.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authService.register(userData);
      if (res.success && res.data) {
        const { token: jwtToken, ...newUserData } = res.data;
        setUser(newUserData);
        setToken(jwtToken);
        localStorage.setItem('techstore_token', jwtToken);
        localStorage.setItem('techstore_user', JSON.stringify(newUserData));
        toast.success(`Account created! Welcome to TechStore, ${newUserData.name}`);
        return { success: true, user: newUserData };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('techstore_token');
    localStorage.removeItem('techstore_user');
    toast.info('You have been logged out.');
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('techstore_user', JSON.stringify(updatedUserData));
  };

  const isAuthenticated = Boolean(user && token);
  const isAdmin = Boolean(user && user.role === 'admin');

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
