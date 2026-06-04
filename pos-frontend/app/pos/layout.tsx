import React from 'react';
import { CartProvider } from '@/context/CartContext';

export default function PosLayout({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
