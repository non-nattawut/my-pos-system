'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

interface StockModalWrapperProps {
  children: React.ReactNode;
}

export function StockModalWrapper({ children }: Readonly<StockModalWrapperProps>) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleDismiss = () => {
    router.back();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleDismiss();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[80] flex items-center justify-center p-4 md:p-6"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-6xl h-[85vh] bg-zinc-950 border border-zinc-850 rounded-3xl overflow-hidden flex flex-col shadow-2xl relative animate-scale-up">
        {/* Floating Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 z-[90] w-8 h-8 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-200 cursor-pointer transition-all active:scale-95"
          title="Close modal"
        >
          <X size={16} />
        </button>
        <div className="w-full h-full relative overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
