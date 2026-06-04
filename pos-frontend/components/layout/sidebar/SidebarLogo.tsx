'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function SidebarLogo({ isCollapsed }: { isCollapsed: boolean }) {

  return (
    <div className={`flex items-center gap-3 px-2 ${isCollapsed ? 'justify-center' : ''}`}>
      <motion.div 
        whileHover={{ rotate: 10, scale: 1.1 }}
        className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-[0_0_12px_rgba(236,72,153,0.5)] cursor-pointer shrink-0"
      >
        <span className="text-xl text-white font-extrabold">🐾</span>
      </motion.div>
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="overflow-hidden"
        >
          <h1 className="text-lg font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-400 whitespace-nowrap">
            NEKOBITE
          </h1>
          <p className="text-[10px] text-zinc-500 font-semibold tracking-widest uppercase whitespace-nowrap">Cyber Cafe POS</p>
        </motion.div>
      )}
    </div>
  );
}
