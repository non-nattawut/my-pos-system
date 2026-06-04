import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-theme-bg text-zinc-100 p-6 select-none">
      <div className="flex flex-col items-center max-w-md text-center gap-6">
        {/* Anime / Cyber styled 404 block */}
        <div className="relative">
          <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 animate-pulse tracking-widest font-mono">
            404
          </div>
          <div className="absolute -bottom-2 right-0 text-[10px] bg-cyan-500 text-zinc-950 font-black px-2 py-0.5 rounded-md rotate-3 uppercase tracking-wider shadow-md">
            Lost in Cyberspace
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-extrabold text-zinc-200">Dimension Out of Bounds 🐾</h2>
          <p className="text-xs text-zinc-500 px-4 leading-relaxed">
            The Maid Cafe sector or terminal you are looking for has vanished into the grid. Let's redirect you back to base.
          </p>
        </div>

        <Link
          href="/"
          className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white text-[11px] font-black rounded-xl transition-all shadow-md shadow-pink-900/30 active:scale-98 uppercase tracking-wider"
        >
          Return to Terminal Home
        </Link>
      </div>
    </div>
  );
}
