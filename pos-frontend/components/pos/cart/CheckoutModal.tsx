'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { X, CreditCard, Loader2, Ticket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TableResponse } from '@/types';
import { useCart } from '@/context/CartContext';
import { Voucher } from '@/services/api-vouchers';
import { useVoucher } from '@/hooks/useVoucher';
import { useErrorState } from '@/hooks/useErrorState';
import { ErrorModal } from '@/components/ui/error/ErrorModal';
import { Select } from '@/components/ui/Select';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onConfirm: (
    paymentMethod: 'CASH' | 'CARD' | 'QR',
    serviceType: 'DINE_IN' | 'TAKEAWAY',
    number: string,
    voucherCode?: string,
    discountAmount?: number
  ) => void;
  tables?: TableResponse[];
  isSubmitting?: boolean;
}

export function CheckoutModal({
  isOpen,
  onClose,
  total,
  onConfirm,
  tables = [],
  isSubmitting = false,
}: CheckoutModalProps) {
  const { totals } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'QR'>('CASH');
  const [serviceType, setServiceType] = useState<'DINE_IN' | 'TAKEAWAY'>('DINE_IN');
  const [tableNumber, setTableNumber] = useState('1');
  const [cashPaidInput, setCashPaidInput] = useState('');

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
  } = useVoucher({ isOpen, serviceType, onError: showError });

  const selectedTableObj = useMemo(() => {
    return tables.find(t => t.tableNumber === tableNumber) || null;
  }, [tables, tableNumber]);

  const activeItems = useMemo(() => {
    if (!selectedTableObj || !selectedTableObj.activeOrders) return [];
    const items: { productName: string; quantity: number; status: string }[] = [];
    selectedTableObj.activeOrders.forEach(order => {
      if (order.status !== 'COMPLETED') {
        (order.items || []).forEach(item => {
          items.push({
            productName: item.product?.name || 'Unknown Item',
            quantity: item.quantity || 0,
            status: order.status
          });
        });
      }
    });
    return items;
  }, [selectedTableObj]);

  // Update default selected table when tables are loaded
  useEffect(() => {
    if (tables && tables.length > 0) {
      setTableNumber(tables[0].tableNumber);
    }
  }, [tables]);

  const voucherDiscount = useMemo(() => {
    if (serviceType === 'TAKEAWAY' && appliedVoucher) {
      return parseFloat((totals.subtotal * (appliedVoucher.discountPercentage / 100)).toFixed(2));
    }
    return 0;
  }, [serviceType, appliedVoucher, totals.subtotal]);

  const effectiveTotal = useMemo(() => {
    return Math.max(0, totals.subtotal + totals.serviceCharge + totals.tax - voucherDiscount);
  }, [totals.subtotal, totals.serviceCharge, totals.tax, voucherDiscount]);

  const handleCashKeyboardClick = (val: string) => {
    if (val === 'C') {
      setCashPaidInput('');
    } else if (val === 'enter') {
      if ((parseFloat(cashPaidInput) || 0) >= effectiveTotal) {
        handleConfirmOrder();
      }
    } else {
      setCashPaidInput(prev => prev + val);
    }
  };

  const handleQuickCash = (amount: number) => {
    setCashPaidInput(amount.toFixed(2));
  };

  const computedChange = useMemo(() => {
    const paid = parseFloat(cashPaidInput) || 0;
    return Math.max(0, paid - effectiveTotal);
  }, [cashPaidInput, effectiveTotal]);

  const handleConfirmOrder = () => {
    if (serviceType !== 'DINE_IN' && paymentMethod === 'CASH') {
      const paid = parseFloat(cashPaidInput) || 0;
      if (paid < effectiveTotal) {
        return;
      }
    }
    const allocationNum = serviceType === 'DINE_IN' ? tableNumber : '';
    onConfirm(
      paymentMethod, 
      serviceType, 
      allocationNum, 
      appliedVoucher?.code || undefined, 
      voucherDiscount || undefined
    );
  };



  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-zinc-950 border border-zinc-850 rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Modal header */}
              <div className="px-5 py-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/40">
                <div className="flex items-center gap-2">
                  <span className="text-base">💳</span>
                  <h3 className="font-extrabold text-sm text-zinc-250">Checkout Panel</h3>
                </div>
                <button 
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-555 hover:text-zinc-355 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-5 flex flex-col gap-5 relative">
                {isSubmitting && (
                  <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-center p-6 gap-3 rounded-b-3xl">
                    <div className="relative flex items-center justify-center">
                      <span className="text-4xl animate-bounce">🍳</span>
                      <Loader2 size={64} className="animate-spin text-pink-500 absolute -inset-3.5 opacity-60" />
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-black text-pink-400 neon-text-pink animate-pulse">Cooking Your Ticket...</h4>
                      <p className="text-[10px] text-zinc-400 mt-1 max-w-[240px] leading-relaxed">
                        Sending order details to the kitchen. Please do not close this panel!
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Service Type Selection */}
                <div className={`grid ${serviceType === 'DINE_IN' ? 'grid-cols-2' : 'grid-cols-1'} gap-4 bg-zinc-900/30 border border-zinc-850 rounded-2xl p-4`}>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Service Type</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setServiceType('DINE_IN')}
                        className={`flex-1 py-1 rounded-xl text-[10px] font-extrabold cursor-pointer border ${
                          serviceType === 'DINE_IN'
                            ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-450 hover:text-zinc-200'
                        }`}
                      >
                        Dine In
                      </button>
                      <button
                        onClick={() => setServiceType('TAKEAWAY')}
                        className={`flex-1 py-1 rounded-xl text-[10px] font-extrabold cursor-pointer border ${
                          serviceType === 'TAKEAWAY'
                            ? 'bg-purple-500/10 border-purple-500 text-purple-400'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-450 hover:text-zinc-200'
                        }`}
                      >
                        Takeaway
                      </button>
                    </div>
                  </div>

                  {serviceType === 'DINE_IN' && (
                    <Select
                      label="Table Allocation"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="!py-1.5 focus:border-cyan-500"
                    >
                      {tables && tables.length > 0 ? (
                        tables.map((t) => (
                          <option key={t.id} value={t.tableNumber}>
                            Table #{t.tableNumber} ({t.seatSize} seats)
                          </option>
                        ))
                      ) : (
                        [...Array(8)].map((_, i) => (
                          <option key={i + 1} value={String(i + 1)}>
                            Table #{i + 1}
                          </option>
                        ))
                      )}
                    </Select>
                  )}
                </div>

                {/* Apply Voucher (Takeaway Only) */}
                {serviceType === 'TAKEAWAY' && (
                  <div className="flex flex-col gap-3 bg-zinc-900/20 border border-zinc-850 rounded-2xl p-4">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Ticket size={10} /> Apply Takeaway Voucher
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={voucherCodeInput}
                        onChange={e => setVoucherCodeInput(e.target.value)}
                        placeholder="Enter code, nya~"
                        disabled={isApplying}
                        className="flex-1 bg-zinc-950 border border-zinc-850 hover:border-zinc-800 text-zinc-250 rounded-xl px-3 py-2 text-xs outline-none focus:border-theme-accent uppercase font-mono"
                      />
                      <button
                        onClick={handleApplyVoucher}
                        disabled={isApplying}
                        className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-xl text-xs font-bold uppercase cursor-pointer active:scale-95 transition-all flex items-center gap-1"
                      >
                        {isApplying ? <Loader2 size={12} className="animate-spin" /> : 'Apply'}
                      </button>
                    </div>
                    {appliedVoucher && (
                      <div className="flex items-center justify-between bg-emerald-950/20 border border-emerald-900/40 rounded-xl px-3 py-1.5 text-xs text-emerald-400">
                        <span className="font-bold">Applied: {appliedVoucher.code} ({appliedVoucher.discountPercentage}% Off)</span>
                        <button 
                          onClick={() => setAppliedVoucher(null)}
                          className="text-emerald-500 hover:text-emerald-300 font-bold ml-2 cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Due bill summary */}
                <div className="flex justify-between items-center bg-zinc-900/50 border border-zinc-855/80 rounded-2xl p-4">
                  <div>
                    <span className="text-[10px] text-zinc-555 font-bold uppercase block">Due Total</span>
                    <span className="text-lg font-black text-pink-500 neon-text-pink">${effectiveTotal.toFixed(2)}</span>
                  </div>
                  
                  {serviceType !== 'DINE_IN' && (
                    <div className="flex gap-1">
                      {(['CASH', 'CARD', 'QR'] as const).map(method => (
                        <button
                          key={method}
                          onClick={() => setPaymentMethod(method)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold capitalize cursor-pointer border ${
                            paymentMethod === method
                              ? 'bg-pink-500/10 border-pink-500 text-pink-400'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-450 hover:text-zinc-200'
                          }`}
                        >
                          {method === 'CASH' ? '💵 Cash' : method === 'CARD' ? '💳 Card' : '📱 CyberPay'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Main panel based on chosen payment method / service type */}
                {serviceType === 'DINE_IN' ? (
                  <div className="py-6 px-4 flex flex-col items-center justify-center text-center gap-4 border border-dashed border-zinc-850 rounded-2xl bg-zinc-900/20 max-h-72 overflow-y-auto w-full">
                    {activeItems.length === 0 ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xl text-cyan-400 animate-pulse">
                          🍽️
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-zinc-300">Assigning to Table #{tableNumber}</h4>
                          <p className="text-[9px] text-zinc-555 mt-0.5 max-w-[250px] leading-relaxed">
                            This order will be sent to the kitchen and tracked under Table #{tableNumber}. Payment will be collected at check-out.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full text-left bg-zinc-950/60 border border-zinc-900 rounded-xl p-3 flex flex-col gap-2.5 font-mono">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] font-black uppercase text-cyan-400 tracking-wider">
                            ⚠️ Table #{tableNumber} has unserved items!
                          </span>
                          <span className="text-[8px] font-bold text-zinc-500 uppercase">
                            Please check if the master has received these items yet:
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 text-[10px] text-zinc-400 max-h-40 overflow-y-auto">
                          {activeItems.map((item, idx) => {
                            const getStatusLabel = (status: string) => {
                              switch (status) {
                                case 'PENDING': return 'Pending 🐾';
                                case 'PREPARING': return 'Preparing 🍳';
                                case 'READY': return 'Ready 🛎️';
                                default: return 'Not served yet ⏱️';
                              }
                            };
                            const getStatusColor = (status: string) => {
                              switch (status) {
                                case 'READY': return 'text-emerald-400';
                                case 'PREPARING': return 'text-amber-400';
                                case 'PENDING': return 'text-zinc-500';
                                default: return 'text-zinc-550';
                              }
                            };
                            return (
                              <div key={idx} className="flex justify-between border-b border-zinc-900/50 pb-1.5 pt-0.5 last:border-b-0 last:pb-0">
                                <span>{item.productName} <span className="text-zinc-500 font-bold">x{item.quantity}</span></span>
                                <span className={`text-[9px] font-extrabold uppercase ${getStatusColor(item.status)}`}>
                                  {getStatusLabel(item.status)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : paymentMethod === 'CASH' ? (
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', 'C'].map((num) => (
                        <button
                          key={num}
                          onClick={() => handleCashKeyboardClick(num)}
                          className="h-12 rounded-xl bg-zinc-900 border border-zinc-855 hover:bg-zinc-850 text-sm font-bold text-zinc-300 cursor-pointer flex items-center justify-center active:scale-95 transition-transform"
                        >
                          {num}
                        </button>
                      ))}
                    </div>

                    <div className="w-full md:w-48 flex flex-col gap-3 justify-between border-t md:border-t-0 md:border-l border-zinc-900 pt-4 md:pt-0 md:pl-4">
                      <div className="bg-zinc-900/80 border border-zinc-850 rounded-xl p-2.5">
                        <span className="text-[9px] text-zinc-500 font-bold uppercase block">Paid Cash</span>
                        <span className="text-base font-black text-cyan-400 font-mono">
                          ${parseFloat(cashPaidInput || '0').toFixed(2)}
                        </span>
                      </div>

                      <div className="bg-zinc-900/80 border border-zinc-850 rounded-xl p-2.5">
                        <span className="text-[9px] text-zinc-500 font-bold uppercase block">Change Due</span>
                        <span className={`text-base font-black font-mono ${computedChange > 0 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                          ${computedChange.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <span className="text-[8px] text-zinc-500 font-bold uppercase block">Quick Tender</span>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[10, 20, 50, 100].map(val => (
                            <button
                              key={val}
                              onClick={() => handleQuickCash(val)}
                              className="py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-[10px] font-bold text-zinc-300 hover:text-white cursor-pointer transition-colors"
                            >
                              ${val}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : paymentMethod === 'CARD' ? (
                  <div className="py-8 flex flex-col items-center justify-center text-center gap-4 border border-dashed border-zinc-855 rounded-2xl bg-zinc-900/20">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-2xl text-cyan-400 animate-pulse">
                        <CreditCard size={28} />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-300">Awaiting Card Insertion / Tap</h4>
                      <p className="text-[10px] text-zinc-555 mt-1 max-w-[250px]">
                        Please ask customer to tap card or insert into NFC terminal reader.
                      </p>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mt-1" />
                  </div>
                ) : (
                  <div className="py-6 flex flex-col items-center justify-center text-center gap-3 border border-dashed border-zinc-855 rounded-2xl bg-zinc-900/20">
                    <div className="w-32 h-32 bg-white rounded-xl p-2 flex items-center justify-center border-4 border-pink-500/80 shadow-[0_0_15px_rgba(255,42,116,0.3)]">
                      <div className="w-full h-full halftone-accent text-zinc-950 font-bold flex items-center justify-center text-xs">
                        QR CODE
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-300">Scan Cyber QR code</h4>
                      <p className="text-[10px] text-zinc-555 mt-1">
                        Scan with CyberPay, WeChat Pay, or Line Pay wallets.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-5 py-4 bg-zinc-950 border-t border-zinc-900 flex gap-3">
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900 hover:bg-zinc-855 text-zinc-450 hover:text-zinc-200 text-xs font-semibold cursor-pointer text-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmOrder}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold text-center uppercase tracking-wide cursor-pointer transition-all ${
                    isSubmitting || (serviceType !== 'DINE_IN' && paymentMethod === 'CASH' && (parseFloat(cashPaidInput) || 0) < effectiveTotal)
                      ? 'bg-zinc-900 border border-theme-border text-zinc-655 cursor-not-allowed opacity-50'
                      : 'bg-theme-btn-pink hover:bg-theme-btn-pink-hover text-white shadow-lg active:scale-95'
                  }`}
                  disabled={isSubmitting || (serviceType !== 'DINE_IN' && paymentMethod === 'CASH' && (parseFloat(cashPaidInput) || 0) < effectiveTotal)}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <Loader2 size={12} className="animate-spin" />
                      Processing...
                    </span>
                  ) : serviceType === 'DINE_IN' ? (
                    'Assign to Table ✔'
                  ) : (
                    'Confirm Order ✔️'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ErrorModal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        message={errorModalMessage}
        title="Invalid Coupon"
      />
    </>
  );
}
