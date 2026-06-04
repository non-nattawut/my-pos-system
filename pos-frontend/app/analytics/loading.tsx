import React from 'react';

export default function AnalyticsLoading() {
  return (
    <div className="w-full flex flex-col gap-2 animate-pulse">
      <div className="h-6 w-48 bg-zinc-800 rounded-md"></div>
      <div className="h-4 w-64 bg-zinc-900 rounded-md"></div>
    </div>
  );
}
