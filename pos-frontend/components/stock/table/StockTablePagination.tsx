import React from 'react';
import { Select } from '@/components/ui/Select';

interface StockTablePaginationProps {
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLoading: boolean;
  setPageSize: (v: number) => void;
  setCurrentPage: (v: number) => void;
}

export function StockTablePagination({
  currentPage,
  pageSize,
  totalElements,
  totalPages,
  isLoading,
  setPageSize,
  setCurrentPage,
}: StockTablePaginationProps) {
  return (
    <div className="px-5 py-3 flex items-center justify-between border-t border-theme-border/60 bg-zinc-950/40 shrink-0 font-mono">
      <div className="flex items-center gap-3.5">
        <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
          Showing {totalElements === 0 ? 0 : currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} entries
        </div>
        <span className="text-zinc-800 text-xs">|</span>
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
          <span>Show:</span>
          <Select
            value={pageSize}
            onChange={e => {
              setPageSize(parseInt(e.target.value, 10));
              setCurrentPage(0);
            }}
            containerClassName="w-16"
            className="!py-0.5 !px-2 rounded-lg text-[10px] h-6"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </Select>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0 || isLoading}
          className="px-3 py-1.5 rounded-xl border border-theme-border bg-theme-badge text-theme-badge-text text-[10px] font-black uppercase hover:bg-theme-tab-active/40 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
        >
          Prev
        </button>
        <span className="text-[10px] font-black uppercase text-zinc-300 px-1 select-none">
          Page {currentPage + 1} of {totalPages || 1}
        </span>
        <button
          onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage >= totalPages - 1 || isLoading}
          className="px-3 py-1.5 rounded-xl border border-theme-border bg-theme-badge text-theme-badge-text text-[10px] font-black uppercase hover:bg-theme-tab-active/40 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );
}
