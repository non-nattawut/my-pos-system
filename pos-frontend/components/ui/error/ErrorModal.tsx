'use client';

import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
}

export function ErrorModal({
  isOpen,
  onClose,
  title = 'Operation Failed',
  message,
}: ErrorModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-sm bg-zinc-950 border border-red-500/20 rounded-3xl overflow-hidden shadow-2xl relative"
          >
            {/* Red Neon Glow Effect */}
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Modal header */}
            <div className="px-5 py-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/20">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle size={16} />
                <h3 className="font-extrabold text-xs uppercase tracking-wide">{title}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-555 hover:text-zinc-355 cursor-pointer transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Content body */}
            <div className="p-6 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-2xl text-red-400">
                😿
              </div>
              <div>
                <p className="text-xs text-zinc-300 font-medium leading-relaxed max-w-[280px]">
                  {message}
                </p>
              </div>
            </div>

            <div className="px-5 py-4 bg-zinc-950 border-t border-zinc-900 flex">
              <button
                onClick={onClose}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold uppercase tracking-wider cursor-pointer shadow-lg active:scale-95 transition-all text-center text-xs"
                style={{ color: '#ffffff' }}
              >
                Understood ✔
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
