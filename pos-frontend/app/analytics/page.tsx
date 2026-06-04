'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BarChart3 } from 'lucide-react';
import DraggableDateRangePicker from '@/components/ui/DraggableDateRangePicker';

function AnalyticsHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeFilter = searchParams.get('filter') || 'all';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';

  const handleFilterChange = (filter: string) => {
    if (filter === 'custom') {
      // Default to today for custom start/end if not set
      const todayStr = new Date().toISOString().split('T')[0];
      router.push(`/analytics?filter=custom&startDate=${todayStr}&endDate=${todayStr}`);
    } else {
      router.push(`/analytics?filter=${filter}`);
    }
  };

  return (
    <header className="h-auto lg:h-16 py-4 lg:py-0 px-6 border-b border-theme-border bg-theme-panel backdrop-blur-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 shrink-0">
      <div className="flex items-center gap-2.5">
        <BarChart3 className="text-theme-accent" size={20} />
        <h1 className="text-sm font-black text-zinc-200 tracking-wider uppercase">Cyber Cafe Terminal Metrics</h1>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* Date pickers (Only show or highlight when Custom is active) */}
        {activeFilter === 'custom' && (
          <DraggableDateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={(start, end) => {
              router.push(`/analytics?filter=custom&startDate=${start}&endDate=${end}`);
            }}
          />
        )}

        {/* Predefined Filter Toggles */}
        <div className="flex gap-1 bg-zinc-950/60 border border-zinc-850 p-1 rounded-2xl shrink-0">
          {[
            { id: 'all', label: 'All Time ⏳' },
            { id: 'today', label: 'Today 📅' },
            { id: 'month', label: 'This Month 🌙' },
            { id: 'custom', label: 'Custom Range 🔍' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => handleFilterChange(item.id)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold cursor-pointer transition-all ${
                activeFilter === item.id
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={
      <header className="h-16 px-6 border-b border-theme-border bg-theme-panel backdrop-blur-md flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <BarChart3 className="text-theme-accent" size={20} />
          <h1 className="text-sm font-black text-zinc-200 tracking-wider uppercase">Cyber Cafe Terminal Metrics</h1>
        </div>
      </header>
    }>
      <AnalyticsHeader />
    </Suspense>
  );
}
