'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CategoryShareData } from '@/services/api-analytics';

interface CategoryShareComponentProps {
  shares?: CategoryShareData[];
}

export default function CategoryShareComponent({ shares = [] }: CategoryShareComponentProps) {
  const categoryConfig: Record<string, { label: string; color: string }> = {
    MAINS: { label: 'Mains 🍛', color: 'bg-pink-500' },
    DRINKS: { label: 'Drinks 🥤', color: 'bg-cyan-400' },
    DESSERTS: { label: 'Desserts 🥞', color: 'bg-amber-400' },
    MERCH: { label: 'Merchandise 🐱', color: 'bg-purple-500' }
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-850 rounded-3xl p-5 flex flex-col gap-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Category Share Sales</h3>
      
      <div className="flex flex-col gap-3">
        {shares.map(share => {
          const config = categoryConfig[share.category] || { label: share.category, color: 'bg-zinc-500' };
          const pct = Math.round(share.sharePercentage);
          
          return (
            <div key={share.category} className="flex flex-col gap-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-zinc-300">{config.label}</span>
                <span className="text-zinc-400">${share.sales.toFixed(2)} ({pct}%)</span>
              </div>
              <div className="h-2 rounded-full bg-zinc-950 border border-zinc-900 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8 }}
                  className={`h-full ${config.color} rounded-full`}
                />
              </div>
            </div>
          );
        })}

        {shares.length === 0 && (
          <div className="text-center text-xs text-zinc-500 py-6">
            No sales data for this period
          </div>
        )}
      </div>
    </div>
  );
}
