import React from 'react';
import { Minus, Plus, AlertTriangle, CheckCircle, Trash2, RotateCcw } from 'lucide-react';
import { Product } from '@/types';
import Link from 'next/link';
import { ProductImageOrEmoji } from '@/components/ui/ProductImageOrEmoji';

interface StockTableRowProps {
  product: Product;
  pendingQty: number | undefined;
  onStockUpdate: (productId: string, quantity: number) => void;
  isAdmin?: boolean;
  showDeleted?: boolean;
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
}

export function StockTableRow({
  product,
  pendingQty,
  onStockUpdate,
  isAdmin,
  showDeleted = false,
  onDelete,
  onRestore,
}: StockTableRowProps) {
  const hasPending = pendingQty !== undefined;
  const currentQty = hasPending ? pendingQty : product.stockQuantity;
  const isOutOfStock = currentQty === 0;
  const isLowStock = currentQty > 0 && currentQty <= (product.lowStockThreshold !== undefined ? product.lowStockThreshold : 5);

  const handleIncrement = (productId: string, currentVal: number, step: number) => {
    if (showDeleted) return;
    onStockUpdate(productId, Math.max(0, currentVal + step));
  };

  const handleManualInput = (productId: string, inputVal: string) => {
    if (showDeleted) return;
    const parsed = parseInt(inputVal, 10);
    if (!isNaN(parsed)) {
      onStockUpdate(productId, Math.max(0, parsed));
    } else if (inputVal === '') {
      onStockUpdate(productId, 0);
    }
  };

  return (
    <tr className="hover:bg-zinc-900/10 transition-colors">
      {/* Name & Emoji */}
      <td className="px-5 py-4 whitespace-nowrap">
        <Link href={`/stock/${product.id}`} className="flex items-center gap-3 group cursor-pointer">
          <span className="group-hover:scale-110 transition-transform duration-200 block select-none">
            <ProductImageOrEmoji
              imageUrl={product.imageUrl}
              emoji={product.emoji}
              name={product.name}
              className="w-14 h-14 rounded-2xl bg-zinc-950/40 flex items-center justify-center overflow-hidden"
              emojiClassName="text-3xl"
            />
          </span>
          <div>
            <div className="text-xs font-extrabold text-zinc-200 group-hover:text-theme-accent transition-colors">{product.name}</div>
            <div className="text-[10px] text-zinc-555 mt-0.5 max-w-xs truncate group-hover:text-zinc-400 transition-colors">{product.description}</div>
          </div>
        </Link>
      </td>

      {/* Category badge */}
      <td className="px-5 py-4 whitespace-nowrap">
        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${
          product.category.toUpperCase() === 'MAINS' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' :
          product.category.toUpperCase() === 'DRINKS' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
          product.category.toUpperCase() === 'DESSERTS' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
          'bg-purple-500/10 text-purple-400 border-purple-500/20'
        }`}>
          {product.category}
        </span>
      </td>

      {/* Price */}
      <td className="px-5 py-4 whitespace-nowrap text-xs font-extrabold text-theme-accent font-mono">
        ${product.price.toFixed(2)}
      </td>

      {/* Capital Price */}
      {isAdmin && (
        <td className="px-5 py-4 whitespace-nowrap text-xs font-extrabold text-zinc-400 font-mono">
          ${(product.costPrice || 0).toFixed(2)}
        </td>
      )}

      {/* Stock Status */}
      <td className="px-5 py-4 whitespace-nowrap">
        {isOutOfStock ? (
          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border bg-rose-500/10 text-rose-400 border-rose-500/20 flex items-center gap-1.5 w-fit">
            <AlertTriangle size={10} /> Out of Stock
          </span>
        ) : isLowStock ? (
          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border bg-amber-500/10 text-amber-400 border-amber-500/20 flex items-center gap-1.5 w-fit">
            <AlertTriangle size={10} /> Low Stock
          </span>
        ) : (
          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 flex items-center gap-1.5 w-fit">
            <CheckCircle size={10} /> In Stock
          </span>
        )}
      </td>

      {/* Direct quantity control */}
      <td className="px-5 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <button
            disabled={currentQty === 0 || showDeleted}
            onClick={() => handleIncrement(product.id, currentQty, -1)}
            className="w-7 h-7 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <Minus size={12} />
          </button>
          
          <input
            type="text"
            value={currentQty}
            disabled={showDeleted}
            onChange={(e) => handleManualInput(product.id, e.target.value)}
            className={`w-12 h-7 rounded-xl bg-zinc-950 border text-center text-xs font-bold focus:border-theme-accent outline-none font-mono transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              hasPending
                ? 'border-amber-500/70 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.1)]'
                : 'border-zinc-800 text-zinc-200'
            }`}
          />

          <button
            disabled={showDeleted}
            onClick={() => handleIncrement(product.id, currentQty, 1)}
            className="w-7 h-7 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <Plus size={12} />
          </button>
        </div>
      </td>

      {/* Quick adjust presets */}
      <td className="px-5 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <button
            disabled={showDeleted}
            onClick={() => onStockUpdate(product.id, product.stockQuantity)}
            className="text-[9px] font-black uppercase px-2.5 py-1.5 rounded-xl border border-zinc-850 hover:border-zinc-700 bg-zinc-950 text-zinc-400 hover:text-zinc-200 cursor-pointer transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Reset
          </button>
          <button
            disabled={showDeleted}
            onClick={() => onStockUpdate(product.id, 10)}
            className="text-[9px] font-black uppercase px-2.5 py-1.5 rounded-xl border border-theme-tab-active-border/30 bg-theme-tab-active/10 hover:bg-theme-tab-active/20 text-theme-accent cursor-pointer transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            10
          </button>
          <button
            disabled={showDeleted}
            onClick={() => onStockUpdate(product.id, 50)}
            className="text-[9px] font-black uppercase px-2.5 py-1.5 rounded-xl border border-theme-tab-active-border/30 bg-theme-tab-active/10 hover:bg-theme-tab-active/20 text-theme-accent cursor-pointer transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            50
          </button>
        </div>
      </td>

      {/* Actions */}
      {isAdmin && (
        <td className="px-5 py-4 whitespace-nowrap text-xs">
          {showDeleted ? (
            <button
              onClick={() => onRestore?.(product.id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-black uppercase text-[9px] cursor-pointer transition-all active:scale-95 shadow-[0_0_10px_rgba(16,185,129,0.05)]"
            >
              <RotateCcw size={10} /> Restore
            </button>
          ) : (
            <button
              onClick={() => onDelete?.(product.id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-black uppercase text-[9px] cursor-pointer transition-all active:scale-95 shadow-[0_0_10px_rgba(244,63,94,0.05)]"
            >
              <Trash2 size={10} /> Delete
            </button>
          )}
        </td>
      )}
    </tr>
  );
}
