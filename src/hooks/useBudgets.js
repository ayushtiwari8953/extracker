import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function useBudgets() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    if (!user) return;
    let active = true;
    setLoading(true);
    api.listBudgets(user.id)
      .then((res) => { if (active) setItems(res); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [user, reloadKey]);

  return { items, loading, reload };
}
