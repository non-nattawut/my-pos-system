'use client';

import React, { useState, useEffect } from 'react';
import { Settings, X, Mail, User, Shield, Smile, Lock, Image as ImageIcon, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthUser, UserRole } from '@/types';
import { createUser, updateUser } from '@/services/api-users';
import { Select } from '@/components/ui/Select';
import { ErrorModal } from '@/components/ui/error/ErrorModal';
import { useErrorState } from '@/hooks/useErrorState';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingUser: AuthUser | null;
  onSaveSuccess: () => void;
  availableRoles: string[];
}

export function UserModal({
  isOpen,
  onClose,
  editingUser,
  onSaveSuccess,
  availableRoles,
}: Readonly<UserModalProps>) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('MAID');
  const [emoji, setEmoji] = useState('🐾');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    errorModalOpen,
    setErrorModalOpen,
    errorModalMessage,
    showError,
  } = useErrorState();

  useEffect(() => {
    if (isOpen) {
      if (editingUser) {
        setEmail(editingUser.email || '');
        setName(editingUser.name || '');
        setPassword('');
        setRole(editingUser.role || 'MAID');
        setEmoji(editingUser.emoji || '🐾');
        setImageUrl(editingUser.imageUrl || '');
      } else {
        setEmail('');
        setName('');
        setPassword('');
        setRole('MAID');
        setEmoji('🐾');
        setImageUrl('');
      }
    }
  }, [isOpen, editingUser]);

  const isFormInvalid = !email.trim() || !name.trim() || !emoji.trim() || (!editingUser && !password.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingUser) {
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
          onSaveSuccess();
          onClose();
        } else {
          showError(res.message || 'Failed to update user');
        }
      } else {
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
          onSaveSuccess();
          onClose();
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
    <>
      <AnimatePresence>
        {isOpen && (
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
                  onClick={onClose}
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
                    onClick={onClose}
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

      <ErrorModal 
        isOpen={errorModalOpen} 
        message={errorModalMessage} 
        onClose={() => setErrorModalOpen(false)} 
      />
    </>
  );
}
