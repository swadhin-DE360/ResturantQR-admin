import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Calendar,
  Eye,
  CheckCircle2,
  XCircle,
  Sparkles,
  DollarSign,
  MapPin,
  Clock,
  CreditCard,
  Printer,
  ChevronLeft,
  ChevronRight,
  Utensils,
  Copy,
} from 'lucide-react';
import toast from 'react-hot-toast';
import initialHistoryOrders from '@/data/order-history.json';
import { HistoricalOrder, HistoricalOrderStatus } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/common/EmptyState';
import { formatCurrency } from '@/utils';

export const OrderHistoryPage: React.FC = () => {
  // Static dataset loaded into state
  const [orders] = useState<HistoricalOrder[]>(initialHistoryOrders as HistoricalOrder[]);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<HistoricalOrderStatus | 'ALL'>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('ALL');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Selected Order for Modal
  const [selectedOrder, setSelectedOrder] = useState<HistoricalOrder | null>(null);

  // Status Badge Variant Helper
  const getStatusBadge = (status: HistoricalOrderStatus) => {
    switch (status) {
      case 'Completed':
        return <Badge variant="success">Completed</Badge>;
      case 'Cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
      case 'Refunded':
        return <Badge variant="purple">Refunded</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(query) ||
        order.tableNumber.toLowerCase().includes(query) ||
        order.paymentMethod.toLowerCase().includes(query) ||
        order.items.some((item) => item.name.toLowerCase().includes(query));

      const matchesStatus = statusFilter === 'ALL' || order.finalStatus === statusFilter;

      let matchesDate = true;
      if (dateFilter === 'TODAY') {
        matchesDate = order.dateTime.startsWith('2026-02-17');
      } else if (dateFilter === 'YESTERDAY') {
        matchesDate = order.dateTime.startsWith('2026-02-16');
      } else if (dateFilter === 'WEEK') {
        matchesDate = order.dateTime >= '2026-02-12';
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchQuery, statusFilter, dateFilter]);

  // Reset pagination to page 1 whenever filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, dateFilter, itemsPerPage]);

  // Pagination calculation
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  // Metrics
  const totalRevenue = orders
    .filter((o) => o.finalStatus === 'Completed')
    .reduce((acc, curr) => acc + curr.subtotal, 0);
  const totalCount = orders.length;
  const completedCount = orders.filter((o) => o.finalStatus === 'Completed').length;
  const cancelledCount = orders.filter((o) => o.finalStatus === 'Cancelled').length;
  const refundedCount = orders.filter((o) => o.finalStatus === 'Refunded').length;

  const handlePrintReceipt = (order: HistoricalOrder) => {
    toast.success(`Printing customer receipt for ${order.orderNumber}...`, { icon: '🖨️' });
  };

  const handleCopyOrderNumber = (orderNumber: string) => {
    navigator.clipboard.writeText(orderNumber);
    toast.success(`Copied ${orderNumber} to clipboard!`, { icon: '📋' });
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          HEADER & METRIC SUMMARY
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[11px] font-semibold text-[#F47738] mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Archived Shift & Sales History</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Order History</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit settled restaurant bills, refunded transactions, and past dining records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success('Historical records exported to CSV')}
            leftIcon={<Calendar className="w-3.5 h-3.5" />}
          >
            Export Archive
          </Button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Settled Revenue
            </span>
            <div className="p-2 rounded-xl bg-orange-50 text-[#F47738]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">
            {formatCurrency(totalRevenue)}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">Completed orders only</span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Past Orders
            </span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
              <History className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{totalCount}</p>
          <span className="text-[11px] text-slate-400">Total historical tickets</span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Completed Orders
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{completedCount}</p>
          <span className="text-[11px] text-emerald-600 font-medium">
            {((completedCount / totalCount) * 100).toFixed(1)}% fulfillment rate
          </span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Voided / Refunded
            </span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">
            {cancelledCount + refundedCount}
          </p>
          <span className="text-[11px] text-rose-600 font-medium">
            {cancelledCount} cancelled &bull; {refundedCount} refunded
          </span>
        </Card>
      </div>

      {/* =========================================================================
          CONTROLS: Search, Status Filter & Date Range Filter
         ========================================================================= */}
      <Card className="p-4 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by order #, table, dish or payment..."
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

          {/* Filter Group */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Date Filtering Dropdown */}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F47738]/20 focus:border-[#F47738]"
              >
                <option value="ALL">All Dates</option>
                <option value="TODAY">Today (Feb 17)</option>
                <option value="YESTERDAY">Yesterday (Feb 16)</option>
                <option value="WEEK">Last 7 Days</option>
              </select>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              {(['ALL', 'Completed', 'Cancelled', 'Refunded'] as const).map((status) => {
                const count =
                  status === 'ALL'
                    ? orders.length
                    : orders.filter((o) => o.finalStatus === status).length;

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                      statusFilter === status
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <span>{status}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        statusFilter === status
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Rows Per Page Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="hidden sm:inline">Rows:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F47738]/20 focus:border-[#F47738]"
              >
                <option value={5}>5 / page</option>
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* =========================================================================
          HISTORICAL ORDERS DATA TABLE
         ========================================================================= */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          title="No historical orders found"
          description={
            searchQuery || statusFilter !== 'ALL' || dateFilter !== 'ALL'
              ? 'No past transactions match your active query or date filter. Try resetting filters.'
              : 'There are no historical orders stored in the archive.'
          }
          icon={<History className="w-8 h-8 text-[#F47738]" />}
          actionText="Clear All Filters"
          onAction={() => {
            setSearchQuery('');
            setStatusFilter('ALL');
            setDateFilter('ALL');
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
                  <th scope="col" className="py-3 px-4">Date & Time</th>
                  <th scope="col" className="py-3 px-4">Item Count</th>
                  <th scope="col" className="py-3 px-4">Subtotal</th>
                  <th scope="col" className="py-3 px-4">Payment Method</th>
                  <th scope="col" className="py-3 px-4">Final Status</th>
                  <th scope="col" className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {/* Order Number */}
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <span className="text-[#F47738]">{order.orderNumber}</span>
                    </td>

                    {/* Table Number */}
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                        <MapPin className="w-3 h-3 text-[#F47738]" />
                        <span>{order.tableNumber}</span>
                      </div>
                    </td>

                    {/* Date and Time */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{order.dateTime}</span>
                      </div>
                    </td>

                    {/* Item Count & Summary */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900">{order.itemCount} items</span>
                      <p className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                        {order.items.map((i) => i.name).join(', ')}
                      </p>
                    </td>

                    {/* Subtotal */}
                    <td className="py-3.5 px-4">
                      <span className="text-sm font-extrabold text-slate-900">
                        {formatCurrency(order.subtotal)}
                      </span>
                    </td>

                    {/* Payment Method */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="inline-flex items-center gap-1.5 font-medium">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                        <span>{order.paymentMethod}</span>
                      </div>
                    </td>

                    {/* Final Status */}
                    <td className="py-3.5 px-4">
                      {getStatusBadge(order.finalStatus)}
                    </td>

                    {/* Actions */}
                    <td
                      className="py-3.5 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="text-xs text-slate-600 hover:text-slate-900 font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* =========================================================================
              PAGINATION FOOTER
             ========================================================================= */}
          <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-600">
            <div>
              Showing{' '}
              <span className="font-semibold text-slate-900">
                {totalItems === 0 ? 0 : startIndex + 1}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-slate-900">
                {Math.min(startIndex + itemsPerPage, totalItems)}
              </span>{' '}
              of <span className="font-semibold text-slate-900">{totalItems}</span> historical records
            </div>

            <div className="flex items-center gap-1.5 self-center sm:self-auto">
              {/* Previous Page */}
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                    currentPage === pageNum
                      ? 'bg-[#F47738] text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              {/* Next Page */}
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* =========================================================================
          ORDER DETAIL MODAL
         ========================================================================= */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order Receipt ${selectedOrder.orderNumber}`}
          description={`Archived settlement details for ${selectedOrder.tableNumber}`}
          maxWidth="lg"
          footer={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handlePrintReceipt(selectedOrder)}
                leftIcon={<Printer className="w-3.5 h-3.5" />}
              >
                Print Receipt
              </Button>
            </>
          }
        >
          <div className="space-y-5">
            {/* Header Details Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-slate-900">
                    {selectedOrder.orderNumber}
                  </span>
                  {getStatusBadge(selectedOrder.finalStatus)}
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Settled on {selectedOrder.dateTime}
                </p>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800">
                  <MapPin className="w-3 h-3 text-[#F47738]" />
                  <span>{selectedOrder.tableNumber}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Payment: <strong>{selectedOrder.paymentMethod}</strong>
                </p>
              </div>
            </div>

            {/* Food Items Breakdown */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-[#F47738]" />
                  Itemized Order Breakdown
                </h4>
                <span className="text-[11px] text-slate-400">{selectedOrder.itemCount} items</span>
              </div>

              <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden bg-white shadow-xs">
                {selectedOrder.items.map((item, index) => {
                  const lineTotal = item.quantity * item.price;
                  return (
                    <div key={item.id || index} className="p-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className="w-6 h-6 rounded-md bg-orange-50 text-[#F47738] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {item.quantity}&times;
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{item.name}</p>
                          <p className="text-[11px] text-slate-400">
                            Unit Price: {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-extrabold text-slate-900">
                          {formatCurrency(lineTotal)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Subtotal & Settlement Summary */}
            <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100/80 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-800">
                  {formatCurrency(selectedOrder.subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Local Sales Tax & Surcharges (included)</span>
                <span className="font-semibold text-slate-800">$0.00</span>
              </div>
              <div className="pt-2 border-t border-orange-200/60 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-900">Total Settled Amount</span>
                <span className="font-black text-base text-[#F47738]">
                  {formatCurrency(selectedOrder.subtotal)}
                </span>
              </div>
            </div>

            {/* Quick Copy Helper */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span className="font-mono text-[11px]">ID: {selectedOrder.id}</span>
              <button
                type="button"
                onClick={() => handleCopyOrderNumber(selectedOrder.orderNumber)}
                className="text-[#F47738] hover:underline font-semibold inline-flex items-center gap-1"
              >
                <Copy className="w-3 h-3" /> Copy Order #
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OrderHistoryPage;
