import React from 'react';

interface StockTableHeaderProps {
  isAdmin?: boolean;
  showDeleted?: boolean;
}

export function StockTableHeader({ isAdmin, showDeleted }: StockTableHeaderProps) {
  return (
    <thead className="bg-zinc-950/80 backdrop-blur sticky top-0 z-10">
      <tr>
        <th scope="col" className="px-5 py-3.5 text-left text-[10px] font-black text-zinc-500 uppercase tracking-wider">Item Details</th>
        <th scope="col" className="px-5 py-3.5 text-left text-[10px] font-black text-zinc-500 uppercase tracking-wider">Category</th>
        <th scope="col" className="px-5 py-3.5 text-left text-[10px] font-black text-zinc-500 uppercase tracking-wider">Price</th>
        {isAdmin && (
          <th scope="col" className="px-5 py-3.5 text-left text-[10px] font-black text-zinc-500 uppercase tracking-wider">Capital Price</th>
        )}
        <th scope="col" className="px-5 py-3.5 text-left text-[10px] font-black text-zinc-500 uppercase tracking-wider">Status</th>
        <th scope="col" className="px-5 py-3.5 text-left text-[10px] font-black text-zinc-500 uppercase tracking-wider">Quantity Control</th>
        <th scope="col" className="px-5 py-3.5 text-left text-[10px] font-black text-zinc-500 uppercase tracking-wider">Presets</th>
        {isAdmin && (
          <th scope="col" className="px-5 py-3.5 text-left text-[10px] font-black text-zinc-500 uppercase tracking-wider">Actions</th>
        )}
      </tr>
    </thead>
  );
}
