'use client';

import React, { useState, useEffect } from 'react';
import { Lock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorModal } from '@/components/ui/error/ErrorModal';
import { useErrorState } from '@/hooks/useErrorState';
import { changePasswordApi } from '@/services/api-users';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PasswordModal({
  isOpen,
  onClose,
  onSuccess,
}: Readonly<PasswordModalProps>) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPwdSaving, setIsPwdSaving] = useState(false);

  const {
    errorModalOpen,
    setErrorModalOpen,
    errorModalMessage,
    showError,
  } = useErrorState();

  useEffect(() => {
    if (isOpen) {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [isOpen]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showError('New passwords do not match!');
      return;
    }

    setIsPwdSaving(true);
    try {
      const res = await changePasswordApi({
        oldPassword: oldPassword.trim(),
        newPassword: newPassword.trim(),
      });
      if (res.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        showError(res.message || 'Failed to change password');
      }
    } catch (err: any) {
      console.error('Failed to change password:', err);
      const errMsg = err.response?.data?.message || err.message || 'Failed to change password';
      showError(errMsg);
    } finally {
      setIsPwdSaving(false);
    }
  };

  const isPasswordFormInvalid = !oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-zinc-950 border border-theme-border rounded-3xl overflow-hidden shadow-2xl relative"
            >
              {/* Modal header */}
              <div className="px-5 py-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/20">
                <div className="flex items-center gap-2 text-theme-accent">
                  <Lock size={14} />
                  <h3 className="font-extrabold text-xs uppercase tracking-wide">Security Settings</h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-350 cursor-pointer transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Form body */}
              <form onSubmit={handlePasswordChange}>
                <div className="p-6 flex flex-col gap-4">
                  {/* Current Password */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">
                      Current Password <span className="text-pink-500 font-bold ml-0.5">*</span>
                    </label>
                    <input 
                      type="password" 
                      value={oldPassword} 
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                      className="bg-zinc-900/60 border border-zinc-800 focus:border-theme-accent rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none transition-all"
                      placeholder="Required"
                    />
                  </div>

                  {/* New Password */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">
                      New Password <span className="text-pink-500 font-bold ml-0.5">*</span>
                    </label>
                    <input 
                      type="password" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="bg-zinc-900/60 border border-zinc-800 focus:border-theme-accent rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none transition-all"
                      placeholder="e.g. new secret"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">
                      Confirm New Password <span className="text-pink-500 font-bold ml-0.5">*</span>
                    </label>
                    <input 
                      type="password" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="bg-zinc-900/60 border border-zinc-800 focus:border-theme-accent rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none transition-all"
                      placeholder="Confirm new secret"
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
                    disabled={isPwdSaving || isPasswordFormInvalid}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-center font-extrabold uppercase tracking-wider cursor-pointer shadow-lg active:scale-95 transition-all text-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                    style={{ color: '#ffffff' }}
                  >
                    {isPwdSaving ? 'Saving...' : 'Save Password'}
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
