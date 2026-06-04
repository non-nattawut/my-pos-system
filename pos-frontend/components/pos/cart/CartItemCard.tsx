'use client';

import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductImageOrEmoji } from '@/components/ui/ProductImageOrEmoji';
import { CartItem } from '@/types';

interface CartItemCardProps {
  item: CartItem;
  handleRemoveFromCart: (id: string) => void;
  handleUpdateQuantity: (id: string, delta: number) => void;
}

export function CartItemCard({
  item,
  handleRemoveFromCart,
  handleUpdateQuantity
}: CartItemCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-3 bg-zinc-900/60 border border-zinc-850 rounded-2xl flex flex-col gap-2 hover:border-zinc-800 transition-colors"
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex gap-2">
          <ProductImageOrEmoji
            imageUrl={item.product.imageUrl}
            emoji={item.product.emoji}
            name={item.product.name}
            className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-zinc-950"
            emojiClassName="text-xl"
          />
          <div>
            <h4 className="text-xs font-extrabold text-zinc-200 line-clamp-1">{item.product.name}</h4>
            <span className="text-[10px] text-zinc-550">${item.product.price.toFixed(2)} each</span>
          </div>
        </div>
        <button 
          onClick={() => handleRemoveFromCart(item.product.id)}
          className="text-zinc-550 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/5 transition-colors cursor-pointer"
        >
          <Trash2 size={13} />
        </button>
      </div>

      <div className="flex justify-between items-center bg-zinc-950/50 rounded-xl px-2 py-1">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleUpdateQuantity(item.product.id, -1)}
            className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
          >
            <Minus size={10} />
          </button>
          <span className="text-xs font-black text-zinc-250 w-4 text-center">{item.quantity}</span>
          <button 
            onClick={() => handleUpdateQuantity(item.product.id, 1)}
            className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
          >
            <Plus size={10} />
          </button>
        </div>
        <span className="text-xs font-extrabold text-pink-500">
          ${(item.product.price * item.quantity).toFixed(2)}
        </span>
      </div>
    </motion.div>
  );
}
