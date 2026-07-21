import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function useTransactions(params = {}) {
  const { user } = useAuth();
  const [data, setData] = useState({ items: [], total: 0, page: 1, pageSize: 10, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let active = true;
    if (!user) return;
    setLoading(true);
    api
      .listTransactions(user.id, params)
      .then((res) => { if (active) { setData(res); setError(null); } })
      .catch((e) => { if (active) setError(e.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, reloadKey, JSON.stringify(params)]);

  return { ...data, loading, error, reload };
}

export function useAllTransactions() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    if (!user) return;
    let active = true;
    setLoading(true);
    api
      .listTransactions(user.id, { page: 1, pageSize: 10000 })
      .then((res) => { if (active) setItems(res.items); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [user, reloadKey]);

  return { items, loading, reload };
}
