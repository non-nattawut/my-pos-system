'use client';

import React from 'react';
import { Ticket, Edit3, Trash2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Voucher } from '@/services/api-vouchers';

interface VoucherCardProps {
  voucher: Voucher;
  onEdit: (voucher: Voucher) => void;
  onDelete: (id: string) => void;
}

export function VoucherCard({ voucher, onEdit, onDelete }: Readonly<VoucherCardProps>) {
  return (
    <motion.div
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
          <span className="text-base font-black text-zinc-100 tracking-wider font-mono">{voucher.code}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(voucher)}
            className="p-1.5 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-855 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
            title="Edit"
          >
            <Edit3 size={11} />
          </button>
          <button
            onClick={() => onDelete(voucher.id)}
            className="p-1.5 rounded-xl bg-zinc-900/50 hover:bg-rose-950/20 border border-zinc-855 hover:border-rose-900/40 text-zinc-400 hover:text-rose-400 transition-all cursor-pointer"
            title="Delete"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-baseline z-10 mt-2">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-theme-accent">{voucher.discountPercentage}</span>
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">% OFF</span>
        </div>

        {/* Usage stats indicator */}
        <div className="flex flex-col items-end">
          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider">USAGE LIMIT</span>
          <span className="text-xs font-black text-zinc-300 font-mono">
            {voucher.usedCount} / {voucher.maxUses}
          </span>
        </div>
      </div>

      {voucher.createdAt && (
        <div className="mt-auto border-t border-zinc-900/50 pt-3 flex justify-between items-center text-[8px] text-zinc-500 font-bold uppercase tracking-wider z-10">
          <span>Created By: {voucher.createdBy || 'SYSTEM'}</span>
          <span>{new Date(voucher.createdAt).toLocaleDateString()}</span>
        </div>
      )}
    </motion.div>
  );
}
