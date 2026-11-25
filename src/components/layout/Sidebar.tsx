import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  UtensilsCrossed,
  QrCode,
  History,
  BarChart3,
  Settings,
  LogOut,
  ChefHat,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { APP_CONFIG, NAVIGATION_ITEMS, NavIconName } from '@/constants';
import { cn } from '@/utils';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success('Signed out of admin session');
    navigate('/login');
  };

  const renderIcon = (name: NavIconName) => {
    const iconClass = 'w-5 h-5 shrink-0 transition-transform duration-200';
    switch (name) {
      case 'LayoutDashboard':
        return <LayoutDashboard className={iconClass} />;
      case 'ShoppingBag':
        return <ShoppingBag className={iconClass} />;
      case 'Layers':
        return <Layers className={iconClass} />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed className={iconClass} />;
      case 'QrCode':
        return <QrCode className={iconClass} />;
      case 'History':
        return <History className={iconClass} />;
      case 'BarChart3':
        return <BarChart3 className={iconClass} />;
      case 'Settings':
        return <Settings className={iconClass} />;
      case 'LogOut':
        return <LogOut className={iconClass} />;
      default:
        return <LayoutDashboard className={iconClass} />;
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Shell (White Background, Dark Typography, Warm Orange #F47738 Accent) */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-all duration-300 ease-in-out',
          // Desktop sizing
          isCollapsed ? 'lg:w-20' : 'lg:w-64',
          // Mobile responsive slide-in
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* =========================================================================
            TOP: Restaurant Logo & Name Branding
           ========================================================================= */}
        <div>
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100">
            <div
              className={cn(
                'flex items-center gap-3 overflow-hidden transition-all duration-200',
                isCollapsed && !isMobileOpen ? 'justify-center w-full px-0' : 'px-1'
              )}
            >
              <div className="w-10 h-10 rounded-xl bg-[#F47738] flex items-center justify-center text-white shadow-md shadow-[#F47738]/20 shrink-0">
                <ChefHat className="w-5 h-5" />
              </div>

              {(!isCollapsed || isMobileOpen) && (
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-sm text-slate-900 truncate leading-snug">
                    {APP_CONFIG.restaurantName}
                  </span>
                  <span className="text-[10px] font-semibold text-[#F47738] uppercase tracking-wider leading-none mt-0.5">
                    Admin Console
                  </span>
                </div>
              )}
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* =========================================================================
              NAVIGATION ITEMS
             ========================================================================= */}
          <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-10rem)]" aria-label="Main navigation">
            {(!isCollapsed || isMobileOpen) && (
              <p className="px-3 pt-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Operations & Management
              </p>
            )}

            {NAVIGATION_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) onCloseMobile();
                }}
                title={isCollapsed && !isMobileOpen ? item.name : undefined}
                className={({ isActive }) =>
                  cn(
                    'group relative flex items-center rounded-xl text-xs font-medium transition-all duration-200 select-none',
                    isCollapsed && !isMobileOpen
                      ? 'justify-center p-3'
                      : 'justify-between px-3.5 py-2.5',
                    isActive
                      ? 'bg-orange-50/90 text-[#F47738] font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active vertical pill indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#F47738] rounded-r-full" />
                    )}

                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'transition-colors duration-200',
                          isActive ? 'text-[#F47738]' : 'text-slate-400 group-hover:text-slate-600'
                        )}
                      >
                        {renderIcon(item.iconName)}
                      </span>
                      {(!isCollapsed || isMobileOpen) && (
                        <span className="truncate">{item.name}</span>
                      )}
                    </div>

                    {/* Badge */}
                    {item.badge && (
                      <>
                        {(!isCollapsed || isMobileOpen) ? (
                          <span
                            className={cn(
                              'text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs',
                              item.badgeColor || 'bg-[#F47738] text-white'
                            )}
                          >
                            {item.badge}
                          </span>
                        ) : (
                          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F47738]" />
                        )}
                      </>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* =========================================================================
            BOTTOM: Desktop Collapse Toggle & Logout Action
           ========================================================================= */}
        <div className="p-3 border-t border-slate-100 space-y-1 bg-white">
          {/* Desktop Collapse / Expand Toggle Button */}
          <button
            onClick={onToggleCollapse}
            className={cn(
              'hidden lg:flex items-center w-full rounded-xl text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-200',
              isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3.5 py-2'
            )}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 text-slate-400" />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title={isCollapsed && !isMobileOpen ? 'Logout' : undefined}
            className={cn(
              'flex items-center w-full rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors duration-200',
              isCollapsed && !isMobileOpen ? 'justify-center p-3' : 'gap-3 px-3.5 py-2.5'
            )}
          >
            <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
            {(!isCollapsed || isMobileOpen) && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
