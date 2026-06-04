import React from 'react';

interface LoadingSkeletonProps {
  rows?: number;
  type?: 'card' | 'list' | 'progress';
}

export function LoadingSkeleton({ rows = 4, type = 'card' }: LoadingSkeletonProps) {
  if (type === 'list') {
    return (
      <div className="bg-zinc-900/40 border border-zinc-850 rounded-3xl p-5 flex flex-col justify-between gap-4 animate-pulse h-full">
        <div className="h-4 w-36 bg-zinc-800 rounded"></div>
        <div className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-4 flex flex-col gap-3">
          {[...Array(rows)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="h-3 w-24 bg-zinc-800 rounded"></div>
              <div className="h-3 w-16 bg-zinc-800 rounded"></div>
            </div>
          ))}
        </div>
        <div className="h-9 w-full bg-zinc-850 rounded-xl"></div>
      </div>
    );
  }

  if (type === 'progress') {
    return (
      <div className="bg-zinc-900/40 border border-zinc-850 rounded-3xl p-5 flex flex-col gap-4 animate-pulse h-full">
        <div className="h-4 w-28 bg-zinc-800 rounded"></div>
        <div className="flex flex-col gap-4 mt-2">
          {[...Array(rows)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex justify-between">
                <div className="h-3 w-16 bg-zinc-800 rounded"></div>
                <div className="h-3 w-20 bg-zinc-800 rounded"></div>
              </div>
              <div className="h-2 w-full bg-zinc-900 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse w-full">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-4 flex flex-col gap-2">
          <div className="h-3 w-16 bg-zinc-800 rounded"></div>
          <div className="h-6 w-24 bg-zinc-800 rounded mt-1"></div>
          <div className="h-2 w-32 bg-zinc-900 rounded mt-2"></div>
        </div>
      ))}
    </div>
  );
}
