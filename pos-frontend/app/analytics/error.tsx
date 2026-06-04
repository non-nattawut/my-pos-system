'use client';

import React from 'react';
import { ErrorProps } from '@/types';

export default function AnalyticsError({ error, reset }: ErrorProps) {
  return (
    <div className="p-6 bg-red-950/20 border border-red-900/50 rounded-3xl flex flex-col gap-4 max-w-md my-4">
      <div>
        <h3 className="text-sm font-extrabold text-red-400 uppercase tracking-widest">Mainframe Error ⚠️</h3>
        <p className="text-xs text-zinc-400 mt-1">
          {error.message || 'An unexpected database error occurred.'}
        </p>
      </div>
      <button
        onClick={() => reset()}
        className="w-fit px-4 py-1.5 bg-red-900/40 hover:bg-red-900/60 border border-red-800 text-red-200 text-[10px] font-bold rounded-xl transition-all"
      >
        Re-engage Mainframe
      </button>
    </div>
  );
}
