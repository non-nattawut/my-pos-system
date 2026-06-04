'use client';

import React, { useState, useEffect } from 'react';
import { UserPlus, Edit3, Settings, Shield, User, Mail, Lock, Smile, Image as ImageIcon, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthUser } from '@/types';
import { createUser, updateUser, fetchUsers, fetchUserRoles } from '@/services/api-users';
import { ErrorModal } from '@/components/ui/error/ErrorModal';
import { useErrorState } from '@/hooks/useErrorState';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Select } from '@/components/ui/Select';

interface AccountsClientProps {
  initialUsers: AuthUser[];
  authUser: AuthUser;
}

export default function AccountsClient({ initialUsers, authUser }: AccountsClientProps) {
  const [users, setUsers] = useState<AuthUser[]>(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AuthUser | null>(null);

  // Form Fields
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'MAID' | 'CHEF'>('MAID');
  const [emoji, setEmoji] = useState('🐾');
  const [imageUrl, setImageUrl] = useState('');

  const isFormInvalid = !email.trim() || !name.trim() || !emoji.trim() || (!editingUser && !password.trim());
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

  const [isLoading, setIsLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const {
    errorModalOpen,
    setErrorModalOpen,
    errorModalMessage,
    setErrorModalMessage,
    showError,
  } = useErrorState();

  const openAddModal = () => {
    setEditingUser(null);
    setEmail('');
    setName('');
    setPassword('');
    setRole('MAID');
    setEmoji('🐾');
    setImageUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (user: AuthUser) => {
    setEditingUser(user);
    setEmail(user.email || '');
    setName(user.displayName || '');
    setPassword(''); // leave blank for no change
    setRole((user.role as any) || 'MAID');
    setEmoji(user.emoji || '🐾');
    setImageUrl(user.imageUrl || '');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingUser) {
        // Edit Mode
        const payload = {
          email,
          name,
          role,
          emoji,
          imageUrl: imageUrl.trim() || null,
          password: password.trim() || null,
        };
        const res = await updateUser(editingUser.id || '', payload);
        if (res.success) {
          setIsModalOpen(false);
          await reloadUsers();
        } else {
          showError(res.message || 'Failed to update user');
        }
      } else {
        // Create Mode
        const payload = {
          email,
          name,
          role,
          emoji,
          imageUrl: imageUrl.trim() || null,
          password,
        };
        const res = await createUser(payload);
        if (res.success) {
          setIsModalOpen(false);
          await reloadUsers();
        } else {
          showError(res.message || 'Failed to create user');
        }
      }
    } catch (err: any) {
      console.error('Error saving user:', err);
      const errMsg = err.response?.data?.message || err.message || 'Failed to save user';
      showError(errMsg);
    } finally {
      setIsLoading(false);
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
                    alt={u.displayName} 
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
                <h3 className="text-xs font-black text-zinc-200 truncate pr-8">{u.displayName}</h3>
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
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-zinc-950 border border-theme-border rounded-3xl overflow-hidden shadow-2xl relative"
            >
              {/* Modal header */}
              <div className="px-5 py-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/20">
                <div className="flex items-center gap-2 text-theme-accent">
                  <Settings size={16} />
                  <h3 className="font-extrabold text-xs uppercase tracking-wide">
                    {editingUser ? 'Edit User Credentials' : 'Register New Staff'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-350 cursor-pointer transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Form body */}
              <form onSubmit={handleSubmit}>
                <div className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Mail size={11} /> Email Address <span className="text-pink-500 font-bold ml-0.5">*</span>
                    </label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-zinc-900/60 border border-zinc-800 focus:border-theme-accent rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none transition-all"
                      placeholder="maid@nekobite.com"
                    />
                  </div>

                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <User size={11} /> Display Name <span className="text-pink-500 font-bold ml-0.5">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="bg-zinc-900/60 border border-zinc-800 focus:border-theme-accent rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none transition-all"
                      placeholder="e.g. Maid Sakura"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Role */}
                    <Select
                      label={
                        <span className="flex items-center gap-1.5">
                          <Shield size={11} /> Role
                        </span>
                      }
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      containerClassName="flex-1"
                    >
                      {availableRoles.map(r => (
                        <option key={r} value={r}>
                          {r === 'ADMIN' ? 'Admin' : r === 'CHEF' ? 'Chef' : r === 'MAID' ? 'Maid' : r}
                        </option>
                      ))}
                    </Select>

                    {/* Emoji */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-black text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Smile size={11} /> Mascot Emoji <span className="text-pink-500 font-bold ml-0.5">*</span>
                      </label>
                      <input 
                        type="text" 
                        maxLength={2}
                        value={emoji} 
                        onChange={(e) => setEmoji(e.target.value)}
                        required
                        className="bg-zinc-900/60 border border-zinc-800 focus:border-theme-accent rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none transition-all text-center"
                        placeholder="🐱"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Lock size={11} /> Password {!editingUser && <span className="text-pink-500 font-bold ml-0.5">*</span>}
                    </label>
                    <input 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      required={!editingUser}
                      className="bg-zinc-900/60 border border-zinc-800 focus:border-theme-accent rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none transition-all"
                      placeholder={editingUser ? "Leave blank to keep same" : "e.g. 5555"}
                    />
                  </div>

                  {/* Image URL */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon size={11} /> Avatar Image URL
                    </label>
                    <input 
                      type="url" 
                      value={imageUrl} 
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="bg-zinc-900/60 border border-zinc-800 focus:border-theme-accent rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none transition-all"
                      placeholder="https://example.com/avatar.png"
                    />
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="px-5 py-4 bg-zinc-950 border-t border-zinc-900 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 text-center font-extrabold uppercase tracking-wider cursor-pointer text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || isFormInvalid}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-center font-extrabold uppercase tracking-wider cursor-pointer shadow-lg active:scale-95 transition-all text-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                    style={{ color: '#ffffff' }}
                  >
                    {isLoading ? 'Saving...' : <><Save size={12} className="inline mr-1" /> Save Staff</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Error Modal */}
      <ErrorModal 
        isOpen={errorModalOpen} 
        message={errorModalMessage} 
        onClose={() => setErrorModalOpen(false)} 
      />
    </div>
  );
}
