'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, Terminal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CartPanel } from '@/components/pos/CartPanel';
import { Product, AuthUser, TableResponse } from '@/types';
import { CategoryBar } from '@/components/ui/CategoryBar';
import { CATEGORY_ALL } from '@/constants';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { useCart } from '@/context/CartContext';
import { ProductCard } from '@/components/pos/menu/ProductCard';

interface PosClientProps {
  products: Product[];
  categories: string[];
  tables: TableResponse[];
  authUser: AuthUser;
}

export function PosClient({ products = [], categories = [], tables = [], authUser }: Readonly<PosClientProps>) {
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORY_ALL);

  const { cart, addToCart: handleAddToCart } = useCart();

  const handleOrderCompleted = () => {
    // Refresh data from server after order
    router.refresh();
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === CATEGORY_ALL || product.category.toUpperCase() === selectedCategory.toUpperCase();
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, products]);

  return (
    <div className="w-full h-[100dvh] flex flex-row font-mono overflow-hidden box-border">
      {/* POS Menu Grid */}
      <div className="flex-1 flex flex-col h-full overflow-hidden gap-4">
        <header className="h-16 px-6 border-b border-theme-border bg-theme-panel backdrop-blur-md flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <Terminal className="text-theme-accent" size={20} />
            <h1 className="text-sm font-black text-zinc-200 tracking-wider uppercase">NekoBite POS Terminal</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-550">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search food, coffee, merch..."
                className="w-full text-xs py-1.5 pl-9 pr-4 rounded-xl bg-theme-bg border border-theme-border text-zinc-300 outline-none focus:border-theme-accent placeholder:text-zinc-650"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-355"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Category Bar */}
        <CategoryBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categories={categories}
          mode="pos"
        />

        {/* Grid items area */}
        <ScrollArea className="flex-1 min-h-0 px-6 pb-6" trackTransparent>
          {filteredProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <span className="text-5xl animate-float">😿</span>
                <h3 className="mt-4 text-sm font-bold text-zinc-400">No items found, nya~</h3>
                <p className="text-xs text-zinc-650 mt-1">Try searching for a different keyword or category!</p>
              </div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isInCart={cart.some(item => item.product.id === product.id)}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
          )}
        </ScrollArea>
      </div>

      <CartPanel
        handleOrderCompleted={handleOrderCompleted}
        maidEmail={authUser?.email ?? null}
        tables={tables}
      />
    </div>
  );
}
