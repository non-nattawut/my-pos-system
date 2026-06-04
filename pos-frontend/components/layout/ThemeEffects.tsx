import React from 'react';

export function ThemeEffects() {
  return (
    <div className="theme-effects absolute inset-0 pointer-events-none overflow-hidden z-0">
      <span className="absolute text-rose-300/10 top-12 left-10 text-7xl animate-float">🌸</span>
      <span className="absolute text-rose-300/15 bottom-12 left-[30%] text-6xl animate-float" style={{ animationDelay: '1s' }}>🌸</span>
      <span className="absolute text-rose-200/10 top-32 right-[20%] text-8xl animate-float" style={{ animationDelay: '2s' }}>💖</span>
    </div>
  );
}
