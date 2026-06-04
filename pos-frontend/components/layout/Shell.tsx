'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { ThemeEffects } from './ThemeEffects';
import { AuthUser } from '@/types';

interface ShellProps {
  children: React.ReactNode;
  authUser: AuthUser;
}

export function Shell({ children, authUser }: ShellProps) {
  return (
    <div className="flex flex-1 flex-row h-[100dvh] w-screen overflow-hidden font-sans bg-theme-bg text-foreground">
      <Sidebar authUser={authUser} />
      
      <main className="flex-1 flex flex-row overflow-hidden relative">
        <ThemeEffects />

        <div className="flex-1 flex flex-col overflow-hidden z-10">
          <div className="flex-1 flex flex-row overflow-y-auto overflow-x-hidden relative min-h-0">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
