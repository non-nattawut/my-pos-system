'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Image as ImageIcon, Smile, Lock, Save, CheckCircle2, ArrowLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthUser } from '@/types';
import { updateUserProfile, fetchUserProfile } from '@/services/api-users';
import { ErrorModal } from '@/components/ui/error/ErrorModal';
import { useErrorState } from '@/hooks/useErrorState';
import { AUTH_COOKIE_KEY } from '@/constants';
import Image from 'next/image';

export default function ProfileClient({ authUser }: { authUser: AuthUser }) {
  const router = useRouter();
  const [name, setName] = useState(authUser.name || '');
  const [emoji, setEmoji] = useState(authUser.emoji || '🐾');
  const [imageUrl, setImageUrl] = useState(authUser.imageUrl || '');

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetchUserProfile();
        if (res.success && res.data) {
          setName(res.data.name || '');
          setEmoji(res.data.emoji || '🐾');
          setImageUrl(res.data.imageUrl || '');
        }
      } catch (err) {
        console.error('Failed to fetch fresh user profile:', err);
      }
    }
    loadProfile();
  }, []);
  
  // Profile Update Status
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);
  const {
    errorModalOpen,
    setErrorModalOpen,
    errorModalMessage,
    setErrorModalMessage,
    showError,
  } = useErrorState();

  // Password Modal State
  const [isPwdModalOpen, setIsPwdModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPwdSaving, setIsPwdSaving] = useState(false);

  const isProfileInvalid = !name.trim() || !emoji.trim();
  const isPasswordFormInvalid = !oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim();

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);

    try {
      const res = await updateUserProfile({
        name,
        emoji,
        imageUrl: imageUrl.trim() || null,
        password: null,
        oldPassword: null,
      });

      if (res.success && res.data) {
        const updatedUser: AuthUser = {
          ...authUser,
          name: res.data.name,
          emoji: res.data.emoji,
          imageUrl: res.data.imageUrl,
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem(AUTH_COOKIE_KEY, JSON.stringify(updatedUser));
          document.cookie = `${AUTH_COOKIE_KEY}=${encodeURIComponent(JSON.stringify(updatedUser))}; path=/; max-age=604800; SameSite=Lax`;
        }

        setIsSuccess(true);
        setTimeout(() => {
          router.refresh();
        }, 1500);
      } else {
        showError(res.message || 'Failed to update profile');
      }
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      const errMsg = err.response?.data?.message || err.message || 'Failed to update profile';
      showError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showError('New passwords do not match!');
      return;
    }

    setIsPwdSaving(true);
    try {
      const res = await updateUserProfile({
        name,
        emoji,
        imageUrl: imageUrl.trim() || null,
        password: newPassword.trim(),
        oldPassword: oldPassword.trim(),
      });

      if (res.success) {
        setIsPwdModalOpen(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
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

  return (
    <div className="w-full h-full absolute inset-0 bg-theme-bg overflow-y-auto p-6 font-mono flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-theme-panel border border-theme-border rounded-3xl p-6 shadow-2xl relative"
      >
        {/* Neon Glow Accents */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Back Link */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs text-theme-accent hover:text-theme-accent/80 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-400 to-rose-500 flex items-center justify-center text-3xl shadow-lg relative overflow-hidden">
            {imageUrl && !imageError ? (
              <Image 
                src={imageUrl} 
                alt={name} 
                fill 
                sizes="64px" 
                className="object-cover" 
                onError={() => setImageError(true)}
              />
            ) : (
              <span>{emoji}</span>
            )}
          </div>
          <div>
            <h1 className="text-base font-black text-zinc-150 uppercase tracking-widest">Profile</h1>
            <p className="text-[10px] text-zinc-400 uppercase">{authUser.role} &bull; {authUser.email}</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
          {/* Display Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <User size={12} /> Display Name <span className="text-pink-500 font-bold ml-0.5">*</span>
            </label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-zinc-950/60 border border-zinc-850 hover:border-zinc-750 focus:border-theme-accent focus:ring-1 focus:ring-theme-accent rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none transition-all"
              placeholder="e.g. Maid Sakura"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Profile Emoji */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Smile size={12} /> Mascot Emoji <span className="text-pink-500 font-bold ml-0.5">*</span>
              </label>
              <input 
                type="text" 
                maxLength={2}
                value={emoji} 
                onChange={(e) => setEmoji(e.target.value)}
                required
                className="bg-zinc-950/60 border border-zinc-850 hover:border-zinc-750 focus:border-theme-accent focus:ring-1 focus:ring-theme-accent rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none transition-all text-center"
                placeholder="🐱"
              />
            </div>

            {/* Change Password Trigger Button */}
            <div className="flex flex-col justify-end">
              <button
                type="button"
                onClick={() => setIsPwdModalOpen(true)}
                className="w-full py-2 rounded-xl bg-zinc-950 border border-zinc-850 hover:border-zinc-750 hover:text-theme-accent text-zinc-400 font-extrabold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer text-[10px]"
              >
                <Lock size={12} /> Change Password
              </button>
            </div>
          </div>

          {/* Avatar Image URL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon size={12} /> Custom Avatar URL
            </label>
            <input 
              type="url" 
              value={imageUrl} 
              onChange={(e) => setImageUrl(e.target.value)}
              className="bg-zinc-950/60 border border-zinc-850 hover:border-zinc-750 focus:border-theme-accent focus:ring-1 focus:ring-theme-accent rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none transition-all"
              placeholder="https://example.com/avatar.png"
            />
          </div>

          {/* Save Status Banner */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-3 text-[10px] font-black uppercase flex items-center gap-2"
              >
                <CheckCircle2 size={14} /> Profile updated successfully, nya~!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || isProfileInvalid}
            className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold uppercase tracking-widest cursor-pointer shadow-lg active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none flex items-center justify-center gap-2 text-xs"
            style={{ color: '#ffffff' }}
          >
            {isLoading ? 'Saving...' : <><Save size={14} /> Update Profile</>}
          </button>
        </form>
      </motion.div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {isPwdModalOpen && (
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
                  onClick={() => setIsPwdModalOpen(false)}
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
                    onClick={() => setIsPwdModalOpen(false)}
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

      {/* Error Modal */}
      <ErrorModal 
        isOpen={errorModalOpen} 
        message={errorModalMessage} 
        onClose={() => setErrorModalOpen(false)} 
      />
    </div>
  );
}
