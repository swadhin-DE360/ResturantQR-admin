import React, { useState } from 'react';
import {
  ShoppingBag,
  Clock,
  ChefHat,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Download,
  Filter,
  ArrowUpRight,
  Sparkles,
  Utensils,
  Bell,
  RefreshCw,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import toast from 'react-hot-toast';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, getStatusBadgeVariant } from '@/utils';
import { OrderStatus } from '@/types';

export const DashboardPage: React.FC = () => {
  const {
    summaryCards,
    orderOverviewWeekly,
    orderStatusDistribution,
    recentOrders,
    popularFoodItems,
    recentActivity,
    statusFilter,
    setStatusFilter,
  } = useDashboardData();

  const [chartMetric, setChartMetric] = useState<'orders' | 'revenue'>('orders');

  const handleExportSummary = () => {
    toast.success('Shift summary report generated (CSV download simulated)', {
      icon: '📊',
    });
  };

  const handleLiveSync = () => {
    toast.success('Kitchen display data synchronized with static storage', {
      icon: '🔄',
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'New order':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'Order accepted':
        return <Utensils className="w-4 h-4 text-blue-500" />;
      case 'Order ready':
        return <Bell className="w-4 h-4 text-purple-500" />;
      case 'Order completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getActivityBg = (type: string) => {
    switch (type) {
      case 'New order':
        return 'bg-amber-50 border-amber-200';
      case 'Order accepted':
        return 'bg-blue-50 border-blue-200';
      case 'Order ready':
        return 'bg-purple-50 border-purple-200';
      case 'Order completed':
        return 'bg-emerald-50 border-emerald-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          TOP BANNER: Operational Briefing & Quick Actions
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[11px] font-semibold text-[#F47738] mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Shift Active • Dinner Service 12:00 - 23:00</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Restaurant Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Live orders, kitchen station queues, revenue velocity, and floor turnover.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLiveSync}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Sync Orders
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleExportSummary}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export Shift Report
          </Button>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: SUMMARY CARDS (5 Cards)
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Card 1: Total Orders Today */}
        <Card className="hover:border-slate-300 transition-all hover:shadow-md">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {summaryCards.totalOrdersToday.title}
              </span>
              <div className="p-2 rounded-xl bg-orange-50 text-[#F47738]">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {summaryCards.totalOrdersToday.value}
              </h3>
              <div className="mt-1 flex items-center text-xs">
                <span className="inline-flex items-center font-semibold text-emerald-600 mr-1.5">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  +{summaryCards.totalOrdersToday.change}%
                </span>
                <span className="text-slate-400 text-[11px]">{summaryCards.totalOrdersToday.period}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Card 2: Pending Orders */}
        <Card className="hover:border-amber-300 transition-all hover:shadow-md border-amber-200/60 bg-gradient-to-br from-white to-amber-50/20">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {summaryCards.pendingOrders.title}
              </span>
              <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {summaryCards.pendingOrders.value}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Needs Action
                </span>
              </div>
              <p className="text-[11px] text-amber-700/80 font-medium mt-1">
                {summaryCards.pendingOrders.subtitle}
              </p>
            </div>
          </div>
        </Card>

        {/* Card 3: Preparing Orders */}
        <Card className="hover:border-slate-300 transition-all hover:shadow-md">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {summaryCards.preparingOrders.title}
              </span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <ChefHat className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {summaryCards.preparingOrders.value}
              </h3>
              <div className="mt-1 flex items-center text-xs">
                <span className="inline-flex items-center font-semibold text-blue-600 mr-1.5">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  +{summaryCards.preparingOrders.change}%
                </span>
                <span className="text-slate-400 text-[11px]">{summaryCards.preparingOrders.period}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Card 4: Completed Orders */}
        <Card className="hover:border-slate-300 transition-all hover:shadow-md">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {summaryCards.completedOrders.title}
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {summaryCards.completedOrders.value}
              </h3>
              <div className="mt-1 flex items-center text-xs">
                <span className="inline-flex items-center font-semibold text-emerald-600 mr-1.5">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  +{summaryCards.completedOrders.change}%
                </span>
                <span className="text-slate-400 text-[11px]">{summaryCards.completedOrders.period}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Card 5: Total Order Value */}
        <Card className="hover:border-slate-300 transition-all hover:shadow-md">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {summaryCards.totalOrderValue.title}
              </span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {summaryCards.totalOrderValue.value}
              </h3>
              <div className="mt-1 flex items-center text-xs">
                <span className="inline-flex items-center font-semibold text-emerald-600 mr-1.5">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  +{summaryCards.totalOrderValue.change}%
                </span>
                <span className="text-slate-400 text-[11px]">{summaryCards.totalOrderValue.period}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* =========================================================================
          SECTION 2 & 3: ORDER OVERVIEW CHART & ORDER STATUS DISTRIBUTION
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section 2: Order Overview (Weekly Trend Chart with Recharts) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle>Weekly Order Overview</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Volume of restaurant orders processed daily over the current week
              </p>
            </div>

            {/* Metric Switcher Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setChartMetric('orders')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  chartMetric === 'orders'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Orders Volume
              </button>
              <button
                type="button"
                onClick={() => setChartMetric('revenue')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  chartMetric === 'revenue'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Revenue ($)
              </button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={orderOverviewWeekly}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="orderTrendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F47738" stopOpacity={0.32} />
                      <stop offset="95%" stopColor="#F47738" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="day"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => (chartMetric === 'revenue' ? `$${val / 1000}k` : `${val}`)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 8px 16px -4px rgb(0 0 0 / 0.1)',
                      fontSize: '12px',
                    }}
                    formatter={(val: number) => [
                      chartMetric === 'revenue' ? `$${val.toLocaleString()}` : `${val} orders`,
                      chartMetric === 'revenue' ? 'Daily Revenue' : 'Total Orders',
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey={chartMetric === 'revenue' ? 'revenue' : 'orders'}
                    stroke="#F47738"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#orderTrendGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5 font-medium text-slate-700">
                <TrendingUp className="w-4 h-4 text-[#F47738]" />
                <span>Peak Traffic: Saturday with 210 completed orders</span>
              </div>
              <span className="text-[11px] text-slate-400">Weekly Total: 1,023 orders ($34.02k)</span>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Order Status Distribution (Donut Chart & Breakdown) */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Order Status Distribution</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Live status breakdown for active service</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Donut Chart Visual */}
            <div className="h-44 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                    }}
                    formatter={(val: number, name: string) => [`${val} orders`, name]}
                  />
                  <Pie
                    data={orderStatusDistribution}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={72}
                    paddingAngle={3}
                  >
                    {orderStatusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-slate-900 leading-none">172</span>
                <span className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">Tickets</span>
              </div>
            </div>

            {/* List breakdown of all 6 exact statuses */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              {orderStatusDistribution.map((statusItem) => (
                <div
                  key={statusItem.status}
                  className="p-2 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: statusItem.color }}
                    />
                    <span className="text-xs font-semibold text-slate-700 truncate">
                      {statusItem.status}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 shrink-0">
                    {statusItem.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* =========================================================================
          SECTION 4: RECENT ORDERS TABLE
         ========================================================================= */}
      <Card>
        <CardHeader className="flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#F47738]" />
              <CardTitle>Recent Orders</CardTitle>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live orders feed across dine-in tables and takeaway pickups
            </p>
          </div>

          {/* Status Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400 mr-1 hidden md:inline-flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {(['ALL', 'Pending', 'Accepted', 'Preparing', 'Ready', 'Completed', 'Rejected'] as const).map(
              (filterKey) => (
                <button
                  key={filterKey}
                  type="button"
                  onClick={() => setStatusFilter(filterKey)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                    statusFilter === filterKey
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filterKey}
                </button>
              )
            )}
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th scope="col" className="py-3 px-4">Order Number</th>
                <th scope="col" className="py-3 px-4">Table / Destination</th>
                <th scope="col" className="py-3 px-4">Items</th>
                <th scope="col" className="py-3 px-4">Order Amount</th>
                <th scope="col" className="py-3 px-4">Status</th>
                <th scope="col" className="py-3 px-4">Order Time</th>
                <th scope="col" className="py-3 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <tr key={order.orderNumber} className="hover:bg-slate-50/80 transition-colors">
                  {/* Order Number */}
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <span className="text-[#F47738]">{order.orderNumber}</span>
                  </td>

                  {/* Table Number */}
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {order.tableNumber}
                    </div>
                  </td>

                  {/* Number of Items & Summary */}
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-900">{order.itemCount} items</span>
                    <p className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">
                      {order.itemsSummary}
                    </p>
                  </td>

                  {/* Order Amount */}
                  <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                    {formatCurrency(order.amount)}
                  </td>

                  {/* Order Status */}
                  <td className="py-3.5 px-4">
                    <Badge variant={getStatusBadgeVariant(order.status as OrderStatus)}>
                      {order.status}
                    </Badge>
                  </td>

                  {/* Order Time */}
                  <td className="py-3.5 px-4 text-slate-600">
                    <div className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{order.orderTime}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      {order.elapsedMinutes} mins ago
                    </span>
                  </td>

                  {/* Quick Action */}
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast.success(`Viewing ticket details for ${order.orderNumber}`)}
                      className="text-xs text-[#F47738] hover:text-[#e05e1f] font-semibold"
                    >
                      View Ticket
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* =========================================================================
          SECTIONS 5 & 6: POPULAR FOOD ITEMS & RECENT ACTIVITY FEED
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 5: Popular Food Items */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#F47738]" />
              <CardTitle>Popular Food Items</CardTitle>
            </div>
            <span className="text-[11px] font-semibold text-slate-500">Based on Today's Kitchen Tickets</span>
          </CardHeader>

          <CardContent className="divide-y divide-slate-100">
            {popularFoodItems.map((dish, index) => (
              <div
                key={dish.id}
                className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Ranking index */}
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>

                  {/* Food Image */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>

                  {/* Name and Category */}
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{dish.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{dish.category}</p>
                    <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-0.5 mt-0.5">
                      ★ {dish.rating} rating
                    </span>
                  </div>
                </div>

                {/* Orders Count and Price */}
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-slate-900">{formatCurrency(dish.price)}</p>
                  <p className="text-[11px] font-semibold text-[#F47738] mt-0.5">
                    {dish.ordersCount} orders
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Section 6: Recent Activity Feed */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#F47738]" />
              <CardTitle>Recent Activity</CardTitle>
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Live Stream
            </span>
          </CardHeader>

          <CardContent className="space-y-4">
            {recentActivity.map((activity, idx) => (
              <div key={activity.id} className="relative flex items-start gap-3.5 group">
                {/* Connecting timeline vertical line */}
                {idx < recentActivity.length - 1 && (
                  <span
                    className="absolute left-4 top-8 -bottom-4 w-px bg-slate-200"
                    aria-hidden="true"
                  />
                )}

                {/* Activity Icon */}
                <div
                  className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 z-10 transition-transform group-hover:scale-110 ${getActivityBg(
                    activity.type
                  )}`}
                >
                  {getActivityIcon(activity.type)}
                </div>

                {/* Activity Text and Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="text-xs font-bold text-slate-900 truncate">
                      {activity.title}
                    </h5>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                      {activity.timeAgo}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-0.5">{activity.description}</p>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-[#F47738] bg-orange-50 px-1.5 py-0.5 rounded">
                      {activity.orderNumber}
                    </span>
                    <span className="text-[10px] text-slate-400">•</span>
                    <span className="text-[10px] font-medium text-slate-500">
                      {activity.table}
                    </span>
                    <span className="text-[10px] text-slate-400">•</span>
                    <span className="text-[10px] text-slate-400">{activity.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
