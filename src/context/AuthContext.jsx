import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { store } from '../services/store';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { user: cached } = store.session.get();
    if (cached) setUser(cached);
    setLoading(false);
  }, []);

  const login = useCallback(async (creds) => {
    const { user: u } = await api.login(creds);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (data) => {
    const { user: u } = await api.register(data);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    const u = await api.me();
    setUser(u);
    return u;
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refresh, setUser, isAuthenticated: !!user, isAdmin: user?.role === 'admin' }),
    [user, loading, login, register, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
