'use client';

import React from 'react';
import { Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReceiptResponse } from '@/types';
import { formatDateTimeSpace } from '@/utils/date';

interface ReceiptModalProps {
  isOpen: boolean;
  receipt: ReceiptResponse | null;
  onClose: () => void;
}

export function ReceiptModal({
  isOpen,
  receipt,
  onClose
}: ReceiptModalProps) {
  if (!receipt) return null;

  const orders = receipt.orders || [];
  // Accumulate items from all nested orders in the receipt
  const itemMap: Record<string, any> = {};
  orders.forEach(order => {
    (order.items || []).forEach(item => {
      const key = item.product?.id || '';
      if (!key) return;
      if (itemMap[key]) {
        itemMap[key].quantity = (itemMap[key].quantity || 0) + (item.quantity || 0);
      } else {
        itemMap[key] = { ...item };
      }
    });
  });
  const accumulatedItems = Object.values(itemMap);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-start justify-center z-50 p-4 overflow-y-auto">
          <style dangerouslySetInnerHTML={{__html: `
            #print-receipt-card,
            #print-receipt-card span,
            #print-receipt-card p,
            #print-receipt-card h3,
            #print-receipt-card div {
              color: #18181b !important;
            }
            #print-receipt-card {
              background-color: #ffffff !important;
            }
            #print-receipt-card .text-emerald-600 {
              color: #16a34a !important;
            }
            #print-receipt-card button {
              background-color: #18181b !important;
            }
            #print-receipt-card button,
            #print-receipt-card button * {
              color: #ffffff !important;
            }
            #print-receipt-card button:last-child {
              background-color: transparent !important;
              border-color: #d1d5db !important;
            }
            #print-receipt-card button:last-child,
            #print-receipt-card button:last-child * {
              color: #374151 !important;
            }
          `}} />
          <motion.div 
            id="print-receipt-card"
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="w-full max-w-sm bg-white text-zinc-900 border border-zinc-200 rounded-3xl p-5 shadow-2xl font-mono relative overflow-hidden my-auto"
          >
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-b from-zinc-200 to-transparent flex" />
            
            <div className="text-center pt-2 pb-4">
              <span className="text-2xl">🐾</span>
              <h3 className="font-extrabold text-sm tracking-wide mt-1 uppercase text-zinc-950">NEKOBITE CAFE</h3>
              <p className="text-[10px] text-zinc-550">12 Cyber-Avenue, Akihabara Sector</p>
              <p className="text-[9px] text-zinc-400 mt-0.5">TEL: (03)-3254-XXXX</p>
            </div>

            <div className="text-zinc-400 my-2 select-none overflow-hidden whitespace-nowrap text-center text-[10px]">- - - - - - - - - - - - - - - - - - - -</div>

            <div className="flex flex-col gap-1 text-[9px] text-zinc-655">
              <div className="flex justify-between">
                <span>INVOICE:</span>
                <span className="font-bold">{receipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>CASHIER:</span>
                <span>{receipt.maidName || 'Maid Staff'}</span>
              </div>
              {receipt.serviceType && (
                <div className="flex justify-between">
                  <span>SERVICE:</span>
                  <span className="uppercase font-bold">
                    {receipt.serviceType === 'DINE_IN' ? `Dine In (Table #${receipt.tableNumber})` : `Takeaway (Queue #${receipt.receiptNumber.split('-').pop()})`}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>DATE:</span>
                <span>{formatDateTimeSpace(receipt.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>METHOD:</span>
                <span className="uppercase font-bold">{receipt.paymentMethod}</span>
              </div>
            </div>

            <div className="text-zinc-400 my-3 select-none overflow-hidden whitespace-nowrap text-center text-[10px]">- - - - - - - - - - - - - - - - - - - -</div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between font-bold text-[10px] text-zinc-800">
                <span>Menu Item</span>
                <span>Total</span>
              </div>
              
              {accumulatedItems.map((item, idx) => {
                const productName = item.product?.name || 'Unknown Item';
                const itemPrice = item.product?.price || 0;
                const quantity = item.quantity || 0;
                return (
                  <div key={idx} className="flex flex-col text-[10px]">
                    <div className="flex justify-between items-start text-zinc-855">
                      <span>
                        {productName} x{quantity}
                      </span>
                      <span>
                        ${(itemPrice * quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-zinc-400 my-3 select-none overflow-hidden whitespace-nowrap text-center text-[10px]">- - - - - - - - - - - - - - - - - - - -</div>

            <div className="flex flex-col gap-1 text-[10px] text-zinc-855">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${receipt.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee (10%)</span>
                <span>${receipt.serviceCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Sales Tax (7%)</span>
                <span>${receipt.tax.toFixed(2)}</span>
              </div>
              {receipt.discount > 0 && (
                <div className="flex justify-between font-bold text-emerald-600">
                  <span>Discount</span>
                  <span>-${receipt.discount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="text-zinc-400 my-2 select-none overflow-hidden whitespace-nowrap text-center text-[10px]">- - - - - - - - - - - - - - - - - - - -</div>

              <div className="flex justify-between font-black text-xs text-zinc-950">
                <span>BILL TOTAL</span>
                <span>${receipt.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="text-center mt-6 mb-2">
              <p className="text-[10px] font-bold text-zinc-855">Thank you for visiting, Master! 💖</p>
              <p className="text-[8px] text-zinc-400 mt-1 uppercase tracking-widest">🐾 MOE MOE KYUN! 🐾</p>
            </div>

            <div className="mt-6 flex gap-2 print:hidden">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer size={13} />
                Print Receipt
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-zinc-350 hover:bg-zinc-100 rounded-xl text-xs font-bold text-zinc-700 cursor-pointer"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
