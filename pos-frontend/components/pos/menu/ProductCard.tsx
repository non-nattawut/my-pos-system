'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import { ProductImageOrEmoji } from '@/components/ui/ProductImageOrEmoji';

interface ProductCardProps {
  product: Product;
  isInCart: boolean;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({
  product,
  isInCart,
  onAddToCart,
}: ProductCardProps) {
  const stockCount = product.stockQuantity;
  const isSoldOut = stockCount <= 0;

  return (
    <motion.div
      whileHover={isSoldOut ? {} : { y: -4 }}
      className={`bg-theme-card ${
        isSoldOut ? 'opacity-40 grayscale cursor-not-allowed border-red-500/20' :
        isInCart ? 'border-theme-card-active shadow-md' : 'border-theme-border'
      } overflow-hidden flex flex-col justify-between group border rounded-3xl transition-all duration-300 ${
        isSoldOut ? '' : 'cursor-pointer hover:shadow-lg hover:border-theme-card-hover'
      }`}
      onClick={() => {
        if (!isSoldOut) {
          onAddToCart(product);
        }
      }}
    >
      <div className="p-4 flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <span className="group-hover:scale-110 transition-transform select-none">
            <ProductImageOrEmoji
              imageUrl={product.imageUrl}
              emoji={product.emoji}
              name={product.name}
              className="w-14 h-14 rounded-2xl bg-zinc-900/50 flex items-center justify-center overflow-hidden"
              emojiClassName="text-3xl"
            />
          </span>

          {isSoldOut ? (
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse">
              SOLD OUT 😿
            </span>
          ) : (
            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-lg border ${
              product.category === 'MAINS' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' :
              product.category === 'DRINKS' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
              product.category === 'DESSERTS' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
              'bg-purple-500/10 text-purple-400 border-purple-500/20'
            }`}>
              {product.category}
            </span>
          )}
        </div>

        <div>
          <h3 className="font-extrabold text-sm group-hover:text-theme-accent transition-colors">
            {product.name}
          </h3>
          <p className="text-[11px] text-zinc-555 mt-1 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>
      </div>

      <div className="px-4 py-3 bg-theme-panel border-t border-theme-border flex justify-between items-center">
        <div className="flex flex-col">
          <span className="font-extrabold text-sm text-theme-accent">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-[8px] text-zinc-555 font-bold uppercase mt-0.5">
            {isSoldOut ? 'No Stock left' : `${stockCount} units available`}
          </span>
        </div>

        <button
          disabled={isSoldOut}
          className={`rounded-xl text-[10px] font-extrabold px-3 py-1.5 flex items-center gap-1 transition-all ${
            isSoldOut ? 'bg-zinc-950 border border-zinc-900 text-zinc-600 cursor-not-allowed' :
            isInCart
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              : 'bg-theme-bg border border-theme-border text-zinc-350 hover:bg-theme-card-hover hover:text-white'
          }`}
        >
          {isSoldOut ? 'Out' : isInCart ? 'Added! ✔' : 'Add +'}
        </button>
      </div>
    </motion.div>
  );
}
