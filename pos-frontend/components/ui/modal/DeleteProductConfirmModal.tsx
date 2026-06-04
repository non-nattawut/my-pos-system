import React from 'react';
import { ConfirmModal } from './ConfirmModal';
import { ProductImageOrEmoji } from '../ProductImageOrEmoji';
import { Product } from '@/types';

interface DeleteProductConfirmModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function DeleteProductConfirmModal({
  isOpen,
  product,
  onClose,
  onConfirm,
  isLoading,
}: DeleteProductConfirmModalProps) {
  if (!product) return null;

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isLoading={isLoading}
      isDanger={true}
      title="Delete Product"
      subTitle="Soft Delete Catalog Item"
      confirmText="Yes, Delete Product"
      message={
        <div className="flex flex-col gap-2 font-mono">
          <p className="text-zinc-400">Are you sure you want to delete this catalog item, nya?</p>
          <div className="flex items-center gap-2.5 bg-rose-950/20 border border-rose-900/30 p-3 rounded-2xl mt-1">
            <ProductImageOrEmoji
              imageUrl={product.imageUrl}
              emoji={product.emoji}
              name={product.name}
              className="w-12 h-12 rounded-xl bg-zinc-950/40 overflow-hidden flex items-center justify-center"
              emojiClassName="text-3xl"
            />
            <div>
              <h4 className="font-extrabold text-rose-450 text-xs">{product.name}</h4>
              <span className="text-[9px] uppercase font-black text-zinc-555">{product.category}</span>
            </div>
          </div>
        </div>
      }
    />
  );
}
