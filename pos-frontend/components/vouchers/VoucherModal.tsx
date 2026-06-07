'use client';

import React, { useState, useEffect } from 'react';
import { Ticket, Percent, Hash, Loader2, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Voucher, createVoucher, updateVoucher } from '@/services/api-vouchers';
import { ErrorModal } from '@/components/ui/error/ErrorModal';
import { useErrorState } from '@/hooks/useErrorState';

interface VoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingVoucher: Voucher | null;
  onSaveSuccess: () => void;
}

export function VoucherModal({
  isOpen,
  onClose,
  editingVoucher,
  onSaveSuccess,
}: VoucherModalProps) {
  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState<number>(10);
  const [maxUses, setMaxUses] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(false);

  const {
    errorModalOpen,
    setErrorModalOpen,
    errorModalMessage,
    showError,
  } = useErrorState();

  useEffect(() => {
    if (isOpen && editingVoucher) {
      setCode(editingVoucher.code);
      setDiscountPercentage(editingVoucher.discountPercentage);
      setMaxUses(editingVoucher.maxUses || 10);
    } else {
      setCode('');
      setDiscountPercentage(10);
      setMaxUses(10);
    }
  }, [isOpen, editingVoucher]);

  const isFormInvalid = !code.trim() || discountPercentage === undefined || discountPercentage === null || maxUses === undefined || maxUses === null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      showError('Code is required, nya!');
      return;
    }
    if (discountPercentage < 0 || discountPercentage > 100) {
      showError('Discount percentage must be between 0 and 100, master!');
      return;
    }
    if (maxUses < 1) {
      showError('Max uses must be at least 1, nya!');
      return;
    }

    setIsLoading(true);
    try {
      if (editingVoucher) {
        // Edit Mode
        const res = await updateVoucher(editingVoucher.id, {
          code: code.trim().toUpperCase(),
          discountPercentage,
          maxUses,
        });
        if (res.success) {
          onSaveSuccess();
          onClose();
        } else {
          showError(res.message || 'Failed to update voucher, nya.');
        }
      } else {
        // Create Mode
        const res = await createVoucher({
          code: code.trim().toUpperCase(),
          discountPercentage,
          maxUses,
        });
        if (res.success) {
          onSaveSuccess();
          onClose();
        } else {
          showError(res.message || 'Failed to create voucher, nya.');
        }
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Something went wrong, nya.';
      showError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-zinc-950 border border-zinc-855 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 font-mono relative overflow-hidden"
            >
              <div className="flex justify-between items-center pb-3 border-b border-zinc-900">
                <span className="text-xs font-black uppercase text-zinc-300 tracking-wider">
                  {editingVoucher ? 'Modify Voucher' : 'Create Voucher, nya!'}
                </span>
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300 cursor-pointer disabled:opacity-50"
                >
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black uppercase text-zinc-500 tracking-wider pl-1 flex items-center gap-1">
                    <Ticket size={10} /> Voucher Code <span className="text-pink-500 font-bold ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="e.g. NEKO20"
                    disabled={isLoading}
                    className="bg-zinc-900 border border-zinc-855 text-zinc-200 rounded-2xl px-3.5 py-2.5 text-xs outline-none focus:border-theme-accent uppercase tracking-wider"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black uppercase text-zinc-500 tracking-wider pl-1 flex items-center gap-1">
                    <Percent size={10} /> Discount Percentage <span className="text-pink-500 font-bold ml-0.5">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      value={discountPercentage}
                      onChange={e => setDiscountPercentage(parseInt(e.target.value, 10) || 0)}
                      disabled={isLoading}
                      className="w-full bg-zinc-900 border border-zinc-855 text-zinc-200 rounded-2xl px-3.5 py-2.5 text-xs outline-none focus:border-theme-accent font-mono"
                    />
                    <span className="absolute right-3.5 text-xs font-bold text-zinc-500">%</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black uppercase text-zinc-500 tracking-wider pl-1 flex items-center gap-1">
                    <Hash size={10} /> Maximum Uses Limit <span className="text-pink-500 font-bold ml-0.5">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={maxUses}
                    onChange={e => setMaxUses(parseInt(e.target.value, 10) || 1)}
                    disabled={isLoading}
                    className="w-full bg-zinc-900 border border-zinc-855 text-zinc-200 rounded-2xl px-3.5 py-2.5 text-xs outline-none focus:border-theme-accent font-mono"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-444 hover:text-zinc-222 text-xs font-bold uppercase rounded-2xl cursor-pointer active:scale-95 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || isFormInvalid}
                    className="flex-2 flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white text-xs font-black uppercase rounded-2xl cursor-pointer active:scale-95 transition-all shadow-md shadow-pink-900/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                  >
                    {isLoading ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Save size={13} />
                    )}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ErrorModal
        isOpen={errorModalOpen}
        message={errorModalMessage}
        onClose={() => setErrorModalOpen(false)}
      />
    </>
  );
}
