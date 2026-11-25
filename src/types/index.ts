export type OrderStatus =
  | 'Pending'
  | 'Accepted'
  | 'Preparing'
  | 'Ready'
  | 'Completed'
  | 'Rejected';

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface CategoryFormData {
  name: string;
  description: string;
  image: string;
  status: 'Active' | 'Inactive';
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  image: string;
  price: number;
  availability: 'Available' | 'Unavailable';
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface FoodItemFormData {
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  image: string;
  price: string;
  availability: 'Available' | 'Unavailable';
  status: 'Active' | 'Inactive';
}

export interface RestaurantTable {
  id: string;
  tableNumber: string;
  tableName: string;
  qrToken: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface TableFormData {
  tableNumber: string;
  tableName: string;
  status: 'Active' | 'Inactive';
}

export interface OrderItemDetail {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface LiveOrder {
  id: string;
  orderNumber: string;
  tableNumber: string;
  items: OrderItemDetail[];
  totalItems: number;
  subtotal: number;
  status: OrderStatus;
  createdAt: string;
}

export type HistoricalOrderStatus = 'Completed' | 'Cancelled' | 'Refunded';

export interface HistoricalOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface HistoricalOrder {
  id: string;
  orderNumber: string;
  tableNumber: string;
  dateTime: string;
  items: HistoricalOrderItem[];
  itemCount: number;
  subtotal: number;
  finalStatus: HistoricalOrderStatus;
  paymentMethod: string;
}

export interface OrderValueSummaries {
  totalGrossSales: number;
  netSettledSales: number;
  averageOrderValue: number;
  taxCollected: number;
  discountsTotal: number;
}

export interface ReportSummary {
  dailyOrderCount: number;
  acceptedOrders: number;
  rejectedOrders: number;
  completedOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  orderValueSummaries: OrderValueSummaries;
}

export interface WeeklyTrendPoint {
  date: string;
  day: string;
  totalOrders: number;
  accepted: number;
  rejected: number;
  completed: number;
  orderValue: number;
}

export interface DailyBreakdownItem {
  date: string;
  day: string;
  orders: number;
  accepted: number;
  rejected: number;
  completed: number;
  grossSales: number;
  avgTicket: number;
  topSellingCategory: string;
}

export interface ReportsDataSchema {
  summary: ReportSummary;
  weeklyTrend: WeeklyTrendPoint[];
  statusDistribution: OrderStatusDistributionItem[];
  dailyBreakdown: DailyBreakdownItem[];
}

export interface RestaurantProfileData {
  restaurantName: string;
  logo: string;
  contactNumber: string;
  email: string;
  address: string;
  currency?: string;
  taxRate?: number;
}

export interface AdminProfileData {
  name: string;
  email: string;
  role: string;
  profileImage: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SummaryCardItem {
  title: string;
  value: number | string;
  rawValue?: number;
  change: number;
  period: string;
  subtitle?: string;
}

export interface WeeklyOverviewPoint {
  day: string;
  orders: number;
  revenue: number;
  averageTicket: number;
}

export interface OrderStatusDistributionItem {
  status: OrderStatus | string;
  count: number;
  percentage: number;
  color: string;
}

export interface DashboardRecentOrder {
  orderNumber: string;
  tableNumber: string;
  itemCount: number;
  itemsSummary: string;
  amount: number;
  status: OrderStatus;
  orderTime: string;
  elapsedMinutes: number;
}

export interface PopularFoodItem {
  id: string;
  name: string;
  category: string;
  image: string;
  ordersCount: number;
  price: number;
  rating: number;
  revenue: number;
}

export interface RecentActivityItem {
  id: string;
  type: 'New order' | 'Order accepted' | 'Order ready' | 'Order completed';
  title: string;
  orderNumber: string;
  table: string;
  description: string;
  timestamp: string;
  timeAgo: string;
  status: 'warning' | 'info' | 'purple' | 'success';
}

export interface DashboardDataSchema {
  summaryCards: {
    totalOrdersToday: SummaryCardItem;
    pendingOrders: SummaryCardItem;
    preparingOrders: SummaryCardItem;
    completedOrders: SummaryCardItem;
    totalOrderValue: SummaryCardItem;
  };
  orderOverviewWeekly: WeeklyOverviewPoint[];
  orderStatusDistribution: OrderStatusDistributionItem[];
  recentOrders: DashboardRecentOrder[];
  popularFoodItems: PopularFoodItem[];
  recentActivity: RecentActivityItem[];
}
