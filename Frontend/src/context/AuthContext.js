import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    if (token) {
      setUser(JSON.parse(localStorage.getItem('user')));
    }
  }, [token]);

  const signup = async userData => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.signup(userData);
      const { token: newToken, id, username, role } = response.data;

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify({ id, username, role }));

      setToken(newToken);
      setUser({ id, username, role });

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Signup failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async credentials => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      const { token: newToken, id, username, role, address } = response.data;

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify({ id, username, role, address }));

      setToken(newToken);
      setUser({ id, username, role, address });

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        signup,
        login,
        logout,
        isAuthenticated,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
