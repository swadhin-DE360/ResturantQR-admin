import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { NAVIGATION_ITEMS } from '@/constants';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  const location = useLocation();

  // If items are not manually passed, derive them automatically from the current route path
  const breadcrumbItems: BreadcrumbItem[] = React.useMemo(() => {
    if (items && items.length > 0) return items;

    const currentPath = location.pathname;
    const matchedNavItem = NAVIGATION_ITEMS.find((item) => item.href === currentPath);

    if (currentPath === '/dashboard') {
      return [{ label: 'Dashboard' }];
    }

    if (matchedNavItem) {
      return [
        { label: 'Dashboard', href: '/dashboard' },
        { label: matchedNavItem.name },
      ];
    }

    // Default fallback parsing
    const segments = currentPath.split('/').filter(Boolean);
    return [
      { label: 'Dashboard', href: '/dashboard' },
      ...segments.map((seg, idx) => ({
        label: seg.charAt(0).toUpperCase() + seg.slice(1).replace('-', ' '),
        href: idx < segments.length - 1 ? `/${segments.slice(0, idx + 1).join('/')}` : undefined,
      })),
    ];
  }, [items, location.pathname]);

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-xs text-slate-500 ${className}`}>
      <ol className="flex items-center gap-1.5 list-none p-0 m-0">
        <li>
          <Link
            to="/dashboard"
            className="flex items-center gap-1 hover:text-[#F47738] transition-colors text-slate-500 font-medium"
            title="Go to Dashboard"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <React.Fragment key={`${item.label}-${index}`}>
              <li className="text-slate-300 select-none">
                <ChevronRight className="w-3 h-3" />
              </li>
              <li className="flex items-center">
                {isLast || !item.href ? (
                  <span className="font-semibold text-slate-800" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.href}
                    className="hover:text-[#F47738] transition-colors font-medium text-slate-500"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
