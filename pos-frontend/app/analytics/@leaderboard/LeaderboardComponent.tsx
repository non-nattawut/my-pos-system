'use client';

import React, { useMemo } from 'react';
import { MaidLeaderboardEntry } from '@/services/api-analytics';
import Image from 'next/image';

interface LeaderboardComponentProps {
  entries?: MaidLeaderboardEntry[];
}

export default function LeaderboardComponent({ entries = [] }: LeaderboardComponentProps) {
  const [imageErrors, setImageErrors] = React.useState<Record<string, boolean>>({});

  const leaderboardData = useMemo(() => {
    const colors = ['text-pink-400', 'text-cyan-400', 'text-amber-400', 'text-purple-400', 'text-emerald-400', 'text-rose-400'];

    return entries.map(entry => {
      const hash = entry.maidName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      return {
        ...entry,
        color: colors[hash % colors.length]
      };
    });
  }, [entries]);

  return (
    <div className="bg-zinc-900/40 border border-zinc-850 rounded-3xl p-5 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Maid Leaderboard</h3>
        <span className="text-[9px] bg-theme-badge border border-theme-badge-border text-theme-badge-text font-black px-1.5 py-0.5 rounded-lg uppercase tracking-wider">
          Moe Efficiency
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {leaderboardData.map((maid, idx) => (
          <div 
            key={maid.maidName}
            className="flex items-center justify-between p-2.5 bg-zinc-950/40 border border-zinc-900 rounded-2xl hover:bg-zinc-950/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono font-bold text-zinc-500">#{idx + 1}</span>
              <span className="text-lg bg-zinc-900/80 w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden relative">
                {maid.imageUrl && !imageErrors[maid.maidName] ? (
                  <Image 
                    src={maid.imageUrl} 
                    alt={maid.maidName} 
                    fill 
                    sizes="32px" 
                    className="object-cover" 
                    onError={() => setImageErrors(prev => ({ ...prev, [maid.maidName]: true }))}
                  />
                ) : (
                  maid.emoji || '🐾'
                )}
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-extrabold text-zinc-200">{maid.maidName}</span>
              </div>
            </div>

            <div className="text-right flex flex-col">
              <span className={`text-xs font-black ${maid.color}`}>${maid.sales.toFixed(2)}</span>
              <span className="text-[8px] text-zinc-550 mt-0.5">{maid.orderCount} orders completed</span>
            </div>
          </div>
        ))}

        {leaderboardData.length === 0 && (
          <div className="text-center text-xs text-zinc-500 py-6">
            No rankings available
          </div>
        )}
      </div>
    </div>
  );
}
