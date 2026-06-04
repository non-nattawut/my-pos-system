import React from 'react';
import { Clock, Users, Printer, Trash2 } from 'lucide-react';
import { TableResponse } from '@/types';

interface TableCardProps {
  table: TableResponse;
  onClick: () => void;
  onPrintReceipt: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
}

export default function TableCard({ table, onClick, onPrintReceipt, onDelete, isAdmin = false }: TableCardProps) {
  const orders = table.activeOrders || [];
  const isOccupied = table.occupied || orders.length > 0;
  const accumulatedBill = orders.reduce((sum, o) => sum + o.total, 0);
  const totalItemsCount = orders.reduce((sum, o) => sum + (o.items || []).reduce((acc, i) => acc + (i.quantity || 0), 0), 0);

  return (
    <div
      onClick={() => {
        if (isOccupied) onClick();
      }}
      className={`bg-theme-card border rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between relative group ${
        isOccupied
          ? 'border-theme-accent shadow-md shadow-pink-500/5 cursor-pointer hover:shadow-lg hover:border-theme-accent/80'
          : 'border-zinc-850 opacity-60'
      }`}
    >
      {/* Admin table deletion button */}
      {isAdmin && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!isOccupied && onDelete) onDelete();
          }}
          disabled={isOccupied}
          className={`absolute top-3 right-3 p-1.5 rounded-xl border transition-all duration-200 ${
            isOccupied
              ? 'border-zinc-850/30 text-zinc-700 bg-zinc-900/30 cursor-not-allowed opacity-30'
              : 'border-rose-900/30 text-rose-500 hover:text-rose-450 hover:bg-rose-500/10 bg-zinc-900/50 cursor-pointer active:scale-95'
          }`}
          title={isOccupied ? "Cannot delete table with active orders" : "Delete table configuration"}
        >
          <Trash2 size={12} />
        </button>
      )}

      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-black uppercase text-zinc-350 pr-8">
            Table #{table.tableNumber.padStart(2, '0')}
          </span>
          {!isAdmin && (
            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-lg border ${
              isOccupied
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse'
                : 'bg-zinc-900 text-zinc-500 border-zinc-800'
            }`}>
              {isOccupied ? 'Occupied 💖' : 'Empty 💤'}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5 text-[10px]">
            <Users size={11} className="text-zinc-555" />
            <span>{table.seatSize} Seats capacity</span>
          </div>
          {isOccupied ? (
            <>
              <div className="flex items-center gap-1.5 text-[10px]">
                <Clock size={11} className="text-zinc-555" />
                <span>{orders.length} sub-orders placed</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px]">
                <Users size={11} className="text-zinc-555" />
                <span>{totalItemsCount} items accumulated</span>
              </div>
            </>
          ) : (
            <div className="py-2 text-[10px] text-zinc-650 italic">
              Ready for next customers, nya~
            </div>
          )}
        </div>
      </div>

      {isOccupied && (
        <div className="px-4 py-3 bg-theme-panel border-t border-theme-border flex justify-between items-center mt-auto">
          <div className="flex flex-col">
            <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">Accumulated Bill</span>
            <span className="text-xs font-black text-theme-accent font-mono">${accumulatedBill.toFixed(2)}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrintReceipt();
            }}
            className="bg-theme-bg border border-theme-border text-zinc-300 hover:border-theme-accent hover:text-white rounded-xl p-1.5 transition-colors cursor-pointer"
            title="Print Combined Receipt"
          >
            <Printer size={13} />
          </button>
        </div>
      )}
    </div>
  );
}

