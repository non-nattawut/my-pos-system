import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2 } from 'lucide-react';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  subTitle?: string;
  message?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  subTitle = 'System Verification',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
  isLoading = false,
}: ConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-850 rounded-3xl p-6 flex flex-col gap-4 shadow-2xl animate-scale-up font-mono">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
          <div>
            <h3 className="font-extrabold text-sm text-zinc-200">{title}</h3>
            <span className="text-[9px] text-zinc-500 font-bold uppercase">{subTitle}</span>
          </div>
          <button onClick={onClose} disabled={isLoading} className="text-zinc-500 hover:text-zinc-300 cursor-pointer disabled:opacity-50">
            <X size={15} />
          </button>
        </div>

        <div className="text-xs text-zinc-400 py-2 leading-relaxed">
          {message}
        </div>

        <div className="flex gap-2.5 mt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-bold uppercase rounded-xl cursor-pointer active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-full py-2.5 text-white text-xs font-black uppercase rounded-xl cursor-pointer active:scale-95 transition-all shadow-md flex items-center justify-center gap-1.5 ${
              isDanger
                ? 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-450 hover:to-red-500 shadow-rose-900/10'
                : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 shadow-pink-900/10'
            }`}
          >
            {isLoading ? <Loader2 size={12} className="animate-spin" /> : confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
