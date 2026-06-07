'use client';

import React from 'react';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { ProductImageOrEmoji } from '@/components/ui/ProductImageOrEmoji';
import { formatDateTime } from '@/utils/date';
import { Product, OrderResponse, ReceiptResponse } from '@/types';

interface VaultTableProps<T> {
  items: T[];
  products: Product[];
  emptyMessage: string;
  emptySubMessage: string;
  emptyIcon?: string;
  getItems: (item: T) => any[];
  onActionClick?: (item: T) => void;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
}

export function VaultTable<T extends OrderResponse | ReceiptResponse>({
  items = [],
  products = [],
  emptyMessage,
  emptySubMessage,
  emptyIcon = '🔮',
  getItems,
  onActionClick,
  actionLabel,
  actionIcon,
}: Readonly<VaultTableProps<T>>) {
  // Helper to find product details
  const getProduct = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  if (items.length === 0) {
    return (
      <div className="px-6 pb-6 flex-1 flex flex-col">
        <div className="h-72 flex flex-col items-center justify-center text-center bg-zinc-900/20 border border-dashed border-zinc-850 rounded-3xl p-6">
          <span className="text-5xl animate-float">{emptyIcon}</span>
          <h3 className="mt-4 text-sm font-bold text-zinc-400">{emptyMessage}</h3>
          <p className="text-xs text-zinc-500 mt-1">{emptySubMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pb-6 flex-1 min-h-0 relative flex flex-col">
      <div className="bg-theme-card border border-theme-border rounded-3xl overflow-hidden shadow-xl relative flex flex-col flex-1 min-h-0">
        <ScrollArea className="flex-1 min-h-0">
          <table className="min-w-full divide-y divide-zinc-800/50 text-left font-mono">
            <thead className="bg-theme-panel text-[10px] font-black uppercase text-zinc-400 tracking-wider sticky top-0 z-10 border-b border-theme-border">
              <tr>
                <th className="py-4.5 px-6">Receipt / Status</th>
                <th className="py-4.5 px-6">Date & Time</th>
                <th className="py-4.5 px-6">Items Purchased</th>
                <th className="py-4.5 px-6 text-right">Total</th>
                {onActionClick && <th className="py-4.5 px-6 text-center">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850">
              {items.map((item) => {
                const rowItems = getItems(item);
                return (
                  <tr key={item.id} className="hover:bg-zinc-900/30 transition-colors">
                    {/* Receipt / Status */}
                    <td className="py-4 px-6 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 shrink-0 rounded-xl bg-zinc-950 flex items-center justify-center font-bold text-pink-500 text-xs border border-zinc-850">
                          {item.paymentMethod === 'CASH' ? '💵' : item.paymentMethod === 'CARD' ? '💳' : '📱'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-zinc-200">{item.receiptNumber}</span>
                            {'status' in item && item.status &&  (
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase ${
                                item.status === 'COMPLETED'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                {item.status}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-zinc-500 mt-0.5 flex flex-wrap gap-x-1.5 items-center">
                            {item.serviceType && (
                              <span className="text-zinc-400 capitalize font-medium">
                                {item.serviceType === 'DINE_IN'
                                  ? `Table #${item.tableNumber}`
                                  : `Queue #${item.receiptNumber.split('-').pop()}`}
                              </span>
                            )}
                            {item.maidName && (
                              <>
                                <span className="text-zinc-650">•</span>
                                <span className="text-zinc-400 font-medium">Maid: {item.maidName}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="py-4 px-6 text-xs text-zinc-400 align-middle">
                      {item.createdAt ? formatDateTime(item.createdAt) : ''}
                    </td>

                    {/* Items Purchased */}
                    <td className="py-4 px-6 align-middle">
                      <div className="flex flex-wrap gap-1.5 max-w-sm">
                        {rowItems.map((rowItem, idx) => {
                          const product = getProduct(rowItem.product?.id || '');
                          const productName = rowItem.product?.name || 'Unknown Item';
                          return (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded-lg bg-zinc-950/80 border border-zinc-850 text-zinc-400 flex items-center gap-1.5"
                            >
                              <ProductImageOrEmoji
                                imageUrl={product?.imageUrl}
                                emoji={product?.emoji || '🐾'}
                                name={productName}
                                className="w-4 h-4 rounded-md overflow-hidden flex items-center justify-center bg-zinc-950"
                                emojiClassName="text-[10px]"
                              />
                              <span>{productName.split(' ')[0]}</span>
                              <span className="font-extrabold text-pink-400">x{rowItem.quantity}</span>
                            </span>
                          );
                        })}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="py-4 px-6 text-right font-extrabold text-sm text-pink-500 align-middle">
                      ${item.total.toFixed(2)}
                    </td>

                    {/* Action */}
                    {onActionClick && (
                      <td className="py-4 px-6 text-center align-middle">
                        <button
                          onClick={() => onActionClick(item)}
                          className="px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {actionIcon}
                          {actionLabel}
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </ScrollArea>
      </div>
    </div>
  );
}
