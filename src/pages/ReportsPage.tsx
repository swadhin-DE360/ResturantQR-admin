import React, { useState, useMemo } from 'react';
import {
  Calendar,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Sparkles,
  Download,
  Filter,
  PieChart as PieChartIcon,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
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
import staticReportsData from '@/data/reports.json';
import { ReportsDataSchema, OrderStatus } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/utils';

export const ReportsPage: React.FC = () => {
  const reportsData = staticReportsData as ReportsDataSchema;

  // React State: Date Range & Status Filtering
  const [dateRange, setDateRange] = useState<'7_DAYS' | 'TODAY' | 'YESTERDAY'>('7_DAYS');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const [trendMetric, setTrendMetric] = useState<'orders' | 'revenue'>('orders');

  // Filtered status distribution based on selected status filter
  const filteredStatusDistribution = useMemo(() => {
    if (selectedStatus === 'ALL') {
      return reportsData.statusDistribution;
    }
    return reportsData.statusDistribution.filter((item) => item.status === selectedStatus);
  }, [reportsData.statusDistribution, selectedStatus]);

  // Filtered daily breakdown based on date range selection
  const filteredDailyBreakdown = useMemo(() => {
    if (dateRange === 'TODAY') {
      return reportsData.dailyBreakdown.filter((item) => item.date === '2026-02-17');
    }
    if (dateRange === 'YESTERDAY') {
      return reportsData.dailyBreakdown.filter((item) => item.date === '2026-02-16');
    }
    return reportsData.dailyBreakdown;
  }, [reportsData.dailyBreakdown, dateRange]);

  // Filtered weekly trend
  const filteredTrend = useMemo(() => {
    if (dateRange === 'TODAY') {
      return reportsData.weeklyTrend.filter((item) => item.date === '2026-02-17');
    }
    if (dateRange === 'YESTERDAY') {
      return reportsData.weeklyTrend.filter((item) => item.date === '2026-02-16');
    }
    return reportsData.weeklyTrend;
  }, [reportsData.weeklyTrend, dateRange]);

  const handleExportReport = () => {
    toast.success('Basic analytics report exported to CSV', { icon: '📊' });
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          HEADER & DATE RANGE SELECTION
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[11px] font-semibold text-[#F47738] mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Executive Operational Reporting</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Basic Reports</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Key operational metrics, daily ticket counts, order values, and fulfillment trends.
          </p>
        </div>

        {/* Date Range Selection & Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setDateRange('TODAY')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                dateRange === 'TODAY'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setDateRange('YESTERDAY')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                dateRange === 'YESTERDAY'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Yesterday
            </button>
            <button
              type="button"
              onClick={() => setDateRange('7_DAYS')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                dateRange === '7_DAYS'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Past 7 Days
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportReport}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* =========================================================================
          METRICS SECTION: Daily Order Counts & Key Statuses
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Daily Order Count */}
        <Card className="p-4 bg-white hover:border-slate-300 transition-all hover:shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Daily Order Count
            </span>
            <div className="p-2 rounded-xl bg-orange-50 text-[#F47738]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {reportsData.summary.dailyOrderCount}
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Total tickets today</span>
          </div>
        </Card>

        {/* Accepted Orders */}
        <Card className="p-4 bg-white hover:border-slate-300 transition-all hover:shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Accepted Orders
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {reportsData.summary.acceptedOrders}
            </h3>
            <span className="text-[11px] text-blue-600 font-medium">Confirmed into prep queue</span>
          </div>
        </Card>

        {/* Completed Orders */}
        <Card className="p-4 bg-white hover:border-slate-300 transition-all hover:shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Completed Orders
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {reportsData.summary.completedOrders}
            </h3>
            <span className="text-[11px] text-emerald-600 font-medium">85.1% fulfillment completion</span>
          </div>
        </Card>

        {/* Rejected Orders */}
        <Card className="p-4 bg-white hover:border-slate-300 transition-all hover:shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Rejected Orders
            </span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {reportsData.summary.rejectedOrders}
            </h3>
            <span className="text-[11px] text-rose-600 font-medium">2.0% decline rate</span>
          </div>
        </Card>
      </div>

      {/* =========================================================================
          ORDER VALUE SUMMARIES (FINANCIAL BREAKDOWN)
         ========================================================================= */}
      <Card className="p-5 bg-white border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#F47738]" />
              Order Value Summaries
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Financial performance, bill settling totals, and averages
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
            Currency: USD ($)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-4">
          {/* Gross Sales */}
          <div className="p-3 bg-orange-50/50 rounded-xl border border-orange-100">
            <span className="text-[11px] font-bold text-slate-500 block">Total Gross Sales</span>
            <p className="text-xl font-black text-slate-900 mt-1">
              {formatCurrency(reportsData.summary.orderValueSummaries.totalGrossSales)}
            </p>
            <span className="text-[10px] text-[#F47738] font-medium">+18.2% vs prev week</span>
          </div>

          {/* Net Settled */}
          <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
            <span className="text-[11px] font-bold text-slate-500 block">Net Settled Sales</span>
            <p className="text-xl font-black text-slate-900 mt-1">
              {formatCurrency(reportsData.summary.orderValueSummaries.netSettledSales)}
            </p>
            <span className="text-[10px] text-emerald-600 font-medium">After discounts</span>
          </div>

          {/* Average Order Value */}
          <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
            <span className="text-[11px] font-bold text-slate-500 block">Average Order Value</span>
            <p className="text-xl font-black text-slate-900 mt-1">
              {formatCurrency(reportsData.summary.orderValueSummaries.averageOrderValue)}
            </p>
            <span className="text-[10px] text-blue-600 font-medium">Per dining party</span>
          </div>

          {/* Tax Collected */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 block">Tax Collected</span>
            <p className="text-xl font-black text-slate-900 mt-1">
              {formatCurrency(reportsData.summary.orderValueSummaries.taxCollected)}
            </p>
            <span className="text-[10px] text-slate-400 font-medium">State & municipal</span>
          </div>

          {/* Discounts */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 block">Discounts Total</span>
            <p className="text-xl font-black text-slate-900 mt-1">
              {formatCurrency(reportsData.summary.orderValueSummaries.discountsTotal)}
            </p>
            <span className="text-[10px] text-slate-400 font-medium">Promotions & comps</span>
          </div>
        </div>
      </Card>

      {/* =========================================================================
          RECHARTS SECTION: WEEKLY ORDER TREND & ORDER STATUS DISTRIBUTION
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Order Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#F47738]" />
                Weekly Order Trend
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Daily volume and throughput across the observation window
              </p>
            </div>

            {/* Metric Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setTrendMetric('orders')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  trendMetric === 'orders'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Orders Count
              </button>
              <button
                type="button"
                onClick={() => setTrendMetric('revenue')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  trendMetric === 'revenue'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Order Value ($)
              </button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {trendMetric === 'orders' ? (
                  <BarChart data={filteredTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        fontSize: '12px',
                      }}
                      formatter={(val: number, name: string) => [
                        `${val} orders`,
                        name === 'totalOrders' ? 'Total Tickets' : 'Completed',
                      ]}
                    />
                    <Bar dataKey="totalOrders" fill="#F47738" radius={[4, 4, 0, 0]} name="totalOrders" />
                    <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="completed" />
                  </BarChart>
                ) : (
                  <AreaChart data={filteredTrend} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="reportsValueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F47738" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#F47738" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `$${v / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        fontSize: '12px',
                      }}
                      formatter={(val: number) => [`$${val.toLocaleString()}`, 'Daily Value']}
                    />
                    <Area
                      type="monotone"
                      dataKey="orderValue"
                      stroke="#F47738"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#reportsValueGradient)"
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-[#F47738]" />
                Peak day: Saturday (210 orders &bull; $7,120.00)
              </span>
              <span>Showing {filteredTrend.length} day points</span>
            </div>
          </CardContent>
        </Card>

        {/* Order Status Distribution with Status Filter */}
        <Card>
          <CardHeader className="flex-col gap-2">
            <div className="flex items-center justify-between w-full">
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-[#F47738]" />
                Status Distribution
              </CardTitle>
            </div>

            {/* Status Filter Dropdown / Select */}
            <div className="flex items-center gap-2 w-full pt-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as OrderStatus | 'ALL')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F47738]/20 focus:border-[#F47738]"
              >
                <option value="ALL">All Statuses (Full Mix)</option>
                <option value="Completed">Completed Only</option>
                <option value="Accepted">Accepted Only</option>
                <option value="Preparing">Preparing Only</option>
                <option value="Pending">Pending Only</option>
                <option value="Rejected">Rejected Only</option>
              </select>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
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
                    data={filteredStatusDistribution}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                  >
                    {filteredStatusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-black text-slate-900 leading-none">
                  {filteredStatusDistribution.reduce((acc, curr) => acc + curr.count, 0)}
                </span>
                <span className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">Tickets</span>
              </div>
            </div>

            {/* Distribution Legend List */}
            <div className="space-y-1.5 pt-1 border-t border-slate-100 max-h-44 overflow-y-auto">
              {filteredStatusDistribution.map((item) => (
                <div
                  key={item.status}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-semibold text-slate-700">{item.status}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">{item.count}</span>
                    <span className="text-[10px] text-slate-400 ml-1.5">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* =========================================================================
          DAILY BREAKDOWN LEDGER TABLE
         ========================================================================= */}
      <Card>
        <CardHeader className="flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#F47738]" />
              Daily Operational Ledger
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown of daily volume, acceptance, rejection, and gross sales
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredDailyBreakdown.length} day records
          </span>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th scope="col" className="py-3 px-4">Date</th>
                <th scope="col" className="py-3 px-4">Day</th>
                <th scope="col" className="py-3 px-4">Total Orders</th>
                <th scope="col" className="py-3 px-4">Accepted</th>
                <th scope="col" className="py-3 px-4">Rejected</th>
                <th scope="col" className="py-3 px-4">Completed</th>
                <th scope="col" className="py-3 px-4">Gross Sales</th>
                <th scope="col" className="py-3 px-4">Avg Ticket</th>
                <th scope="col" className="py-3 px-4 text-right">Top Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDailyBreakdown.map((row) => (
                <tr key={row.date} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{row.date}</td>
                  <td className="py-3 px-4 font-medium text-slate-700">{row.day}</td>
                  <td className="py-3 px-4 font-extrabold text-[#F47738]">{row.orders}</td>
                  <td className="py-3 px-4 text-blue-600 font-semibold">{row.accepted}</td>
                  <td className="py-3 px-4 text-rose-600 font-semibold">{row.rejected}</td>
                  <td className="py-3 px-4 text-emerald-600 font-semibold">{row.completed}</td>
                  <td className="py-3 px-4 font-black text-slate-900">
                    {formatCurrency(row.grossSales)}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {formatCurrency(row.avgTicket)}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-slate-700">
                    <span className="inline-block px-2 py-0.5 rounded bg-orange-50 text-[#F47738] text-[11px] font-semibold">
                      {row.topSellingCategory}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage;
