import React from 'react';
import { CATEGORY_ALL, CATEGORY_MAINS, CATEGORY_DRINKS, CATEGORY_DESSERTS, CATEGORY_MERCH } from '@/constants';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
  mode?: 'pos' | 'stock';
}

export function CategoryBar({
  selectedCategory,
  onSelectCategory,
  categories = [],
  mode = 'pos'
}: CategoryBarProps) {
  const isStock = mode === 'stock';

  const categoryOptions = [
    {
      id: CATEGORY_ALL,
      label: isStock ? 'All Stock' : 'All Items',
      emoji: isStock ? '📦' : '✨'
    },
    ...categories.map(cat => {
      if (cat === CATEGORY_MAINS) return { id: cat, label: 'Mains', emoji: '🍛' };
      if (cat === CATEGORY_DRINKS) return { id: cat, label: 'Drinks', emoji: '🥤' };
      if (cat === CATEGORY_DESSERTS) return { id: cat, label: 'Desserts', emoji: '🥞' };
      if (cat === CATEGORY_MERCH) return { id: cat, label: 'Merchandise', emoji: '🐱' };

      const capitalized = cat.charAt(0).toUpperCase() + cat.slice(1);
      return { id: cat, label: capitalized, emoji: isStock ? '📦' : '🍱' };
    })
  ];

  const barPaddingClass = isStock ? 'px-6 mb-4' : 'py-4 px-6';
  const buttonPaddingClass = isStock ? 'px-4 py-1.5' : 'px-4.5 py-2';

  return (
    <div className={`flex gap-2 overflow-x-auto select-none shrink-0 scrollbar-none ${barPaddingClass}`}>
      {categoryOptions.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory(cat.id)}
          className={`flex items-center gap-1.5 rounded-2xl text-xs font-bold transition-all border cursor-pointer shrink-0 ${buttonPaddingClass} ${
            selectedCategory.toUpperCase() === cat.id.toUpperCase()
              ? 'bg-theme-tab-active text-theme-tab-active-text border-theme-tab-active-border'
              : 'border-theme-border hover:border-theme-card-hover bg-theme-card text-theme-accent-sec/80 hover:text-theme-accent-sec'
          }`}
        >
          <span>{cat.emoji}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
