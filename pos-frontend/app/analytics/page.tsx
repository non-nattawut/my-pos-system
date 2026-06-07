import React, { Suspense } from 'react';
import { BarChart3 } from 'lucide-react';
import { verifyAdmin } from '@/utils/auth';
import { AnalyticsHeader } from './AnalyticsHeader';

export default async function AnalyticsPage() {
  const authUser = await verifyAdmin();

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

