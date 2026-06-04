'use client';

import React from 'react';
import { Clock, ShoppingBag, Utensils } from 'lucide-react';
import { OrderResponse } from '@/types';
import { ScrollArea } from '@/components/ui/ScrollArea';

interface OrderQueueCardProps {
  order: OrderResponse;
  elapsedTime: string;
  actionLabel: string;
  actionColor: string;
  onAction: () => void;
}

export default function OrderQueueCard({
  order,
  elapsedTime,
  actionLabel,
  actionColor,
  onAction,
}: OrderQueueCardProps) {
  const isTakeaway = order.serviceType === 'TAKEAWAY';

  return (
    <div className="flex flex-col bg-theme-card border border-theme-border hover:border-theme-accent/30 p-4 rounded-2xl gap-3 shadow-md transition-all shrink-0">
      <div className="flex items-center justify-between">
        {/* Service Type Tag */}
        <div className="flex items-center gap-1.5">
          {isTakeaway ? (
            <span className="flex items-center gap-1 text-[10px] bg-purple-500/10 border border-purple-500/30 text-purple-400 px-2 py-0.5 rounded-lg font-black uppercase tracking-wider">
              <ShoppingBag size={10} /> Takeaway
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-2 py-0.5 rounded-lg font-black uppercase tracking-wider">
              <Utensils size={10} /> Dine In
            </span>
          )}

          {/* Allocation Identifier */}
          <span className="text-xs font-black text-zinc-100">
            {isTakeaway ? `Queue #${order.receiptNumber.split('-').pop()}` : `Table #${order.tableNumber}`}
          </span>
        </div>

        {/* Elapsed Time / Clock */}
        <div className="flex items-center gap-1 text-zinc-550 text-[10px] font-mono">
          <Clock size={10} />
          <span>{elapsedTime}</span>
        </div>
      </div>

      {/* Receipt metadata */}
      <div className="flex flex-col gap-0.5 border-b border-theme-border/50 pb-2">
        <span className="text-[9px] font-mono text-zinc-555">Receipt: {order.receiptNumber}</span>
        <span className="text-[10px] text-zinc-400">
          Server: <strong className="text-zinc-350 font-extrabold">{order.maidName || 'Unknown Staff'}</strong>
        </span>
      </div>

      {/* Items list */}
      <ScrollArea maxHeight="120px" className="flex flex-col gap-2 py-1 pr-1" trackTransparent>
        <div className="flex flex-col gap-2">
          {(order.items || []).map((item, idx) => (
            <div key={idx} className="flex flex-col text-[11px]">
              <div className="flex items-start justify-between gap-2">
                <span className="text-zinc-300 font-extrabold">
                  <span className="text-pink-400 font-black mr-1">{item.quantity}x</span>
                  {item.product?.name || 'Unknown Item'}
                </span>
              </div>
              {item.note && (
                <span className="text-[9px] text-zinc-555 italic mt-0.5 ml-5 pl-1 border-l border-theme-border/50">
                  💬 {item.note}
                </span>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Action CTA Button */}
      <button
        onClick={onAction}
        className={`w-full py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer border ${actionColor}`}
      >
        {actionLabel}
      </button>
    </div>
  );
}
