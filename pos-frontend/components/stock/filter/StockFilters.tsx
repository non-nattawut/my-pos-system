import React from 'react';
import { Search, RotateCcw, SlidersHorizontal } from 'lucide-react';

interface StockFiltersProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  minPrice: string;
  setMinPrice: (v: string) => void;
  maxPrice: string;
  setMaxPrice: (v: string) => void;
  minStock: string;
  setMinStock: (v: string) => void;
  maxStock: string;
  setMaxStock: (v: string) => void;
  onApply: (e: React.FormEvent) => void;
  onReset: () => void;
}

export function StockFilters({
  searchQuery, setSearchQuery,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  minStock, setMinStock,
  maxStock, setMaxStock,
  onApply, onReset,
}: Readonly<StockFiltersProps>) {
  return (
    <form
      onSubmit={onApply}
      className="mx-6 mb-4 p-4 rounded-3xl bg-zinc-950/80 border border-theme-border/60 shrink-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 items-end font-mono"
    >
      {/* Search Name */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider pl-1">Search Name</span>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-555">
            <Search size={12} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Product name..."
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl py-1.5 pl-8 pr-3 text-xs outline-none focus:border-theme-accent placeholder:text-zinc-650"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider pl-1">Min Price ($)</span>
        <input type="number" min="0" step="0.01" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="0.00"
          className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-theme-accent" />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider pl-1">Max Price ($)</span>
        <input type="number" min="0" step="0.01" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="99.99"
          className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-theme-accent" />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider pl-1">Min Stock</span>
        <input type="number" min="0" value={minStock} onChange={e => setMinStock(e.target.value)} placeholder="0"
          className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-theme-accent" />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider pl-1">Max Stock</span>
        <input type="number" min="0" value={maxStock} onChange={e => setMaxStock(e.target.value)} placeholder="100"
          className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-theme-accent" />
      </div>

      <div className="flex items-center justify-end gap-2">
        <button type="button" onClick={onReset}
          className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-black uppercase text-zinc-400 hover:text-zinc-200 cursor-pointer active:scale-95 transition-all w-full justify-center">
          <RotateCcw size={12} /><span>Reset</span>
        </button>
        <button type="submit"
          className="flex items-center gap-1.5 px-4 py-2 bg-theme-tab-active border border-theme-tab-active-border text-theme-tab-active-text text-xs font-black uppercase rounded-xl cursor-pointer active:scale-95 transition-all w-full justify-center">
          <SlidersHorizontal size={12} /><span>Apply</span>
        </button>
      </div>
    </form>
  );
}
