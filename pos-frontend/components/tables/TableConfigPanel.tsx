'use client';

import React, { useState } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { TableResponse } from '@/types';
import { createTable, fetchTables } from '@/services/api-tables';

interface TableConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  tablesList: TableResponse[];
  onSaveSuccess: (updatedTables: TableResponse[]) => void;
  showError: (message: string) => void;
}

export default function TableConfigPanel({
  isOpen,
  onClose,
  tablesList,
  onSaveSuccess,
  showError,
}: TableConfigPanelProps) {
  const [newTableNum, setNewTableNum] = useState('');
  const [newSeatSize, setNewSeatSize] = useState('4');
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const isFormInvalid = !newTableNum.trim() || !newSeatSize.trim();

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const trimmedNum = newTableNum.trim();
    if (!trimmedNum) {
      setErrorMessage('Enter a table number, nya!');
      return;
    }

    const seats = Number.parseInt(newSeatSize, 10);
    if (Number.isNaN(seats) || seats <= 0) {
      setErrorMessage('Seats must be a positive number!');
      return;
    }

    // Check if table already exists
    if (tablesList.some(t => t.tableNumber.toLowerCase() === trimmedNum.toLowerCase())) {
      setErrorMessage(`Table ${trimmedNum} already exists!`);
      return;
    }

    setIsCreating(true);
    try {
      const res = await createTable({ tableNumber: trimmedNum, seatSize: seats });
      if (res.success) {
        // reload list
        const tablesRes = await fetchTables();
        if (tablesRes.success) {
          onSaveSuccess(tablesRes.data);
        }
        setNewTableNum('');
        setNewSeatSize('4');
        onClose();
      } else {
        setErrorMessage(res.message || 'Failed to create table');
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to add table configuration.';
      setErrorMessage(errMsg);
      showError(errMsg);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="mx-6 mt-4 p-4 rounded-3xl bg-zinc-950/80 border border-theme-border/60 shrink-0 flex flex-col gap-3 font-mono">
      <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
        <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Configure Tables</span>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-zinc-300"
        >
          <X size={14} />
        </button>
      </div>

      <form onSubmit={handleAddTable} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider pl-1">
            Table Number <span className="text-pink-500 font-bold ml-0.5">*</span>
          </span>
          <input
            type="text"
            value={newTableNum}
            onChange={e => setNewTableNum(e.target.value)}
            placeholder="e.g. 09"
            disabled={isCreating}
            className="bg-zinc-900 border border-zinc-855 text-zinc-300 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-theme-accent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider pl-1">
            Seat Capacity <span className="text-pink-500 font-bold ml-0.5">*</span>
          </span>
          <input
            type="number"
            min="1"
            value={newSeatSize}
            onChange={e => setNewSeatSize(e.target.value)}
            placeholder="4"
            disabled={isCreating}
            className="bg-zinc-900 border border-zinc-855 text-zinc-300 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-theme-accent font-mono"
          />
        </div>

        <button
          type="submit"
          disabled={isCreating || isFormInvalid}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-theme-tab-active border border-theme-tab-active-border text-theme-tab-active-text text-xs font-black uppercase rounded-xl cursor-pointer active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
        >
          {isCreating ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
          <span>Add Table</span>
        </button>
      </form>

      {errorMessage && (
        <div className="text-[9px] font-black text-rose-500 uppercase tracking-wider pl-1 pt-1">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
