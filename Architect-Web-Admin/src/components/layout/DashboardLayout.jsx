import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-[var(--bg-main)] text-[var(--text-primary)]">
      <Sidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      <div
        className={[
          'flex h-screen flex-col transition-[padding] duration-200',
          sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-56',
        ].join(' ')}
      >
        <Topbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 overflow-y-auto scrollbar-hidden bg-transparent px-4 py-4 sm:px-6 sm:py-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
