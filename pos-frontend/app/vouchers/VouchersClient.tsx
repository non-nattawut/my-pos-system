'use client';

import React, { useState } from 'react';
import { Ticket, Plus, Edit3, Trash2, Percent, Save, X, Loader2, Sparkles, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthUser } from '@/types';
import { Voucher, createVoucher, updateVoucher, deleteVoucher, fetchVouchers } from '@/services/api-vouchers';
import { ErrorModal } from '@/components/ui/error/ErrorModal';
import { useErrorState } from '@/hooks/useErrorState';
import { ScrollArea } from '@/components/ui/ScrollArea';

interface VouchersClientProps {
  initialVouchers: Voucher[];
  authUser: AuthUser;
}

export default function VouchersClient({ initialVouchers, authUser }: VouchersClientProps) {
  const [vouchers, setVouchers] = useState<Voucher[]>(initialVouchers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);

  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState<number>(10);
  const [maxUses, setMaxUses] = useState<number>(10);

  const isFormInvalid = !code.trim() || discountPercentage === undefined || discountPercentage === null || maxUses === undefined || maxUses === null;

  const [isLoading, setIsLoading] = useState(false);
  const {
    errorModalOpen,
    setErrorModalOpen,
    errorModalMessage,
    setErrorModalMessage,
    showError,
  } = useErrorState();

  const openAddModal = () => {
    setEditingVoucher(null);
    setCode('');
    setDiscountPercentage(10);
    setMaxUses(10);
    setIsModalOpen(true);
  };

  const openEditModal = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setCode(voucher.code);
    setDiscountPercentage(voucher.discountPercentage);
    setMaxUses(voucher.maxUses || 10);
    setIsModalOpen(true);
  };

  const reloadVouchers = async () => {
    try {
      const res = await fetchVouchers();
      if (res.success && res.data) {
        setVouchers(res.data);
      }
    } catch (err) {
      console.error('Failed to reload vouchers:', err);
    }
  };

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
          setIsModalOpen(false);
          await reloadVouchers();
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
          setIsModalOpen(false);
          await reloadVouchers();
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this voucher, master? 🐾')) {
      return;
    }
    try {
      const res = await deleteVoucher(id);
      if (res.success) {
        await reloadVouchers();
      } else {
        showError(res.message || 'Failed to delete voucher.');
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to delete voucher.';
      showError(errMsg);
    }
  };



  return (
    <div className="w-full h-full absolute inset-0 bg-theme-bg flex flex-col overflow-hidden select-none font-mono">
      {/* Title bar */}
      <header className="h-16 px-6 border-b border-theme-border bg-theme-panel backdrop-blur-md flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <Ticket className="text-theme-accent" size={20} />
          <h1 className="text-sm font-black text-zinc-200 tracking-wider uppercase">Voucher Dispatcher</h1>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white text-xs font-black uppercase rounded-2xl cursor-pointer active:scale-95 transition-all shadow-md shadow-pink-900/10"
        >
          <Plus size={13} />
          <span>New Voucher</span>
        </button>
      </header>

      {/* Main Content Area */}
      <ScrollArea className="flex-1 min-h-0 px-6 pb-6 pt-4" trackTransparent>
        {vouchers.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <span className="text-4xl animate-bounce">🎟️</span>
            <h4 className="font-bold text-zinc-500 mt-4 text-xs">No active vouchers found, nya~</h4>
            <p className="text-[10px] text-zinc-655 mt-1 max-w-[240px] uppercase">Create one to offer lovely discounts to cafe masters!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-6">
            {vouchers.map(v => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden group border border-theme-border/60 bg-zinc-950/40 rounded-3xl p-5 flex flex-col gap-4 hover:border-theme-accent transition-all duration-300 shadow-md hover:shadow-theme-accent/5"
              >
                {/* Background Sparkle Effect */}
                <div className="absolute -right-6 -bottom-6 text-zinc-900/20 group-hover:text-theme-accent/5 transition-colors pointer-events-none">
                  <Ticket size={120} />
                </div>

                <div className="flex justify-between items-start z-10">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                      <Sparkles size={9} className="text-theme-accent-sec" /> DISCOUNT CODE
                    </span>
                    <span className="text-base font-black text-zinc-100 tracking-wider font-mono">{v.code}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(v)}
                      className="p-1.5 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-855 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 size={11} />
                    </button>
                    <button
                      onClick={() => handleDelete(v.id)}
                      className="p-1.5 rounded-xl bg-zinc-900/50 hover:bg-rose-950/20 border border-zinc-855 hover:border-rose-900/40 text-zinc-400 hover:text-rose-400 transition-all cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-baseline z-10 mt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-theme-accent">{v.discountPercentage}</span>
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">% OFF</span>
                  </div>

                  {/* Usage stats indicator */}
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider">USAGE LIMIT</span>
                    <span className="text-xs font-black text-zinc-300 font-mono">
                      {v.usedCount} / {v.maxUses}
                    </span>
                  </div>
                </div>

                {v.createdAt && (
                  <div className="mt-auto border-t border-zinc-900/50 pt-3 flex justify-between items-center text-[8px] text-zinc-500 font-bold uppercase tracking-wider z-10">
                    <span>Created By: {v.createdBy || 'SYSTEM'}</span>
                    <span>{new Date(v.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
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
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300 cursor-pointer"
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
                    onClick={() => setIsModalOpen(false)}
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
    </div>
  );
}
