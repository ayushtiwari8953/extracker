import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import TransactionFormModal from '../transactions/TransactionFormModal';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickAdd, setQuickAdd] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-72">
        <Topbar onMenu={() => setSidebarOpen(true)} onQuickAdd={() => setQuickAdd(true)} />
        <main key={location.pathname} className="px-4 py-6 animate-fade-in lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Outlet context={{ refreshKey: () => setQuickAdd(false) }} />
          </div>
        </main>
      </div>
      <TransactionFormModal open={quickAdd} onClose={() => setQuickAdd(false)} />
    </div>
  );
}
