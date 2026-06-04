'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SidebarLogo } from './sidebar/SidebarLogo';
import { SidebarNav } from './sidebar/SidebarNav';
import { SidebarThemeSelector } from './sidebar/SidebarThemeSelector';
import { SidebarFooter } from './sidebar/SidebarFooter';

import { AuthUser } from '@/types';

export function Sidebar({ authUser }: { authUser: AuthUser }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`border-r border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl flex flex-col py-6 transition-all duration-300 ease-in-out z-20 shrink-0 relative h-dvh ${
        isCollapsed ? 'w-20 px-2' : 'w-64 px-4'
    }`}>
      {/* Floating Toggle Button */}
      <button
        onClick={() => {
          setIsCollapsed(!isCollapsed);
        }}
        className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 flex items-center justify-center cursor-pointer shadow-[0_0_10px_rgba(0,0,0,0.5)] hover:scale-110 active:scale-95 transition-all z-30"
        title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      <div className="flex flex-col gap-6 shrink-0">
        <SidebarLogo isCollapsed={isCollapsed} />
        <div className="h-[1px] bg-zinc-800/80 w-full" />
      </div>

      <div className="flex-1 overflow-y-auto my-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <SidebarNav isCollapsed={isCollapsed} role={authUser?.role} />
      </div>

      <div className="flex flex-col gap-4 shrink-0 mt-auto">
        <SidebarThemeSelector isCollapsed={isCollapsed} />
        <SidebarFooter isCollapsed={isCollapsed} authUser={authUser} />
      </div>
    </aside>
  );
}
