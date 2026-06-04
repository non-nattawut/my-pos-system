'use client';
import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export function SidebarThemeSelector({ isCollapsed }: { isCollapsed: boolean }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={isCollapsed ? "h-12 w-12" : "h-[74px] bg-zinc-900/60 border border-zinc-800/80 rounded-2xl"} />
    );
  }

  const activeTheme = theme || 'sakura';

  const handleThemeChange = (newTheme: 'sakura' | 'synthwave') => {
    setTheme(newTheme);
  };

  if (isCollapsed) {
    return (
      <div className="flex justify-center">
        <button
          onClick={() => handleThemeChange(activeTheme === 'sakura' ? 'synthwave' : 'sakura')}
          className="w-12 h-12 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-center text-lg hover:border-zinc-700 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title={`Switch to ${activeTheme === 'sakura' ? 'Synthwave' : 'Sakura'} Theme`}
        >
          {activeTheme === 'sakura' ? '🌸' : '🕶️'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3">
      <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block mb-2 px-1">
        Select Theme UI
      </span>
      <div className="grid grid-cols-2 gap-1.5">
        {(['sakura', 'synthwave'] as const).map(t => (
          <button
            key={t}
            onClick={() => handleThemeChange(t)}
            className={`py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all border ${
              activeTheme === t 
                ? 'border-pink-500/80 bg-pink-500/10 text-pink-400' 
                : 'border-zinc-800 hover:border-zinc-700 text-zinc-400 bg-zinc-950/40'
            }`}
          >
            {t === 'sakura' ? 'Sakura' : 'Synth'}
          </button>
        ))}
      </div>
    </div>
  );
}
