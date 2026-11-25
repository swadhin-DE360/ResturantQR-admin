import React, { useEffect } from 'react';
import {
  X,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  ChefHat,
  Bell,
  Utensils,
  Receipt,
} from 'lucide-react';
import { LiveOrder, OrderStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency, getStatusBadgeVariant } from '@/utils';

interface OrderDetailDrawerProps {
  order: LiveOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export const OrderDetailDrawer: React.FC<OrderDetailDrawerProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
}) => {
  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !order) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
    >
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200/90 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* =========================================================================
              DRAWER HEADER
             ========================================================================= */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F47738] flex items-center justify-center font-bold">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 id="drawer-title" className="text-base font-extrabold text-slate-900 tracking-tight">
                    {order.orderNumber}
                  </h3>
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5" /> Ordered today at {order.createdAt}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* =========================================================================
              DRAWER SCROLLABLE BODY
             ========================================================================= */}
          <div className="px-6 py-5 overflow-y-auto flex-1 space-y-6">
            {/* Table & Order Metadata Banner */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs">
                  <MapPin className="w-4 h-4 text-[#F47738]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Dining Table
                  </span>
                  <p className="text-sm font-bold text-slate-900">{order.tableNumber}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Items
                </span>
                <p className="text-sm font-bold text-slate-900">{order.totalItems} courses</p>
              </div>
            </div>

            {/* Food Items List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-[#F47738]" />
                  Food Items Breakdown
                </h4>
                <span className="text-[11px] text-slate-400 font-medium">
                  Qty &times; Price = Total
                </span>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                {order.items.map((item, idx) => {
                  const itemSubtotal = item.quantity * item.price;
                  return (
                    <div key={item.id || idx} className="p-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Quantity Pill */}
                        <span className="w-6 h-6 rounded-md bg-orange-50 text-[#F47738] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {item.quantity}&times;
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Individual price: {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>

                      {/* Item Subtotal */}
                      <div className="text-right shrink-0">
                        <span className="text-xs font-extrabold text-slate-900">
                          {formatCurrency(itemSubtotal)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bill Summary */}
            <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100/80 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-800">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Tax & Service (included)</span>
                <span className="font-semibold text-slate-800">$0.00</span>
              </div>
              <div className="pt-2 border-t border-orange-200/60 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-900">Overall Subtotal</span>
                <span className="font-black text-base text-[#F47738]">
                  {formatCurrency(order.subtotal)}
                </span>
              </div>
            </div>

            {/* Current Status Information Box */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
              <span className="font-semibold text-slate-800 block mb-0.5">
                Kitchen Pipeline Status
              </span>
              <p className="text-[11px] text-slate-500">
                Current status is set to <strong className="text-slate-800">{order.status}</strong>.
                Use the actions below to transition this ticket.
              </p>
            </div>
          </div>

          {/* =========================================================================
              DRAWER ACTIONS FOOTER: Status Transitions
             ========================================================================= */}
          <div className="p-5 border-t border-slate-100 bg-slate-50/80 space-y-2 shrink-0">
            {order.status === 'Pending' && (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="danger"
                  size="md"
                  onClick={() => onUpdateStatus(order.id, 'Rejected')}
                  leftIcon={<XCircle className="w-4 h-4" />}
                >
                  Reject Order
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => onUpdateStatus(order.id, 'Accepted')}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Accept Order
                </Button>
              </div>
            )}

            {order.status === 'Accepted' && (
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => onUpdateStatus(order.id, 'Preparing')}
                leftIcon={<ChefHat className="w-4 h-4" />}
              >
                Send to Kitchen (Mark Preparing)
              </Button>
            )}

            {order.status === 'Preparing' && (
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => onUpdateStatus(order.id, 'Ready')}
                leftIcon={<Bell className="w-4 h-4" />}
              >
                Food Plated (Mark Ready for Table)
              </Button>
            )}

            {order.status === 'Ready' && (
              <Button
                variant="primary"
                size="md"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={() => onUpdateStatus(order.id, 'Completed')}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Served & Paid (Mark Completed)
              </Button>
            )}

            {order.status === 'Rejected' && (
              <div className="flex items-center justify-between text-xs text-rose-600 font-semibold px-2">
                <span>Order was rejected by management.</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateStatus(order.id, 'Accepted')}
                >
                  Re-accept
                </Button>
              </div>
            )}

            {order.status === 'Completed' && (
              <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold px-2">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Order completed and settled.
                </span>
                <span className="text-[11px] text-slate-400">Shift closed</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
