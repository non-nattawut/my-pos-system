'use client';

import React, { useState, useEffect } from 'react';
import { UserPlus, Edit3, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthUser } from '@/types';
import { fetchUsers, fetchUserRoles } from '@/services/api-users';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { UserModal } from '@/components/accounts/UserModal';

interface AccountsClientProps {
  initialUsers: AuthUser[];
}

export default function AccountsClient({ initialUsers }: Readonly<AccountsClientProps>) {
  const [users, setUsers] = useState<AuthUser[]>(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AuthUser | null>(null);

  const [availableRoles, setAvailableRoles] = useState<string[]>(['MAID', 'CHEF', 'ADMIN']);

  useEffect(() => {
    async function loadRoles() {
      try {
        const res = await fetchUserRoles();
        if (res.success && res.data) {
          setAvailableRoles(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch roles:', err);
      }
    }
    loadRoles();
  }, []);

  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const openAddModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: AuthUser) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const reloadUsers = async () => {
    try {
      const res = await fetchUsers();
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error('Failed to reload users:', err);
    }
  };

  return (
    <div className="w-full h-full absolute inset-0 bg-theme-bg flex flex-col overflow-hidden select-none font-mono">
      {/* Title Header */}
      <header className="h-16 px-6 border-b border-theme-border bg-theme-panel backdrop-blur-md flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <Shield className="text-theme-accent" size={20} />
          <div>
            <h1 className="text-sm font-black text-zinc-200 tracking-wider uppercase">Cyber Cafe Account Control</h1>
            <p className="text-[10px] text-zinc-500 uppercase">Manage maid and chef system accesses</p>
          </div>
        </div>

        <button 
          onClick={openAddModal}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-xs uppercase flex items-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all"
          style={{ color: '#ffffff' }}
        >
          <UserPlus size={14} /> Add New Staff
        </button>
      </header>

      {/* Scrollable User Grid */}
      <ScrollArea className="flex-1 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-6">
          {users.map(u => (
            <motion.div
              key={u.id || u.email}
              layout
              className="bg-theme-panel border border-theme-border rounded-3xl p-5 shadow-lg relative flex flex-col justify-between min-h-[160px]"
            >
              {/* Ribbon role badge */}
              <div className="absolute top-4 right-4 px-2 py-0.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[8px] font-black uppercase text-theme-accent-sec">
                {u.role}
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-400 to-rose-500 flex items-center justify-center text-2xl shadow-md overflow-hidden relative shrink-0">
                  {u.imageUrl && !imageErrors[u.email] ? (
                    <Image
                      src={u.imageUrl}
                      alt={u.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                      onError={() => setImageErrors(prev => ({ ...prev, [u.email]: true }))}
                    />
                  ) : (
                    <span>{u.emoji || '🐾'}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-black text-zinc-200 truncate pr-8">{u.name}</h3>
                  <p className="text-[9px] text-zinc-500 truncate">{u.email}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-900 flex justify-end">
                <button
                  onClick={() => openEditModal(u)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-750 text-zinc-400 hover:text-zinc-200 text-[9px] font-black flex items-center gap-1.5 cursor-pointer uppercase transition-all"
                >
                  <Edit3 size={11} /> Edit Detail
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>

      {/* Add/Edit Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingUser={editingUser}
        onSaveSuccess={reloadUsers}
        availableRoles={availableRoles}
      />
    </div>
  );
}
