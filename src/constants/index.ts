import { OrderStatus } from '@/types';

export const APP_CONFIG = {
  name: 'ChefDesk Admin',
  subtitle: 'Restaurant Operations & Management',
  restaurantName: 'The Grand Bistro',
  currencySymbol: '$',
  supportEmail: 'ops@chefdesk.com',
  version: '1.0.0',
};

export type NavIconName =
  | 'LayoutDashboard'
  | 'ShoppingBag'
  | 'Layers'
  | 'UtensilsCrossed'
  | 'QrCode'
  | 'History'
  | 'BarChart3'
  | 'Settings'
  | 'LogOut';

export interface NavigationItem {
  name: string;
  href: string;
  iconName: NavIconName;
  badge?: string;
  badgeColor?: string;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    iconName: 'LayoutDashboard',
  },
  {
    name: 'Orders',
    href: '/orders',
    iconName: 'ShoppingBag',
    badge: '12 Live',
    badgeColor: 'bg-[#F47738] text-white',
  },
  {
    name: 'Food Categories',
    href: '/categories',
    iconName: 'Layers',
  },
  {
    name: 'Food Items',
    href: '/menu',
    iconName: 'UtensilsCrossed',
  },
  {
    name: 'Tables & QR Codes',
    href: '/tables',
    iconName: 'QrCode',
  },
  {
    name: 'Order History',
    href: '/history',
    iconName: 'History',
  },
  {
    name: 'Reports',
    href: '/reports',
    iconName: 'BarChart3',
  },
  {
    name: 'Settings',
    href: '/settings',
    iconName: 'Settings',
  },
];

export const ORDER_STATUS_MAP: Record<OrderStatus, { label: string; variant: 'default' | 'warning' | 'info' | 'success' | 'danger' | 'purple' }> = {
  Pending: { label: 'Pending', variant: 'warning' },
  Accepted: { label: 'Accepted', variant: 'info' },
  Preparing: { label: 'Preparing', variant: 'warning' },
  Ready: { label: 'Ready for Service', variant: 'purple' },
  Completed: { label: 'Completed', variant: 'success' },
  Rejected: { label: 'Rejected', variant: 'danger' },
};
