import React from 'react';
import { Save } from 'lucide-react';

interface StockChangesBarProps {
  pendingCount: number;
  onDiscard: () => void;
  onSaveClick: () => void;
}

export function StockChangesBar({ pendingCount, onDiscard, onSaveClick }: StockChangesBarProps) {
  if (pendingCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-theme-panel border border-theme-accent/60 backdrop-blur-md px-6 py-4 rounded-3xl shadow-xl flex items-center gap-6 z-30 animate-slide-in">
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase text-theme-accent tracking-wider">Unsaved Inventory Changes</span>
        <span className="text-xs text-theme-accent-sec font-black mt-0.5">
          {pendingCount === 1 ? '1 product modified' : `${pendingCount} products modified`}
        </span>
      </div>
      <div className="flex gap-2 font-mono">
        <button
          onClick={onDiscard}
          className="px-3 py-1.5 rounded-xl border border-theme-border bg-theme-bg text-theme-accent-sec/80 hover:text-theme-accent-sec text-[11px] font-bold transition-all active:scale-95 cursor-pointer"
        >
          Discard
        </button>
        <button
          onClick={onSaveClick}
          className="px-4 py-1.5 rounded-xl bg-theme-tab-active border border-theme-tab-active-border text-theme-tab-active-text text-[11px] font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
        >
          <Save size={12} />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
}
