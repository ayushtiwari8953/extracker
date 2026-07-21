import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState({ currency: 'INR', theme: 'light', notifications: true, lowBalanceAlerts: true });
  const [loaded, setLoaded] = useState(false);

  
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [settings.theme]);

 
  useEffect(() => {
    let active = true;
    if (!user) {
      setSettings({ currency: 'INR', theme: 'light', notifications: true, lowBalanceAlerts: true });
      setLoaded(true);
      return;
    }
    (async () => {
      try {
        const s = await api.getSettings(user.id);
        if (active) setSettings(s);
      } catch {
        // ignore
      } finally {
        if (active) setLoaded(true);
      }
    })();
    return () => { active = false; };
  }, [user]);

  const update = useCallback(async (patch) => {
    setSettings((prev) => ({ ...prev, ...patch }));
    if (user) await api.updateSettings(user.id, patch);
  }, [user]);

  const value = useMemo(() => ({ settings, update, loaded }), [settings, update, loaded]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
