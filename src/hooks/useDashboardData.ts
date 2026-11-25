import { useState } from 'react';
import dashboardStaticJson from '@/data/dashboard.json';
import { DashboardDataSchema, OrderStatus } from '@/types';

export function useDashboardData() {
  const [data] = useState<DashboardDataSchema>(dashboardStaticJson as DashboardDataSchema);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredRecentOrders = data.recentOrders.filter((order) => {
    if (statusFilter === 'ALL') return true;
    return order.status === statusFilter;
  });

  return {
    summaryCards: data.summaryCards,
    orderOverviewWeekly: data.orderOverviewWeekly,
    orderStatusDistribution: data.orderStatusDistribution,
    recentOrders: filteredRecentOrders,
    allRecentOrders: data.recentOrders,
    popularFoodItems: data.popularFoodItems,
    recentActivity: data.recentActivity,
    statusFilter,
    setStatusFilter: (status: OrderStatus | 'ALL') => setStatusFilter(status),
  };
}
