import React from 'react';

interface AnalyticsLayoutProps {
  children: React.ReactNode;
  metrics: React.ReactNode;
  categoryShare: React.ReactNode;
  leaderboard: React.ReactNode;
}

export default function AnalyticsLayout({
  children,
  metrics,
  categoryShare,
  leaderboard,
}: AnalyticsLayoutProps) {
  return (
    <div className="flex-1 w-full flex flex-col min-h-0 overflow-y-auto">
      {children}
      
      <div className="flex-1 w-full px-6 py-6 flex flex-col gap-6">
        {metrics}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categoryShare}
          {leaderboard}
        </div>
      </div>
    </div>
  );
}
