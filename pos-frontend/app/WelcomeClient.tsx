'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function WelcomeClient() {

  return (
    <div className="min-h-full w-full flex flex-col items-center justify-center p-6 text-center relative overflow-y-auto overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center z-10 max-w-2xl"
      >
        <motion.div 
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="text-[120px] mb-8 select-none drop-shadow-2xl"
        >
          😸
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight text-theme-accent">
          Welcome to <br /> NekoBite POS
        </h1>
        
        <p className="text-zinc-400 text-lg md:text-xl font-medium mb-12 max-w-lg">
          The most adorable, futuristic cyber-cafe point of sale system on the planet. Ready to serve some delicious treats?
        </p>

        <Link 
          href="/pos"
          className="px-8 py-4 rounded-2xl text-lg font-extrabold uppercase tracking-widest flex items-center gap-3 transition-all bg-theme-btn-pink hover:bg-theme-btn-pink-hover text-white shadow-lg active:scale-95"
        >
          <span>Open Register</span>
          <span className="text-2xl">✨</span>
        </Link>
      </motion.div>
    </div>
  );
}
