import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { loginApi, demoLoginApi, getMeApi } from './api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('cis_auth_token');
    if (savedToken) {
      setToken(savedToken);
      fetchCurrentUser(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchCurrentUser(authToken) {
    try {
      const data = await getMeApi(authToken);
      setUser(data.user);
    } catch (err) {
      console.error('Failed to load user session:', err);
      logout();
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const data = await loginApi(email, password);
    localStorage.setItem('cis_auth_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  async function demoLogin(role, email) {
    const data = await demoLoginApi(role, email);
    localStorage.setItem('cis_auth_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem('cis_auth_token');
    setToken(null);
    setUser(null);
    router.push('/login');
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        demoLogin,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
