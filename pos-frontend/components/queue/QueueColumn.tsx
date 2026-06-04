'use client';

import React from 'react';
import { OrderResponse } from '@/types';
import { ScrollArea } from '@/components/ui/ScrollArea';
import OrderQueueCard from './OrderQueueCard';

interface QueueColumnProps {
  title: string;
  icon: string;
  badgeBgClass: string;
  badgeTextClass: string;
  orders: OrderResponse[];
  getElapsedTime: (createdAtStr?: string) => string;
  actionLabel: string;
  actionColor: string;
  onAction: (orderId: string) => void;
  emptyIcon: string;
  emptyMessage: string;
  loading: boolean;
}

export default function QueueColumn({
  title,
  icon,
  badgeBgClass,
  badgeTextClass,
  orders,
  getElapsedTime,
  actionLabel,
  actionColor,
  onAction,
  emptyIcon,
  emptyMessage,
  loading,
}: QueueColumnProps) {
  return (
    <div className="flex flex-col gap-4 bg-theme-panel/40 border border-theme-border p-4 rounded-3xl min-w-[300px] lg:w-1/3 flex-1 h-[500px] lg:h-full overflow-hidden">
      {/* Column Header */}
      <div className="flex justify-between items-center px-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm">{icon}</span>
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">{title}</h2>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${badgeBgClass} ${badgeTextClass}`}>
          {orders.length}
        </span>
      </div>

      {/* Cards List in ScrollArea */}
      <ScrollArea className="flex-1 pr-1" trackTransparent>
        <div className="flex flex-col gap-3 pb-2">
          {orders.map((order) => (
            <OrderQueueCard
              key={order.id}
              order={order}
              elapsedTime={getElapsedTime(order.createdAt)}
              actionLabel={actionLabel}
              actionColor={actionColor}
              onAction={() => onAction(order.id)}
            />
          ))}
          {!loading && orders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-2 border border-dashed border-theme-border/50 rounded-2xl">
              <span className="text-2xl">{emptyIcon}</span>
              <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider">{emptyMessage}</span>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
