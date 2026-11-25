import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  User,
  Sliders,
  Store,
  LogOut,
  ChevronDown,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { MOCK_ADMIN_PROFILE } from '@/constants/adminProfile';
import { NAVIGATION_ITEMS } from '@/constants';

interface HeaderProps {
  onToggleSidebar: () => void;
  isCollapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Derive current page title dynamically
  const currentNav = NAVIGATION_ITEMS.find((item) => item.href === location.pathname);
  const pageTitle = currentNav?.name || 'Restaurant Admin';

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setProfileDropdownOpen(false);
        setNotificationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSignOut = () => {
    setProfileDropdownOpen(false);
    toast.success('Logged out from workstation');
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-all">
      {/* =========================================================================
          LEFT: Sidebar Toggle, Dynamic Page Title & Breadcrumb
         ========================================================================= */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {/* Sidebar Toggle Button */}
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F47738]/20"
          aria-label="Toggle navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Title and Breadcrumb Block */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate tracking-tight leading-tight">
              {pageTitle}
            </h1>
          </div>
          <Breadcrumb className="hidden sm:flex mt-0.5" />
        </div>
      </div>

      {/* =========================================================================
          RIGHT: Search, Notification Icon & Administrator Profile Dropdown
         ========================================================================= */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Search Input */}
        <div className="relative hidden md:block w-52 lg:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search orders, dishes, tables..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F47738]/20 focus:border-[#F47738] transition-all"
          />
        </div>

        {/* Notification Icon & Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setNotificationDropdownOpen((prev) => !prev)}
            aria-expanded={notificationDropdownOpen}
            aria-haspopup="true"
            aria-label="Notifications"
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F47738]/20"
          >
            <Bell className="w-5 h-5" />
            {/* Live orange badge indicator */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F47738] rounded-full ring-2 ring-white" />
          </button>

          {/* Notifications Dropdown Card */}
          {notificationDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200/90 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  <span className="text-[10px] bg-orange-100 text-[#F47738] font-semibold px-1.5 py-0.2 rounded-full">
                    2 New
                  </span>
                </div>
                <button
                  onClick={() => toast.success('All marked as read')}
                  className="text-[11px] text-[#F47738] hover:underline font-medium"
                >
                  Mark all read
                </button>
              </div>

              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                <div className="p-3 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-2.5">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-[#F47738] shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-900">3 Kitchen orders pending pickup</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Table 04, Table 12 & Delivery #8941</p>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" /> 5 mins ago
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-2.5">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-900">Table 08 bill settled</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Payment of $74.00 approved via POS</p>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" /> 18 mins ago
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-slate-200 mx-0.5 hidden sm:block" />

        {/* =========================================================================
            ADMINISTRATOR PROFILE & PROFILE DROPDOWN
           ========================================================================= */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileDropdownOpen((prev) => !prev)}
            aria-expanded={profileDropdownOpen}
            aria-haspopup="true"
            className="flex items-center gap-2.5 p-1 sm:px-2 sm:py-1.5 rounded-xl hover:bg-slate-100/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F47738]/20"
          >
            {/* Avatar Pill with Warm Orange Accent */}
            <div className="w-8 h-8 rounded-full bg-orange-100 text-[#F47738] border border-orange-200/80 flex items-center justify-center font-bold text-xs shrink-0">
              {MOCK_ADMIN_PROFILE.avatarText}
            </div>

            {/* Profile Info (Desktop) */}
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 leading-tight">
                {MOCK_ADMIN_PROFILE.name}
              </span>
              <span className="text-[10px] text-slate-500 leading-tight mt-0.5 truncate max-w-[130px]">
                {MOCK_ADMIN_PROFILE.role}
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200/90 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
              {/* Header Details */}
              <div className="px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-orange-100 text-[#F47738] flex items-center justify-center font-bold text-sm shrink-0">
                    {MOCK_ADMIN_PROFILE.avatarText}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {MOCK_ADMIN_PROFILE.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {MOCK_ADMIN_PROFILE.email}
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">{MOCK_ADMIN_PROFILE.restaurantName}</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                </div>
              </div>

              {/* Menu Actions */}
              <div className="p-1 space-y-0.5 text-xs">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    toast('Navigating to Settings & Profile...');
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors text-left"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Administrator Profile</span>
                </button>

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    toast.success('Restaurant Branch: Downtown Flagship');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors text-left"
                >
                  <Store className="w-4 h-4 text-slate-400" />
                  <span>Restaurant Details</span>
                </button>

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors text-left"
                >
                  <Sliders className="w-4 h-4 text-slate-400" />
                  <span>System Preferences</span>
                </button>
              </div>

              {/* Sign Out Divider & Button */}
              <div className="mt-1 pt-1 border-t border-slate-100 p-1">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out Workstation</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
