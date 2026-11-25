import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { cn } from '@/utils';

export const AdminLayout: React.FC = () => {
  // Desktop collapsed state
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Mobile drawer state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleToggleSidebar = () => {
    // If mobile/tablet (<1024px), toggle mobile drawer
    if (window.innerWidth < 1024) {
      setIsMobileOpen((prev) => !prev);
    } else {
      // If desktop, toggle collapse
      setIsCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex font-sans antialiased">
      {/* =========================================================================
          LEFT SIDEBAR (Fixed Desktop, Collapsible, Responsive Mobile Drawer)
         ========================================================================= */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* =========================================================================
          MAIN CONTENT AREA (Offset dynamically by sidebar width on desktop)
         ========================================================================= */}
      <div
        className={cn(
          'flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out',
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        )}
      >
        {/* Top Navigation Bar */}
        <Header
          onToggleSidebar={handleToggleSidebar}
          isCollapsed={isCollapsed}
        />

        {/* Main Routed Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
