'use client';

import React from 'react';

interface ErrorCardProps {
  title: string;
  description: string;
  actionText?: string;
  reset: () => void;
}

export function ErrorCard({ title, description, actionText = 'Retry', reset }: ErrorCardProps) {
  return (
    <div className="bg-red-950/20 border border-red-900/40 rounded-3xl p-5 flex flex-col justify-between gap-4 h-full">
      <div>
        <h4 className="text-xs font-black text-red-400 uppercase tracking-wider">{title}</h4>
        <p className="text-[10px] text-zinc-500 mt-1">{description}</p>
      </div>
      <button
        onClick={() => reset()}
        className="w-full py-2 bg-red-900/20 hover:bg-red-900/40 border border-red-800 text-red-200 text-[10px] font-bold rounded-xl transition-all active:scale-98"
      >
        {actionText}
      </button>
    </div>
  );
}
