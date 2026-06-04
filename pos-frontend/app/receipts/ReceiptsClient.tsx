'use client';

import React, { useState } from 'react';
import { Printer, Receipt as ReceiptIcon } from 'lucide-react';
import { ReceiptResponse, Product, OrderResponse, UserResponse } from '@/types';
import { ReceiptModal } from '@/components/ui/modal/ReceiptModal';
import { ProductImageOrEmoji } from '@/components/ui/ProductImageOrEmoji';
import { useRouter } from 'next/navigation';
import { formatDateTime } from '@/utils/date';

import DraggableDateRangePicker from '@/components/ui/DraggableDateRangePicker';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Select } from '@/components/ui/Select';

interface ReceiptsClientProps {
  initialReceipts: ReceiptResponse[];
  products: Product[];
  maids?: UserResponse[];
  currentFilters?: {
    maidName: string;
    receiptNumber: string;
    startDate: string;
    endDate: string;
  };
}

export function ReceiptsClient({
  initialReceipts = [],
  products = [],
  maids = [],
  currentFilters = { maidName: '', receiptNumber: '', startDate: '', endDate: '' }
}: ReceiptsClientProps) {
  const router = useRouter();

  const [maidName, setMaidName] = useState(currentFilters.maidName);
  const [receiptNumber, setReceiptNumber] = useState(currentFilters.receiptNumber);
  const [startDate, setStartDate] = useState(currentFilters.startDate);
  const [endDate, setEndDate] = useState(currentFilters.endDate);

  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<OrderResponse | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Helper to find product details
  const getProduct = (productId: string) => {
    return products.find(p => p.id === productId);
  };



  const handleFilter = () => {
    const queryParts = [];
    if (maidName) queryParts.push(`maidName=${encodeURIComponent(maidName)}`);
    if (receiptNumber) queryParts.push(`receiptNumber=${encodeURIComponent(receiptNumber)}`);
    if (startDate) queryParts.push(`startDate=${encodeURIComponent(startDate)}`);
    if (endDate) queryParts.push(`endDate=${encodeURIComponent(endDate)}`);
    
    router.push(`/receipts${queryParts.length ? '?' + queryParts.join('&') : ''}`);
  };

  const handleClear = () => {
    setMaidName('');
    setReceiptNumber('');
    setStartDate('');
    setEndDate('');
    router.push('/receipts');
  };

  const handleOpenReceipt = (receipt: ReceiptResponse) => {
    // Map Receipt back to a virtual legacy Order layout for the ReceiptModal
    const virtualOrder: OrderResponse = {
      id: receipt.id,
      receiptNumber: receipt.receiptNumber,
      items: (receipt.orders || []).flatMap(o => o.items || []),
      subtotal: receipt.subtotal,
      tax: receipt.tax,
      serviceCharge: receipt.serviceCharge,
      discount: receipt.discount,
      total: receipt.total,
      paymentMethod: receipt.paymentMethod,
      status: 'COMPLETED',
      maidName: receipt.maidName,
      serviceType: receipt.serviceType,
      tableNumber: receipt.tableNumber || null,
      createdAt: receipt.createdAt,
    };
    setSelectedReceiptOrder(virtualOrder);
    setShowReceiptModal(true);
  };

  return (
    <div className="w-full h-full absolute inset-0 bg-theme-bg flex flex-col overflow-hidden select-none">
      {/* Title bar */}
      <header className="h-16 px-6 border-b border-theme-border bg-theme-panel backdrop-blur-md flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <ReceiptIcon className="text-theme-accent" size={20} />
          <h1 className="text-sm font-black text-zinc-200 tracking-wider uppercase">Cyber Receipt Vault</h1>
        </div>
      </header>

      {/* Spacing adjustments */}
      <div className="pt-4"></div>

      {/* Filter panel */}
      <div className="px-6 mb-4">
        <div className="bg-theme-panel border border-theme-border rounded-3xl p-4 flex flex-wrap gap-4 items-end">
          <Select
            label="Maid Filter"
            value={maidName}
            onChange={(e) => setMaidName(e.target.value)}
            containerClassName="min-w-[150px]"
            className="!py-1.5 bg-theme-bg border-theme-border"
          >
            <option value="">All Maids</option>
            {maids.map((m) => (
              <option key={m.id} value={m.name}>
                {m.name}
              </option>
            ))}
          </Select>

          <div className="flex flex-col gap-1.5 min-w-[150px]">
            <span className="text-[9px] text-zinc-555 font-bold uppercase tracking-wider">Receipt Number</span>
            <input
              type="text"
              placeholder="Search receipt (e.g. NKB-)"
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
              className="py-1.5 px-3 rounded-xl bg-theme-bg border border-theme-border text-xs text-zinc-300 outline-none focus:border-theme-accent placeholder:text-zinc-650"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] text-zinc-555 font-bold uppercase tracking-wider">Date Range</span>
            <DraggableDateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={(start, end) => {
                setStartDate(start);
                setEndDate(end);
              }}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleFilter}
              className="py-1.5 px-4 rounded-xl bg-theme-btn-pink hover:bg-theme-btn-pink-hover text-white text-xs font-bold uppercase tracking-wider cursor-pointer active:scale-95 transition-all shadow-md"
            >
              Apply ✔
            </button>
            <button
              onClick={handleClear}
              className="py-1.5 px-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-450 hover:text-zinc-200 text-xs font-bold uppercase tracking-wider cursor-pointer active:scale-95 transition-all"
            >
              Clear ✕
            </button>
          </div>
        </div>
      </div>

      {initialReceipts.length === 0 ? (
        <div className="px-6 pb-6 flex-1 flex flex-col">
          <div className="h-72 flex flex-col items-center justify-center text-center bg-zinc-900/20 border border-dashed border-zinc-850 rounded-3xl p-6">
            <span className="text-5xl animate-float">🎟</span>
            <h3 className="mt-4 text-sm font-bold text-zinc-400">Receipt Vault is empty</h3>
            <p className="text-xs text-zinc-500 mt-1">Complete a check-out / sale to generate receipts here!</p>
          </div>
        </div>
      ) : (
        <div className="px-6 pb-6 flex-1 min-h-0 relative flex flex-col">
          <div className="bg-theme-card border border-theme-border rounded-3xl overflow-hidden shadow-xl relative flex flex-col flex-1 min-h-0">
            <ScrollArea className="flex-1 min-h-0">
              <table className="min-w-full divide-y divide-zinc-800/50 text-left font-mono">
                <thead className="bg-theme-panel text-[10px] font-black uppercase text-zinc-400 tracking-wider sticky top-0 z-10 border-b border-theme-border">
                  <tr>
                    <th className="py-4.5 px-6">Receipt / Cashier</th>
                    <th className="py-4.5 px-6">Date & Time</th>
                    <th className="py-4.5 px-6">Items Purchased</th>
                    <th className="py-4.5 px-6 text-right">Total</th>
                    <th className="py-4.5 px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850">
                  {initialReceipts.map((receipt) => {
                    const allItems = (receipt.orders || []).flatMap(o => o.items || []);
                    return (
                      <tr 
                        key={receipt.id} 
                        className="hover:bg-zinc-900/30 transition-colors"
                      >
                        {/* Receipt / Cashier */}
                        <td className="py-4 px-6 align-middle">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 shrink-0 rounded-xl bg-zinc-950 flex items-center justify-center font-bold text-pink-500 text-xs border border-zinc-850">
                              {receipt.paymentMethod === 'CASH' ? '💵' : receipt.paymentMethod === 'CARD' ? '💳' : '📱'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-zinc-200">{receipt.receiptNumber}</span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  PAID
                                </span>
                              </div>
                              <div className="text-[10px] text-zinc-500 mt-0.5 flex flex-wrap gap-x-1.5 items-center">
                                {receipt.serviceType && (
                                  <span className="text-zinc-400 capitalize font-medium">
                                    {receipt.serviceType === 'DINE_IN' ? `Table #${receipt.tableNumber}` : 'Takeaway'}
                                  </span>
                                )}
                                {receipt.maidName && (
                                  <>
                                    <span className="text-zinc-650">•</span>
                                    <span className="text-zinc-400 font-medium">Maid: {receipt.maidName}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td className="py-4 px-6 text-xs text-zinc-400 align-middle">
                          {formatDateTime(receipt.createdAt)}
                        </td>

                        {/* Items Purchased */}
                        <td className="py-4 px-6 align-middle">
                          <div className="flex flex-wrap gap-1.5 max-w-sm">
                            {allItems.map((item, idx) => {
                              const product = getProduct(item.product?.id || '');
                              const productName = item.product?.name || 'Unknown Item';
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
                                  <span className="font-extrabold text-pink-400">x{item.quantity}</span>
                                </span>
                              );
                            })}
                          </div>
                        </td>

                        {/* Total */}
                        <td className="py-4 px-6 text-right font-extrabold text-sm text-pink-500 align-middle">
                          ${receipt.total.toFixed(2)}
                        </td>

                        {/* Action */}
                        <td className="py-4 px-6 text-center align-middle">
                          <button
                            onClick={() => handleOpenReceipt(receipt)}
                            className="px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Printer size={13} />
                            Receipt
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </ScrollArea>
          </div>
        </div>
      )}

      {/* MODAL: THERMAL RECEIPT DRAWER */}
      <ReceiptModal
        isOpen={showReceiptModal}
        order={selectedReceiptOrder}
        onClose={() => {
          setShowReceiptModal(false);
          setSelectedReceiptOrder(null);
        }}
      />
    </div>
  );
}
