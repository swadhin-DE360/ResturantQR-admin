import { APP_CONFIG } from '@/constants';
import { OrderStatus } from '@/types';

export function formatCurrency(amount: number): string {
  return `${APP_CONFIG.currencySymbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function getStatusBadgeVariant(status: OrderStatus): 'default' | 'warning' | 'info' | 'success' | 'danger' | 'purple' {
  switch (status) {
    case 'Pending':
      return 'warning';
    case 'Accepted':
      return 'info';
    case 'Preparing':
      return 'warning';
    case 'Ready':
      return 'purple';
    case 'Completed':
      return 'success';
    case 'Rejected':
      return 'danger';
    default:
      return 'default';
  }
}
