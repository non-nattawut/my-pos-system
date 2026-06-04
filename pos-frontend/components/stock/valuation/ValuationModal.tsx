'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Coins, Landmark, TrendingUp, AlertTriangle } from 'lucide-react';
import { Product } from '@/types';
import { fetchProducts } from '@/services/api-products';
import { Loader2 } from 'lucide-react';

interface ValuationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CategoryStats {
  category: string;
  itemCount: number;
  totalStock: number;
  totalCost: number;
  totalRetail: number;
}

export function ValuationModal({ isOpen, onClose }: ValuationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<{
    totalCost: number;
    totalRetail: number;
    totalProfit: number;
    marginPercentage: number;
    totalStock: number;
  }>({ totalCost: 0, totalRetail: 0, totalProfit: 0, marginPercentage: 0, totalStock: 0 });

  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryStats[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const loadAllProducts = async () => {
      setIsLoading(true);
      try {
        // Fetch up to 1000 items to cover the entire catalog for valuation
        const response = await fetchProducts({ page: 0, size: 1000 });
        if (response.success && response.data) {
          const list = response.data.content;
          setProducts(list);

          // Calculate overall stats
          let costSum = 0;
          let retailSum = 0;
          let stockSum = 0;

          const categoriesMap: Record<string, CategoryStats> = {};

          list.forEach(p => {
            const qty = p.stockQuantity || 0;
            const cost = p.costPrice || 0;
            const price = p.price || 0;

            const itemCost = qty * cost;
            const itemRetail = qty * price;

            costSum += itemCost;
            retailSum += itemRetail;
            stockSum += qty;

            const cat = p.category || 'other';
            if (!categoriesMap[cat]) {
              categoriesMap[cat] = {
                category: cat,
                itemCount: 0,
                totalStock: 0,
                totalCost: 0,
                totalRetail: 0,
              };
            }
            categoriesMap[cat].itemCount += 1;
            categoriesMap[cat].totalStock += qty;
            categoriesMap[cat].totalCost += itemCost;
            categoriesMap[cat].totalRetail += itemRetail;
          });

          const profitSum = retailSum - costSum;
          const margin = retailSum > 0 ? (profitSum / retailSum) * 100 : 0;

          setStats({
            totalCost: costSum,
            totalRetail: retailSum,
            totalProfit: profitSum,
            marginPercentage: margin,
            totalStock: stockSum,
          });

          setCategoryBreakdown(Object.values(categoriesMap));
        }
      } catch (error) {
        console.error('Failed to load valuation data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllProducts();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm cursor-default"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-3xl bg-theme-card border border-theme-border rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] font-mono animate-scale-in">
        {/* Header */}
        <header className="px-6 py-4 border-b border-theme-border bg-theme-panel flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-theme-accent">
            <Sparkles size={18} className="animate-pulse" />
            <h3 className="text-xs font-black text-zinc-200 tracking-widest uppercase">
              ✨ Inventory Mana & Gold Valuation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors"
          >
            <X size={14} />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="animate-spin text-theme-accent" size={32} />
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Calculating assets...</span>
            </div>
          ) : (
            <>
              {/* Stat Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Cost Value Card */}
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 rounded-2xl p-4 flex flex-col gap-1 shadow-md">
                  <span className="text-[9px] font-black uppercase text-cyan-400/80 flex items-center gap-1">
                    <Landmark size={12} /> Capital Asset Cost
                  </span>
                  <span className="text-xl font-extrabold text-cyan-300 font-mono tracking-tight">
                    ${stats.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-[8px] text-zinc-500 font-bold mt-1 uppercase">
                    Total investment in supplier stock
                  </span>
                </div>

                {/* Retail Value Card */}
                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-2xl p-4 flex flex-col gap-1 shadow-md">
                  <span className="text-[9px] font-black uppercase text-amber-400/80 flex items-center gap-1">
                    <Coins size={12} /> Total Retail Value
                  </span>
                  <span className="text-xl font-extrabold text-amber-300 font-mono tracking-tight">
                    ${stats.totalRetail.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-[8px] text-zinc-500 font-bold mt-1 uppercase">
                    Selling value if fully cleared
                  </span>
                </div>

                {/* Profit Margin Card */}
                <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/5 border border-pink-500/20 rounded-2xl p-4 flex flex-col gap-1 shadow-md">
                  <span className="text-[9px] font-black uppercase text-pink-400/80 flex items-center gap-1">
                    <TrendingUp size={12} /> Est. Profit & Margin
                  </span>
                  <span className="text-xl font-extrabold text-pink-300 font-mono tracking-tight">
                    +${stats.totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-[8px] text-pink-500/80 font-black mt-1 uppercase">
                    Margin: {stats.marginPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Category Breakdown Table */}
              <div className="flex flex-col gap-3">
                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                  📁 Category Asset Allocation
                </h4>
                
                <div className="border border-zinc-900 rounded-2xl overflow-hidden bg-zinc-950/40">
                  <table className="min-w-full divide-y divide-zinc-900 font-mono">
                    <thead className="bg-zinc-950">
                      <tr>
                        <th className="px-4 py-2.5 text-left text-[9px] font-black text-zinc-500 uppercase tracking-wider">Category</th>
                        <th className="px-4 py-2.5 text-center text-[9px] font-black text-zinc-500 uppercase tracking-wider">Items / Stock</th>
                        <th className="px-4 py-2.5 text-right text-[9px] font-black text-zinc-500 uppercase tracking-wider">Cost Value</th>
                        <th className="px-4 py-2.5 text-right text-[9px] font-black text-zinc-500 uppercase tracking-wider">Retail Value</th>
                        <th className="px-4 py-2.5 text-right text-[9px] font-black text-zinc-500 uppercase tracking-wider">Markup Margin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/60 text-xs">
                      {categoryBreakdown.map(cat => {
                        const profit = cat.totalRetail - cat.totalCost;
                        const margin = cat.totalRetail > 0 ? (profit / cat.totalRetail) * 100 : 0;
                        return (
                          <tr key={cat.category} className="hover:bg-zinc-900/10">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${
                                cat.category.toUpperCase() === 'MAINS' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' :
                                cat.category.toUpperCase() === 'DRINKS' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                                cat.category.toUpperCase() === 'DESSERTS' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                'bg-purple-500/10 text-purple-400 border-purple-500/20'
                              }`}>
                                {cat.category}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-center text-zinc-300 font-bold">
                              {cat.itemCount} <span className="text-zinc-650 text-[9px]">({cat.totalStock} units)</span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-cyan-400 font-semibold">${cat.totalCost.toFixed(2)}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-amber-400 font-semibold">${cat.totalRetail.toFixed(2)}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-pink-400 font-extrabold">{margin.toFixed(1)}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Chibi Mascot Recommendation */}
              <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 flex items-start gap-3">
                <span className="text-3xl animate-bounce shrink-0 block select-none">🐱</span>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase text-theme-accent">Mascot Adviser Neko-Chan</span>
                  <p className="text-[10px] text-zinc-400 font-bold leading-relaxed">
                    "Nyaa! Currently, our inventory has a total stock volume of <strong className="text-zinc-200">{stats.totalStock}</strong> units. 
                    {stats.marginPercentage > 50 
                      ? " Your markup margins are very high and healthy! Good job pricing the merchandise, master!" 
                      : " Consider raising prices on low-margin items to boost the overall store profit margin, nya!"}
                    "
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
