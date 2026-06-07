'use client';

import React, { useState } from 'react';
import { ShoppingBag as CartIcon, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { TableResponse, ReceiptResponse } from '@/types';
import { createOrder } from '@/services/api-orders';
import { fetchReceiptById } from '@/services/api-receipts';
import { CartItemCard } from './cart/CartItemCard';
import { CheckoutModal } from './cart/CheckoutModal';
import { ReceiptModal } from '@/components/ui/modal/ReceiptModal';
import { ProductImageOrEmoji } from '@/components/ui/ProductImageOrEmoji';
import { ErrorModal } from '@/components/ui/error/ErrorModal';
import { useErrorState } from '@/hooks/useErrorState';
import { useCart } from '@/context/CartContext';

interface CartPanelProps {
  handleOrderCompleted: () => void;
  maidEmail: string | null;
  tables: TableResponse[];
}

export function CartPanel({
  handleOrderCompleted,
  maidEmail,
  tables,
}: Readonly<CartPanelProps>) {
  const {
    cart,
    totals,
    activeDiscount,
    setActiveDiscount,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
  } = useCart();

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<ReceiptResponse | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    errorModalOpen,
    setErrorModalOpen,
    errorModalMessage: errorMessage,
    showError,
  } = useErrorState();

  const handleOpenCheckout = () => {
    if (cart.length === 0) {
      return;
    }
    setShowCheckoutModal(true);
  };

  const handleConfirmPayment = async (
    paymentMethod: 'CASH' | 'CARD' | 'QR',
    serviceType: 'DINE_IN' | 'TAKEAWAY',
    number: string,
    voucherCode?: string,
    discountAmount?: number
  ) => {
    setIsSubmitting(true);

    try {
      const finalDiscount = discountAmount ?? totals.discount;
      const res = await createOrder({
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          note: item.note || undefined,
        })),
        subtotal: totals.subtotal,
        tax: totals.tax,
        serviceCharge: totals.serviceCharge,
        discount: finalDiscount,
        total: Math.max(0, totals.subtotal + totals.serviceCharge + totals.tax - finalDiscount),
        paymentMethod,
        status: 'PENDING',
        maidEmail,
        serviceType,
        tableNumber: serviceType === 'DINE_IN' ? number : null,
        voucherCode: voucherCode || undefined,
      });

      setShowCheckoutModal(false);

      if (res.success && res.data) {
        // Show receipt for takeaway, not for dine-in (calculate later)
        if (serviceType !== 'DINE_IN') {
          const order = res.data;
          if (order.receiptId) {
            try {
              const receiptRes = await fetchReceiptById(order.receiptId);
              if (receiptRes.success && receiptRes.data) {
                setCompletedReceipt(receiptRes.data);
                setShowReceipt(true);
              }
            } catch (fetchErr) {
              console.error('Failed to fetch receipt from database, using fallback', fetchErr);
              const virtualReceipt: ReceiptResponse = {
                id: order.id,
                receiptNumber: order.receiptNumber,
                subtotal: order.subtotal,
                tax: order.tax,
                serviceCharge: order.serviceCharge,
                discount: order.discount,
                total: order.total,
                paymentMethod: order.paymentMethod,
                serviceType: order.serviceType,
                tableNumber: order.tableNumber,
                maidName: order.maidName || 'Maid Staff',
                orders: [order],
                createdAt: order.createdAt,
              };
              setCompletedReceipt(virtualReceipt);
              setShowReceipt(true);
            }
          } else {
            const virtualReceipt: ReceiptResponse = {
              id: order.id,
              receiptNumber: order.receiptNumber,
              subtotal: order.subtotal,
              tax: order.tax,
              serviceCharge: order.serviceCharge,
              discount: order.discount,
              total: order.total,
              paymentMethod: order.paymentMethod,
              serviceType: order.serviceType,
              tableNumber: order.tableNumber,
              maidName: order.maidName || 'Maid Staff',
              orders: [order],
              createdAt: order.createdAt,
            };
            setCompletedReceipt(virtualReceipt);
            setShowReceipt(true);
          }
        }
      }

      handleClearCart();
      setActiveDiscount(null);
      handleOrderCompleted();
    } catch (err: any) {
      console.error('Order submission failed', err);
      const msg = err.response?.data?.message || err.message || 'An unexpected error occurred';
      showError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <aside className={`border-l border-theme-border bg-theme-panel backdrop-blur-xl flex flex-col justify-between z-20 shrink-0 h-full relative transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16 px-1' : 'w-96'
      }`}>
        {/* Floating Toggle Button */}
        <button
          onClick={() => {
            setIsCollapsed(!isCollapsed);
          }}
          className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 flex items-center justify-center cursor-pointer shadow-[0_0_10px_rgba(0,0,0,0.5)] hover:scale-110 active:scale-95 transition-all z-30"
          title={isCollapsed ? 'Expand Current Order' : 'Collapse Current Order'}
        >
          {isCollapsed ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
        </button>

        {/* Cart Header */}
        <div className={`h-16 border-b border-theme-border flex items-center shrink-0 ${isCollapsed ? 'justify-center px-0' : 'justify-between px-5'}`}>
          <div className={`flex items-center gap-2 ${isCollapsed ? 'flex-col justify-center' : ''}`}>
            <CartIcon size={18} className="text-theme-accent" />
            {!isCollapsed && (
              <>
                <h2 className="font-black text-sm text-zinc-200">Current Order</h2>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-theme-badge border border-theme-badge-border text-theme-badge-text">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </>
            )}
            {isCollapsed && (
              <span className="text-[9px] font-extrabold px-1 py-0.5 rounded bg-theme-badge border border-theme-badge-border text-theme-badge-text scale-90">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </div>
          {!isCollapsed && cart.length > 0 && (
            <button 
              onClick={() => {
                handleClearCart();
              }}
              className="text-[10px] font-bold text-rose-400 hover:text-rose-355 transition-colors border border-theme-badge-border px-2 py-1 rounded-lg cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Cart Items Area */}
        <div className={`flex-1 overflow-y-auto p-4 flex flex-col gap-3 ${isCollapsed ? 'items-center scrollbar-none' : ''}`}>
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-3">
              <span className="text-5xl animate-float">🍙</span>
              {!isCollapsed && (
                <div>
                  <h4 className="text-xs font-bold text-zinc-400">Order ticket is blank</h4>
                  <p className="text-[11px] text-zinc-655 mt-1 max-w-[200px] leading-relaxed">
                    Click items in the menu grid to load this ticket!
                  </p>
                </div>
              )}
            </div>
          ) : (
            <AnimatePresence>
              {cart.map((item) => (
                isCollapsed ? (
                  <div 
                    key={item.product.id} 
                    className="text-2xl p-1.5 rounded-xl bg-zinc-900/50 relative group cursor-pointer hover:bg-zinc-800 transition-colors"
                    title={`${item.product.name} (x${item.quantity})`}
                    onClick={() => setIsCollapsed(false)}
                  >
                    <ProductImageOrEmoji
                      imageUrl={item.product.imageUrl}
                      emoji={item.product.emoji}
                      name={item.product.name}
                      className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-zinc-900/50"
                      emojiClassName="text-xl"
                    />
                    <span className="absolute -top-1 -right-1 bg-theme-btn-pink text-white text-[9px] font-bold px-1 rounded-full scale-90">
                      {item.quantity}
                    </span>
                  </div>
                ) : (
                  <CartItemCard
                    key={item.product.id}
                    item={item}
                    handleRemoveFromCart={handleRemoveFromCart}
                    handleUpdateQuantity={handleUpdateQuantity}
                  />
                )
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Cart Pricing & Checkout Summary */}
        <div className={`border-t border-theme-border bg-theme-panel p-4 flex flex-col gap-4 shrink-0 ${isCollapsed ? 'items-center px-1' : ''}`}>
          {isCollapsed ? (
            <button
              onClick={() => {
                if (cart.length > 0) {
                  handleOpenCheckout();
                } else {
                  setIsCollapsed(false);
                }
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                cart.length === 0 
                  ? 'bg-zinc-900 border border-theme-border text-zinc-655 cursor-not-allowed'
                  : 'bg-theme-btn-pink hover:bg-theme-btn-pink-hover text-white shadow-lg active:scale-95'
              }`}
              title={cart.length === 0 ? "Cart is empty" : `Checkout: $${totals.total.toFixed(2)}`}
              disabled={cart.length === 0}
            >
              <CartIcon size={16} />
            </button>
          ) : (
            <>
              {/* Promo input removed from sidebar */}

              <div className="flex flex-col gap-1.5 text-[11px] text-zinc-450">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-300">${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Maid Service (10%)</span>
                  <span className="font-semibold text-zinc-300">${totals.serviceCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Tax (7%)</span>
                  <span className="font-semibold text-zinc-300">${totals.tax.toFixed(2)}</span>
                </div>
                {activeDiscount && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount ({activeDiscount.code} -{activeDiscount.percent}%)</span>
                    <span>-${totals.discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="dashed-separator opacity-40 text-theme-border my-1" />

                <div className="flex justify-between text-xs font-black text-zinc-150">
                  <span className="text-zinc-200">Total Ticket</span>
                  <span className="text-sm text-theme-accent neon-text-pink">${totals.total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleOpenCheckout}
                className={`w-full py-3 rounded-2xl text-xs font-extrabold text-center uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  cart.length === 0 || isSubmitting
                    ? 'bg-zinc-900 border border-theme-border text-zinc-650 cursor-not-allowed'
                    : 'bg-theme-btn-pink hover:bg-theme-btn-pink-hover text-white shadow-lg active:scale-95'
                }`}
                disabled={cart.length === 0 || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CartIcon size={14} />
                    <span>Charge Ticket</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </aside>

      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        total={totals.total}
        onConfirm={handleConfirmPayment}
        tables={tables}
        isSubmitting={isSubmitting}
      />

      <ReceiptModal
        isOpen={showReceipt}
        receipt={completedReceipt}
        onClose={() => {
          setShowReceipt(false);
          setCompletedReceipt(null);
        }}
      />

      <ErrorModal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        message={errorMessage}
        title="Order Failed"
      />
    </>
  );
}
