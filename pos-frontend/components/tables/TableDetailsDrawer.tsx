'use client';

import React, { useState } from 'react';
import { X, Receipt, Printer, Users, Ticket, Tag, Loader2 } from 'lucide-react';
import { TableResponse, OrderItemDbResponse, Product } from '@/types';
import { ProductImageOrEmoji } from '@/components/ui/ProductImageOrEmoji';
import { Voucher } from '@/services/api-vouchers';
import { useVoucher } from '@/hooks/useVoucher';
import { useErrorState } from '@/hooks/useErrorState';
import { ErrorModal } from '@/components/ui/error/ErrorModal';
import { formatTime } from '@/utils/date';

interface TableDetailsDrawerProps {
  table: TableResponse;
  onClose: () => void;
  onPrintCombined: () => void;
  onPay: (voucherCode?: string) => void;
  products: Product[];
}

export default function TableDetailsDrawer({
  table,
  onClose,
  onPrintCombined,
  onPay,
  products = []
}: TableDetailsDrawerProps) {
  const tableNum = table.tableNumber;
  const orders = table.activeOrders || [];

  const {
    errorModalOpen,
    setErrorModalOpen,
    errorModalMessage,
    showError,
  } = useErrorState();

  const {
    voucherCodeInput,
    setVoucherCodeInput,
    appliedVoucher,
    setAppliedVoucher,
    isApplying,
    handleApplyVoucher,
  } = useVoucher({ onError: showError });



  const getProduct = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const subtotal = orders.reduce((sum, o) => sum + o.subtotal, 0);
  const serviceCharge = orders.reduce((sum, o) => sum + o.serviceCharge, 0);
  const tax = orders.reduce((sum, o) => sum + o.tax, 0);
  
  // Calculate voucher discount
  let voucherDiscount = 0;
  if (appliedVoucher) {
    voucherDiscount = parseFloat((subtotal * (appliedVoucher.discountPercentage / 100)).toFixed(2));
  }

  const grandTotal = Math.max(0, subtotal + serviceCharge + tax - voucherDiscount);



  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-zinc-950 border-l border-zinc-855 h-full flex flex-col p-6 gap-5 shadow-2xl animate-slide-in">
        {/* Drawer Header */}
        <div className="flex justify-between items-center pb-4 border-b border-zinc-900 animate-slide-up">
          <div>
            <h3 className="font-extrabold text-sm text-zinc-250">Table #{tableNum.padStart(2, '0')} Details</h3>
            <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 font-bold uppercase">
              <span>Active Billing Sheet</span>
              <span>•</span>
              <span className="flex items-center gap-0.5 text-theme-accent-sec"><Users size={9} /> {table.seatSize} Seats</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-555 hover:text-zinc-355 cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Accumulated Order Summary list */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-1">
          <div className="bg-theme-panel border border-theme-border rounded-2xl p-4 flex flex-col gap-3">
            <span className="text-[9px] font-black uppercase text-theme-accent tracking-wider flex items-center gap-1.5">
              <Receipt size={10} /> Accumulated Bill Details
            </span>
            
            <div className="flex flex-col gap-1.5 text-xs border-b border-zinc-900/80 pb-3">
              {Object.values(
                orders.reduce<Record<string, OrderItemDbResponse>>((acc, order) => {
                  (order.items || []).forEach(item => {
                    const id = item.product?.id || '';
                    if (!id) return;
                    if (acc[id]) {
                      acc[id].quantity = (acc[id].quantity || 0) + (item.quantity || 0);
                    } else {
                      acc[id] = { ...item };
                    }
                  });
                  return acc;
                }, {})
              ).map((item, idx) => {
                const productName = item.product?.name || 'Unknown Item';
                const itemPrice = item.product?.price || 0;
                const quantity = item.quantity || 0;
                return (
                  <div key={idx} className="flex justify-between items-center text-zinc-300 gap-2">
                    <span className="flex items-center gap-1.5">
                      <ProductImageOrEmoji 
                        imageUrl={getProduct(item.product?.id || '')?.imageUrl} 
                        emoji={getProduct(item.product?.id || '')?.emoji || '🐾'} 
                        name={productName} 
                        className="w-4.5 h-4.5 rounded-md overflow-hidden flex items-center justify-center bg-zinc-950"
                        emojiClassName="text-[10px]"
                      />
                      <span>{productName}</span>
                      <span className="text-zinc-555 font-bold">x{quantity}</span>
                    </span>
                    <span className="font-mono">${(itemPrice * quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-1 text-[10px] text-zinc-505 font-mono">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Charge (10%):</span>
                <span>${serviceCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (7%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              {/* Applied Voucher Discount */}
              {appliedVoucher && (
                <div className="flex justify-between text-emerald-500 font-bold">
                  <span className="flex items-center gap-1">
                    <Tag size={10} /> Voucher ({appliedVoucher.code} - {appliedVoucher.discountPercentage}%):
                  </span>
                  <span>-${voucherDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-xs font-black text-zinc-200 pt-2 border-t border-zinc-900/50 mt-1">
                <span>Grand Total:</span>
                <span className="text-theme-accent">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Voucher input form in the drawer */}
          <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-4 flex flex-col gap-3">
            <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider flex items-center gap-1">
              <Ticket size={10} /> Apply Coupon/Voucher
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={voucherCodeInput}
                onChange={e => setVoucherCodeInput(e.target.value)}
                placeholder="Voucher code, nya~"
                className="flex-1 bg-zinc-950 border border-zinc-850 hover:border-zinc-800 text-zinc-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-theme-accent uppercase font-mono placeholder:lowercase"
              />
              <button
                onClick={handleApplyVoucher}
                disabled={isApplying}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-855 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-xl text-xs font-bold uppercase cursor-pointer active:scale-95 transition-all flex items-center gap-1"
              >
                {isApplying ? <Loader2 size={12} className="animate-spin" /> : 'Apply'}
              </button>
            </div>

            {appliedVoucher && (
              <div className="flex items-center justify-between bg-emerald-950/20 border border-emerald-900/40 rounded-xl px-3 py-2 text-xs text-emerald-400">
                <span className="font-bold">Code applied: {appliedVoucher.code} ({appliedVoucher.discountPercentage}% off)</span>
                <button 
                  onClick={() => setAppliedVoucher(null)} 
                  className="text-emerald-500 hover:text-emerald-300 font-bold ml-2 cursor-pointer"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>

          {/* Sub-orders List */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">Sub-orders Log</span>
            {orders.map((order, idx) => (
              <div key={order.id} className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-3.5 flex flex-col gap-2">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-extrabold text-zinc-300">
                    Order #{idx + 1} ({order.status})
                  </span>
                  <span className="text-zinc-555">{formatTime(order.createdAt)}</span>
                </div>
                <div className="flex flex-col gap-0.5 text-[9px] text-zinc-400">
                  {(order.items || []).map((it, i) => {
                    const productName = it.product?.name || 'Unknown Item';
                    const itemPrice = it.product?.price || 0;
                    const quantity = it.quantity || 0;
                    return (
                      <div key={i} className="flex justify-between">
                        <span>{productName} x{quantity}</span>
                        <span>${(itemPrice * quantity).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-zinc-900 flex flex-col gap-2">
          <button
            onClick={onPrintCombined}
            className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 rounded-2xl text-xs font-bold uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.98]"
          >
            <Printer size={13} />
            Print Combined Bill
          </button>
          <button
            onClick={() => onPay(appliedVoucher?.code)}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white rounded-2xl text-xs font-black uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.98] shadow-md shadow-pink-900/10"
          >
            Collect Payment & Checkout ✔
          </button>
        </div>
      </div>

      <ErrorModal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        message={errorModalMessage}
        title="Invalid Coupon"
      />
    </div>
  );
}
