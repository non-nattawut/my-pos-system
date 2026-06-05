'use client';

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { CartItem, Product } from '@/types';
import { fetchConfig } from '@/services/api-config';

interface Discount {
  code: string;
  percent: number;
}

interface CartContextType {
  cart: CartItem[];
  activeDiscount: Discount | null;
  totals: {
    subtotal: number;
    serviceCharge: number;
    tax: number;
    discount: number;
    total: number;
  };
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  setActiveDiscount: (discount: Discount | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeDiscount, setActiveDiscount] = useState<Discount | null>(null);
  const [rates, setRates] = useState({ taxRate: 0.07, serviceChargeRate: 0.10 });

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetchConfig();
        if (res.success && res.data) {
          setRates({
            taxRate: res.data.taxRate,
            serviceChargeRate: res.data.serviceChargeRate
          });
        }
      } catch (err) {
        console.error('Failed to fetch POS config from backend:', err);
      }
    }
    loadConfig();
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const serviceCharge = subtotal * rates.serviceChargeRate;
    const tax = subtotal * rates.taxRate;
    
    let discount = 0;
    if (activeDiscount) {
      discount = (subtotal + serviceCharge + tax) * (activeDiscount.percent / 100);
    }
    
    const total = Math.max(0, subtotal + serviceCharge + tax - discount);
    return { subtotal, serviceCharge, tax, discount, total };
  }, [cart, activeDiscount, rates]);

  return (
    <CartContext.Provider
      value={{
        cart,
        activeDiscount,
        totals,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        setActiveDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
