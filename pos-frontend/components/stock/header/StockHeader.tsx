import React from 'react';
import { Package, Plus } from 'lucide-react';
import { Product } from '@/types';
import Link from 'next/link';

import { StockStats } from './StockStats';
import { StockChangesBar } from './StockChangesBar';
import { ConfirmModal } from '@/components/ui/modal/ConfirmModal';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { ProductImageOrEmoji } from '@/components/ui/ProductImageOrEmoji';

interface StockHeaderProps {
  // Stats
  totalItems: number;
  lowStockCount: number;
  outOfStockCount: number;

  // Unsaved changes bar
  pendingCount: number;
  onDiscard: () => void;
  onSaveClick: () => void;

  // Confirm modal
  showConfirmModal: boolean;
  pendingStockUpdates: Record<string, number>;
  productsList: Product[];
  initialProducts: Product[];
  onCloseModal: () => void;
  onConfirmSave: () => void;
  isSaving: boolean;

  // Deleted state toggle
  showDeleted: boolean;
  setShowDeleted: (v: boolean) => void;

  // Admin access & Valuation actions
  isAdmin?: boolean;
  onOpenValuation?: () => void;
}

/** Composes the title bar, stats cards, unsaved-changes bar, and confirm modal. */
export function StockHeader({
  totalItems, lowStockCount, outOfStockCount,
  pendingCount, onDiscard, onSaveClick,
  showConfirmModal, pendingStockUpdates, productsList, initialProducts,
  onCloseModal, onConfirmSave, isSaving,
  showDeleted, setShowDeleted,
  isAdmin, onOpenValuation,
}: Readonly<StockHeaderProps>) {
  return (
    <>
      {/* Title bar */}
      <header className="h-16 px-6 border-b border-theme-border bg-theme-panel backdrop-blur-md flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <Package className="text-theme-accent" size={20} />
          <h1 className="text-sm font-black text-zinc-200 tracking-wider uppercase">Stock Cyber-Manager</h1>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={onOpenValuation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-black uppercase text-[10px] cursor-pointer transition-all active:scale-95 shadow-[0_0_12px_rgba(245,158,11,0.15)] font-mono"
            >
              💰 Valuation Report
            </button>
          )}

          {isAdmin && (
            <Link
              href="/stock/new"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 font-black uppercase text-[10px] cursor-pointer transition-all active:scale-95 shadow-[0_0_12px_rgba(244,63,94,0.15)] font-mono"
            >
              <Plus size={12} /> New Product
            </Link>
          )}

          {/* Anime-styled Toggle for Active vs Deleted products */}
          <div className="flex items-center bg-zinc-950/60 p-1 rounded-xl border border-zinc-900 font-mono text-[10px] gap-1">
            <button
              onClick={() => setShowDeleted(false)}
              className={`px-3 py-1.5 rounded-lg font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                !showDeleted
                  ? 'bg-theme-accent text-white shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              🌸 Active Catalog
            </button>
            <button
              onClick={() => setShowDeleted(true)}
              className={`px-3 py-1.5 rounded-lg font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                showDeleted
                  ? 'bg-zinc-800 text-rose-400 border border-rose-500/20 shadow-[0_0_12px_rgba(244,63,94,0.1)]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              🗑️ Deleted Products
            </button>
          </div>
        </div>
      </header>

      {/* Summary stats cards */}
      <StockStats
        totalItems={totalItems}
        lowStockCount={lowStockCount}
        outOfStockCount={outOfStockCount}
      />

      {/* Floating unsaved changes bar */}
      <StockChangesBar
        pendingCount={pendingCount}
        onDiscard={onDiscard}
        onSaveClick={onSaveClick}
      />

      {/* Confirm save modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={onCloseModal}
        onConfirm={onConfirmSave}
        isLoading={isSaving}
        title="Confirm Bulk Stock Update"
        subTitle="Inventory Verification"
        confirmText="Confirm & Save"
        message={
          <ScrollArea maxHeight="15rem" className="flex flex-col gap-2 pr-1 my-2">
            {Object.entries(pendingStockUpdates).map(([id, newQty]) => {
              const product = productsList.find(p => p.id === id) || initialProducts.find(p => p.id === id);
              if (!product) return null;
              return (
                <div key={id} className="flex justify-between items-center bg-zinc-900/40 border border-zinc-900/60 p-2.5 rounded-2xl text-xs my-1 font-mono">
                  <span className="flex items-center gap-1.5">
                    <ProductImageOrEmoji
                      imageUrl={product.imageUrl}
                      emoji={product.emoji}
                      name={product.name}
                      className="w-6 h-6 rounded-md overflow-hidden flex items-center justify-center bg-zinc-950/40"
                      emojiClassName="text-sm"
                    />
                    <span className="text-zinc-300 font-bold ml-1">{product.name}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-zinc-500 line-through">{product.stockQuantity}</span>
                    <span className="text-zinc-650">→</span>
                    <span className="text-theme-accent font-black">{newQty}</span>
                  </span>
                </div>
              );
            })}
          </ScrollArea>
        }
      />
    </>
  );
}
