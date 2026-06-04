'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginApi } from '@/services/api-auth';
import { Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { AuthUser } from '@/types';
import { AUTH_COOKIE_KEY, AUTH_TOKEN_KEY } from '@/constants';

export function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isFormInvalid = !email.trim() || !pin.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email, nya!');
      return;
    }
    if (!pin) {
      setErrorMsg('Please enter your access PIN!');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await loginApi(email.trim(), pin);
      if (res.success && res.data) {
        const user: AuthUser = {
          token: res.data.token,
          email: res.data.email,
          displayName: res.data.displayName,
          role: res.data.role,
          emoji: res.data.emoji,
          imageUrl: res.data.imageUrl,
        };

        if (typeof window !== 'undefined') {
          // Store in localStorage for client auth interceptor
          localStorage.setItem(AUTH_COOKIE_KEY, JSON.stringify(user));
          localStorage.setItem(AUTH_TOKEN_KEY, user.token || '');
          
          // Store in cookies for server component layout checks
          document.cookie = `${AUTH_COOKIE_KEY}=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = `${AUTH_TOKEN_KEY}=${user.token || ''}; path=/; max-age=604800; SameSite=Lax`;
        }

        setIsLoading(false);
        router.refresh();
      } else {
        setErrorMsg(res.message || 'Authentication Failure!');
        setPin('');
        setIsLoading(false);
      }
    } catch (err: unknown) {
      let message = 'Connection failed. Is the backend running?';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        message = axiosErr.response?.data?.message || message;
      }
      setErrorMsg(message);
      setPin('');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-theme-bg flex items-center justify-center z-[9999] select-none p-4 font-mono">
      <div className="w-full max-w-sm bg-zinc-950/80 border border-zinc-850/80 backdrop-blur-xl p-6 rounded-3xl flex flex-col gap-6 shadow-[0_0_50px_rgba(244,63,94,0.15)] relative overflow-hidden">
        
        {/* Cyberpunk corner brackets */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-theme-accent" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-theme-accent" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-theme-accent" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-theme-accent" />

        {/* Header Section */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-900/30 animate-float">
            <span className="text-2xl">🔐</span>
          </div>
          <h2 className="text-sm font-extrabold tracking-widest text-zinc-100 uppercase mt-2">NekoBite Terminal</h2>
          <p className="text-[10px] text-zinc-555">Maid Staff Authentication System</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email Field */}
          <div className="flex flex-col gap-2">
            <label className="text-[8px] font-extrabold uppercase text-zinc-400 tracking-wider flex items-center gap-1 pl-1">
              <User size={10} className="text-theme-accent" />
              Maid Email <span className="text-pink-500 font-bold ml-0.5">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMsg('');
              }}
              placeholder="maid@nekobite.com"
              disabled={isLoading}
              className="w-full bg-zinc-900 border border-zinc-850 focus:border-theme-accent rounded-xl py-2 px-3 text-xs text-zinc-200 outline-none transition-all placeholder-zinc-700 disabled:opacity-50"
            />
          </div>

          {/* Access PIN Field */}
          <div className="flex flex-col gap-2">
            <label className="text-[8px] font-extrabold uppercase text-zinc-400 tracking-wider flex items-center gap-1 pl-1">
              <Lock size={10} className="text-theme-accent" />
              Security PIN <span className="text-pink-500 font-bold ml-0.5">*</span>
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                maxLength={10}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="••••"
                disabled={isLoading}
                className="w-full bg-zinc-900 border border-zinc-850 focus:border-theme-accent rounded-xl py-2 px-3 text-center text-xs font-bold tracking-widest text-zinc-200 outline-none transition-all placeholder-zinc-700 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => {
                  setShowPin(!showPin);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-400 transition-colors duration-200 cursor-pointer"
              >
                {showPin ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg ? (
            <div className="text-center h-3 flex items-center justify-center">
              <span className="text-[9px] font-black text-rose-500 uppercase tracking-wider animate-bounce">
                {errorMsg}
              </span>
            </div>
          ) : (
            <div className="text-center h-3 flex items-center justify-center">
              <span className="text-[8px] text-zinc-650 tracking-wider uppercase">
                Secure Maid Access Mode
              </span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || isFormInvalid}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white text-[10px] font-black tracking-widest uppercase py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-pink-900/20 hover:shadow-pink-500/10 cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                Authenticating...
              </>
            ) : (
              'Authenticate Maid'
            )}
          </button>
        </form>

        {/* Demo credentials hint */}
        <div className="text-center text-[7px] text-zinc-650 font-mono flex flex-col gap-0.5">
          <span>Demo Maid: yuna@nekobite.com | PIN: 1111</span>
          <span>Admin: admin@nekobite.com (admin123) | Chef: chef@nekobite.com (5555)</span>
          <span>Other Maids: rin=2222, mei=3333, koko=4444</span>
        </div>
      </div>
    </div>
  );
}
