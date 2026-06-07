'use client';

import React, { useState } from 'react';
import { Select } from '@/components/ui/Select';
import DraggableDateRangePicker from '@/components/ui/DraggableDateRangePicker';
import { AuthUser } from '@/types';

interface FilterState {
  maidName: string;
  receiptNumber: string;
  startDate: string;
  endDate: string;
}

interface VaultFilterPanelProps {
  maids: AuthUser[];
  initialFilters: FilterState;
  onApply: (filters: FilterState) => void;
  onClear: () => void;
}

export function VaultFilterPanel({
  maids = [],
  initialFilters,
  onApply,
  onClear,
}: Readonly<VaultFilterPanelProps>) {
  const [maidName, setMaidName] = useState(initialFilters.maidName);
  const [receiptNumber, setReceiptNumber] = useState(initialFilters.receiptNumber);
  const [startDate, setStartDate] = useState(initialFilters.startDate);
  const [endDate, setEndDate] = useState(initialFilters.endDate);

  const handleApplyClick = () => {
    onApply({
      maidName,
      receiptNumber,
      startDate,
      endDate,
    });
  };

  const handleClearClick = () => {
    setMaidName('');
    setReceiptNumber('');
    setStartDate('');
    setEndDate('');
    onClear();
  };

  return (
    <div className="bg-theme-panel border border-theme-border rounded-3xl p-4 flex flex-wrap gap-4 items-end">
      <Select
        label="Maid Filter"
        value={maidName}
        onChange={(e) => setMaidName(e.target.value)}
        containerClassName="min-w-[150px]"
        className="!py-1.5 bg-theme-bg border-theme-border"
      >
        <option value="">All Maids</option>
        {maids.map((m) => (
          <option key={m.id} value={m.name}>
            {m.name}
          </option>
        ))}
      </Select>

      <div className="flex flex-col gap-1.5 min-w-[150px]">
        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Receipt Number</span>
        <input
          type="text"
          placeholder="Search receipt (e.g. NKB-)"
          value={receiptNumber}
          onChange={(e) => setReceiptNumber(e.target.value)}
          className="py-1.5 px-3 rounded-xl bg-theme-bg border border-theme-border text-xs text-zinc-300 outline-none focus:border-theme-accent placeholder:text-zinc-650"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Date Range</span>
        <DraggableDateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleApplyClick}
          className="py-1.5 px-4 rounded-xl bg-theme-btn-pink hover:bg-theme-btn-pink-hover text-white text-xs font-bold uppercase tracking-wider cursor-pointer active:scale-95 transition-all shadow-md"
        >
          Apply ✔
        </button>
        <button
          onClick={handleClearClick}
          className="py-1.5 px-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-450 hover:text-zinc-200 text-xs font-bold uppercase tracking-wider cursor-pointer active:scale-95 transition-all"
        >
          Clear ✕
        </button>
      </div>
    </div>
  );
}
