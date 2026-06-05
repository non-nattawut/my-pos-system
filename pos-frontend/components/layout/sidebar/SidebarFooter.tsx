'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { AuthUser } from '@/types';
import { ConfirmModal } from '@/components/ui/modal/ConfirmModal';
import Image from 'next/image';

export function SidebarFooter({ isCollapsed, authUser }: { isCollapsed: boolean; authUser: AuthUser }) {
  const currentMaid = authUser?.name || null;
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const handleLogoutClick = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nekobite_auth');
      localStorage.removeItem('nekobite_token');
      document.cookie = 'nekobite_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'nekobite_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    setIsConfirmOpen(false);
    router.refresh();
  };

  const renderAvatarContent = () => {
    if (authUser?.imageUrl && !avatarError) {
      return (
        <Image 
          src={authUser.imageUrl} 
          alt={currentMaid || 'Maid'} 
          fill 
          sizes="32px" 
          className="rounded-full object-cover" 
          onError={() => setAvatarError(true)}
        />
      );
    }
    return <span>{authUser?.emoji || '🐾'}</span>;
  };

  if (isCollapsed) {
    return (
      <>
        <div className="flex flex-col items-center gap-2 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-2 w-12 mx-auto">
          <Link 
            href="/profile"
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-400 to-rose-500 flex items-center justify-center text-xs font-bold text-white shadow-md relative shrink-0 cursor-pointer overflow-hidden" 
            title={`${currentMaid || 'Maid'} (Profile)`}
          >
            {renderAvatarContent()}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-zinc-950" />
          </Link>
          <button
            onClick={handleLogoutClick}
            className="w-8 h-8 rounded-xl bg-zinc-950 hover:bg-rose-950/20 border border-zinc-850 hover:border-rose-900/60 hover:text-rose-400 text-zinc-500 flex items-center justify-center cursor-pointer transition-all"
            title="Close Shift / Lock"
          >
            <LogOut size={12} />
          </button>
        </div>
        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirmLogout}
          title="Close Shift & Lock, Nya?"
          message="This will lock the POS terminal, log you out, Are you sure?"
          confirmText="Yes, Lock Shift"
          cancelText="Cancel"
          isDanger={true}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-2.5">
        <div className="flex items-center justify-between">
          <Link href="/profile" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-400 to-rose-500 flex items-center justify-center text-xs font-bold text-white shadow-md overflow-hidden group-hover:ring-1 group-hover:ring-theme-accent transition-all shrink-0 relative">
              {renderAvatarContent()}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold text-zinc-200 line-clamp-1 group-hover:text-theme-accent transition-all">{currentMaid || 'Maid'}</p>
              <span className="text-[9px] font-semibold text-emerald-400 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" /> Shift Active
              </span>
            </div>
          </Link>
        </div>

        <button
          onClick={handleLogoutClick}
          className="w-full mt-1.5 py-1 bg-zinc-950 hover:bg-rose-950/20 hover:border-rose-900/60 border border-zinc-850 hover:text-rose-400 text-zinc-450 text-[9px] font-black rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer uppercase tracking-wider"
        >
          <LogOut size={10} />
          Close Shift / Lock
        </button>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Close Shift & Lock, Nya?"
        message="This will lock the POS terminal, log you out, Are you sure?"
        confirmText="Yes, Lock Shift"
        cancelText="Cancel"
        isDanger={true}
      />
    </>
  );
}
