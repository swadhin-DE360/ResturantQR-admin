import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Card } from './Card';
import { cn } from '@/utils';

export interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  period: string;
  icon: React.ReactNode;
  iconBgColor?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  period,
  icon,
  iconBgColor = 'bg-brand-50 text-brand-600',
}) => {
  const isPositive = change >= 0;

  return (
    <Card className="hover:border-slate-300 transition-all hover:shadow-md">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <div className={cn('p-2.5 rounded-xl', iconBgColor)}>
            {icon}
          </div>
        </div>
        <div className="mt-3">
          <h4 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h4>
          <div className="mt-2 flex items-center text-xs">
            <span
              className={cn(
                'inline-flex items-center font-semibold mr-1.5',
                isPositive ? 'text-emerald-600' : 'text-rose-600'
              )}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              )}
              {isPositive ? `+${change}%` : `${change}%`}
            </span>
            <span className="text-slate-500">{period}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
