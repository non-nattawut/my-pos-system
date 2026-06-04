import React from 'react';

export function StockStats({
  totalItems,
  lowStockCount,
  outOfStockCount,
}: {
  totalItems: number;
  lowStockCount: number;
  outOfStockCount: number;
}) {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
      {/* Total Items */}
      <div className="bg-theme-card border border-theme-border rounded-3xl p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-zinc-900/50 flex items-center justify-center text-2xl">📦</div>
        <div>
          <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Total Items Listed</h4>
          <p className="text-xl font-black text-zinc-200">{totalItems}</p>
        </div>
      </div>

      {/* Low Stock */}
      <div className={`bg-theme-card border rounded-3xl p-4 flex items-center gap-4 transition-colors ${
        lowStockCount > 0 ? 'border-amber-500/30 bg-amber-500/5' : 'border-theme-border'
      }`}>
        <div className="w-12 h-12 rounded-2xl bg-zinc-900/50 flex items-center justify-center text-2xl">⚠️</div>
        <div>
          <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Low Stock (On This Page)</h4>
          <p className={`text-xl font-black ${lowStockCount > 0 ? 'text-amber-400' : 'text-zinc-200'}`}>
            {lowStockCount}
          </p>
        </div>
      </div>

      {/* Out of Stock */}
      <div className={`bg-theme-card border rounded-3xl p-4 flex items-center gap-4 transition-colors ${
        outOfStockCount > 0 ? 'border-rose-500/30 bg-rose-500/5 animate-pulse-subtle' : 'border-theme-border'
      }`}>
        <div className="w-12 h-12 rounded-2xl bg-zinc-900/50 flex items-center justify-center text-2xl">❌</div>
        <div>
          <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Out of Stock (On Page)</h4>
          <p className={`text-xl font-black ${outOfStockCount > 0 ? 'text-rose-400' : 'text-zinc-200'}`}>
            {outOfStockCount}
          </p>
        </div>
      </div>
    </div>
  );
}
