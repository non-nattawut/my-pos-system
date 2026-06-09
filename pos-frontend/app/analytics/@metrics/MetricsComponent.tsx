import React from 'react';
import { MetricsData } from '@/services/api-analytics';

interface MetricsComponentProps {
  metrics?: MetricsData;
}

export default function MetricsComponent({ 
  metrics = { grossRevenue: 0, orderVolume: 0, averageOrderValue: 0, hottestCategory: 'None', netProfit: 0, profitMargin: 0 } 
}: MetricsComponentProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-4 flex flex-col gap-1 transition-all hover:border-pink-500/20">
        <span className="text-[10px] text-zinc-555 font-bold uppercase tracking-wider">Gross Revenue</span>
        <span className="text-xl font-black text-pink-500">${metrics.grossRevenue.toFixed(2)}</span>
        <span className="text-[9px] text-zinc-500 font-semibold mt-1">Gross sales</span>
      </div>
      <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-4 flex flex-col gap-1 transition-all hover:border-cyan-400/20">
        <span className="text-[10px] text-zinc-555 font-bold uppercase tracking-wider">Order Volume</span>
        <span className="text-xl font-black text-cyan-400">{metrics.orderVolume} orders</span>
        <span className="text-[9px] text-zinc-500 font-semibold mt-1">Total checkouts completed</span>
      </div>
      <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-4 flex flex-col gap-1 transition-all hover:border-amber-400/20">
        <span className="text-[10px] text-zinc-555 font-bold uppercase tracking-wider">Average Order Value</span>
        <span className="text-xl font-black text-amber-400">${metrics.averageOrderValue.toFixed(2)}</span>
        <span className="text-[9px] text-zinc-500 font-semibold mt-1">Average ticket size</span>
      </div>
      <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-4 flex flex-col gap-1 transition-all hover:border-emerald-400/20">
        <span className="text-[10px] text-zinc-555 font-bold uppercase tracking-wider">Net Profit</span>
        <span className="text-xl font-black text-emerald-400">${(metrics.netProfit ?? 0).toFixed(2)}</span>
        <span className="text-[9px] text-zinc-500 font-semibold mt-1">Gross revenue - product costs</span>
      </div>
      <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-4 flex flex-col gap-1 transition-all hover:border-teal-400/20">
        <span className="text-[10px] text-zinc-555 font-bold uppercase tracking-wider">Profit Margin</span>
        <span className="text-xl font-black text-teal-400">{(metrics.profitMargin ?? 0).toFixed(1)}%</span>
        <span className="text-[9px] text-zinc-500 font-semibold mt-1">Profit to revenue ratio</span>
      </div>
      <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-4 flex flex-col gap-1 transition-all hover:border-purple-400/20">
        <span className="text-[10px] text-zinc-555 font-bold uppercase tracking-wider">Hottest Category</span>
        <span className="text-xl font-black text-purple-400 capitalize">{metrics.hottestCategory.toLowerCase()}</span>
        <span className="text-[9px] text-zinc-500 font-semibold mt-1">Highest quantity sold</span>
      </div>
    </div>
  );
}
