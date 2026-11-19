import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

const STORAGE_KEY = 'architecture-admin-auth';

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.token) {
          setToken(parsed.token);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: newToken }));
    navigate('/dashboard', { replace: true });
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
    navigate('/login', { replace: true });
  };

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      loading,
      login,
      logout,
    }),
    [token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

