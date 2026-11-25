import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  ChefHat,
  Bell,
  Eye,
  Filter,
  Sparkles,
  Utensils,
} from 'lucide-react';
import toast from 'react-hot-toast';
import initialOrdersData from '@/data/orders.json';
import { LiveOrder, OrderStatus } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import { OrderDetailDrawer } from '@/components/orders/OrderDetailDrawer';
import { formatCurrency, getStatusBadgeVariant } from '@/utils';

export const OrdersPage: React.FC = () => {
  // In-memory orders state initialized from static orders.json
  const [orders, setOrders] = useState<LiveOrder[]>(initialOrdersData as LiveOrder[]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState<OrderStatus | 'ALL'>('ALL');
  const [selectedOrderForDrawer, setSelectedOrderForDrawer] = useState<LiveOrder | null>(null);

  // Update order status in frontend state
  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );

    // Keep drawer in sync if open
    if (selectedOrderForDrawer && selectedOrderForDrawer.id === orderId) {
      setSelectedOrderForDrawer((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    if (newStatus === 'Accepted') {
      toast.success(`Order accepted! Ticket sent to kitchen.`, { icon: '🧑‍🍳' });
    } else if (newStatus === 'Rejected') {
      toast.error(`Order rejected and cancelled.`, { icon: '⛔' });
    } else {
      toast.success(`Order status updated to ${newStatus}`);
    }
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const matchesSearch =
        ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        selectedStatusTab === 'ALL' || ord.status === selectedStatusTab;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, selectedStatusTab]);

  // Status counts
  const pendingCount = orders.filter((o) => o.status === 'Pending').length;
  const acceptedCount = orders.filter((o) => o.status === 'Accepted').length;
  const preparingCount = orders.filter((o) => o.status === 'Preparing').length;
  const readyCount = orders.filter((o) => o.status === 'Ready').length;
  const completedCount = orders.filter((o) => o.status === 'Completed').length;
  const rejectedCount = orders.filter((o) => o.status === 'Rejected').length;

  return (
    <div className="space-y-6">
      {/* =========================================================================
          HEADER & REAL-TIME KITCHEN STATUS
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[11px] font-semibold text-[#F47738] mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Kitchen Dispatch & Order Queue</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Order Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time dine-in and takeaway tickets. Accept incoming orders and track meal preparation.
          </p>
        </div>

        {/* Pending Alerts Banner */}
        {pendingCount > 0 && (
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold animate-pulse">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>{pendingCount} Incoming orders awaiting acceptance</span>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card
          className={`p-3.5 cursor-pointer transition-all hover:shadow-sm ${
            selectedStatusTab === 'Pending' ? 'border-amber-400 ring-2 ring-amber-400/20' : ''
          }`}
          onClick={() => setSelectedStatusTab('Pending')}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
              Pending
            </span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-1">{pendingCount}</p>
          <span className="text-[10px] text-amber-700 font-medium">Needs Review</span>
        </Card>

        <Card
          className={`p-3.5 cursor-pointer transition-all hover:shadow-sm ${
            selectedStatusTab === 'Accepted' ? 'border-blue-400 ring-2 ring-blue-400/20' : ''
          }`}
          onClick={() => setSelectedStatusTab('Accepted')}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">
              Accepted
            </span>
            <Utensils className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-1">{acceptedCount}</p>
          <span className="text-[10px] text-blue-600 font-medium">Queued for Prep</span>
        </Card>

        <Card
          className={`p-3.5 cursor-pointer transition-all hover:shadow-sm ${
            selectedStatusTab === 'Preparing' ? 'border-orange-400 ring-2 ring-orange-400/20' : ''
          }`}
          onClick={() => setSelectedStatusTab('Preparing')}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#F47738] uppercase tracking-wider">
              Preparing
            </span>
            <ChefHat className="w-3.5 h-3.5 text-[#F47738]" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-1">{preparingCount}</p>
          <span className="text-[10px] text-[#F47738] font-medium">Cooking in Kitchen</span>
        </Card>

        <Card
          className={`p-3.5 cursor-pointer transition-all hover:shadow-sm ${
            selectedStatusTab === 'Ready' ? 'border-purple-400 ring-2 ring-purple-400/20' : ''
          }`}
          onClick={() => setSelectedStatusTab('Ready')}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider">
              Ready
            </span>
            <Bell className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-1">{readyCount}</p>
          <span className="text-[10px] text-purple-600 font-medium">Ready for Service</span>
        </Card>

        <Card
          className={`p-3.5 cursor-pointer transition-all hover:shadow-sm ${
            selectedStatusTab === 'Completed' ? 'border-emerald-400 ring-2 ring-emerald-400/20' : ''
          }`}
          onClick={() => setSelectedStatusTab('Completed')}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
              Completed
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-1">{completedCount}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Served & Paid</span>
        </Card>

        <Card
          className={`p-3.5 cursor-pointer transition-all hover:shadow-sm ${
            selectedStatusTab === 'Rejected' ? 'border-rose-400 ring-2 ring-rose-400/20' : ''
          }`}
          onClick={() => setSelectedStatusTab('Rejected')}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">
              Rejected
            </span>
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-1">{rejectedCount}</p>
          <span className="text-[10px] text-rose-600 font-medium">Cancelled Tickets</span>
        </Card>
      </div>

      {/* =========================================================================
          CONTROLS: Search by Order Number & Status Tabs
         ========================================================================= */}
      <Card className="p-4 bg-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by order number (e.g. 8945) or table..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F47738]/20 focus:border-[#F47738] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400 mr-1 hidden lg:inline-flex items-center gap-1">
              <Filter className="w-3 h-3" /> Status:
            </span>
            {(
              ['ALL', 'Pending', 'Accepted', 'Preparing', 'Ready', 'Completed', 'Rejected'] as const
            ).map((tab) => {
              const count =
                tab === 'ALL'
                  ? orders.length
                  : orders.filter((o) => o.status === tab).length;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedStatusTab(tab)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
                    selectedStatusTab === tab
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{tab}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      selectedStatusTab === tab
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* =========================================================================
          ORDER TICKETS LISTING TABLE
         ========================================================================= */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          title="No live orders found"
          description={
            searchQuery || selectedStatusTab !== 'ALL'
              ? 'No orders match your active search or status filter. Try clearing filters.'
              : 'There are currently no active orders in the queue.'
          }
          icon={<ShoppingBag className="w-8 h-8 text-[#F47738]" />}
          actionText="Clear All Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedStatusTab('ALL');
          }}
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th scope="col" className="py-3 px-4">Order Number</th>
                  <th scope="col" className="py-3 px-4">Dining Table</th>
                  <th scope="col" className="py-3 px-4">Ordered Food Items</th>
                  <th scope="col" className="py-3 px-4">Subtotal</th>
                  <th scope="col" className="py-3 px-4">Status</th>
                  <th scope="col" className="py-3 px-4">Order Time</th>
                  <th scope="col" className="py-3 px-4 text-right">Kitchen Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => setSelectedOrderForDrawer(order)}
                  >
                    {/* Order Number */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm tracking-tight text-[#F47738]">
                          {order.orderNumber}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {order.id}</span>
                    </td>

                    {/* Table Number */}
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800">
                        <MapPin className="w-3 h-3 text-[#F47738]" />
                        <span>{order.tableNumber}</span>
                      </div>
                    </td>

                    {/* Food Items Preview */}
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-semibold text-slate-900 text-xs">
                        {order.totalItems} items:
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </p>
                    </td>

                    {/* Subtotal */}
                    <td className="py-3.5 px-4">
                      <span className="text-sm font-extrabold text-slate-900">
                        {formatCurrency(order.subtotal)}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </td>

                    {/* Order Time */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{order.createdAt}</span>
                      </div>
                    </td>

                    {/* Quick Kitchen Action (stops event propagation so click doesn't just open drawer) */}
                    <td
                      className="py-3.5 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        {/* Pending Status -> Accept / Reject buttons */}
                        {order.status === 'Pending' && (
                          <>
                            <Button
                              variant="danger"
                              size="sm"
                              className="text-xs py-1 px-2.5"
                              onClick={() => handleUpdateStatus(order.id, 'Rejected')}
                              leftIcon={<XCircle className="w-3.5 h-3.5" />}
                            >
                              Reject
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              className="text-xs py-1 px-2.5"
                              onClick={() => handleUpdateStatus(order.id, 'Accepted')}
                              leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                            >
                              Accept
                            </Button>
                          </>
                        )}

                        {order.status === 'Accepted' && (
                          <Button
                            variant="primary"
                            size="sm"
                            className="text-xs py-1 px-2.5"
                            onClick={() => handleUpdateStatus(order.id, 'Preparing')}
                            leftIcon={<ChefHat className="w-3.5 h-3.5" />}
                          >
                            Cook
                          </Button>
                        )}

                        {order.status === 'Preparing' && (
                          <Button
                            variant="primary"
                            size="sm"
                            className="text-xs py-1 px-2.5"
                            onClick={() => handleUpdateStatus(order.id, 'Ready')}
                            leftIcon={<Bell className="w-3.5 h-3.5" />}
                          >
                            Ready
                          </Button>
                        )}

                        {order.status === 'Ready' && (
                          <Button
                            variant="primary"
                            size="sm"
                            className="text-xs py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => handleUpdateStatus(order.id, 'Completed')}
                            leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                          >
                            Complete
                          </Button>
                        )}

                        {/* View Drawer Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOrderForDrawer(order)}
                          className="text-xs text-slate-500 hover:text-slate-900"
                          title="Open Order Details Drawer"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          Details
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* =========================================================================
          ORDER DETAIL DRAWER (SLIDE-OVER PANEL)
         ========================================================================= */}
      <OrderDetailDrawer
        order={selectedOrderForDrawer}
        isOpen={!!selectedOrderForDrawer}
        onClose={() => setSelectedOrderForDrawer(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default OrdersPage;
