'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Coffee, LayoutGrid, History, TrendingUp, Package, ChefHat, Receipt, Shield, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';

export function SidebarNav({ isCollapsed, role }: { isCollapsed: boolean; role?: string }) {
  const pathname = usePathname();

  let navLinks = [
    { href: '/', icon: Home, label: 'Welcome' },
    { href: '/pos', icon: Coffee, label: 'POS Menu' },
    { href: '/tables', icon: LayoutGrid, label: 'Tables' },
    { href: '/queue', icon: ChefHat, label: 'Kitchen Queue' },
    { href: '/history', icon: History, label: 'Orders Log' },
    { href: '/receipts', icon: Receipt, label: 'Receipt History' },
    { href: '/stock', icon: Package, label: 'Stock Manager' },
    { href: '/analytics', icon: TrendingUp, label: 'Cyber Analytics' },
    { href: '/accounts', icon: Shield, label: 'Account Control' },
    { href: '/vouchers', icon: Ticket, label: 'Vouchers' },
  ];

  if (role === 'CHEF') {
    navLinks = navLinks.filter(link => 
      ['/', '/tables', '/queue', '/history'].includes(link.href)
    );
  } else if (role === 'MAID') {
    navLinks = navLinks.filter(link => !['/analytics', '/accounts', '/vouchers'].includes(link.href));
  }

  return (
    <nav className="flex flex-col gap-2">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center rounded-2xl transition-all cursor-pointer ${
              isCollapsed 
                ? 'justify-center p-3.5 w-12 h-12 mx-auto' 
                : 'gap-3 px-4 py-3'
            } ${
              isActive 
                ? 'bg-theme-tab-active text-theme-tab-active-text border border-theme-tab-active-border' 
                : 'text-theme-accent-sec/60 hover:text-theme-accent-sec hover:bg-theme-tab-active/20'
            }`}
            title={isCollapsed ? link.label : undefined}
          >
            <link.icon size={18} className="shrink-0" />
            {!isCollapsed && <span className="text-sm font-semibold whitespace-nowrap">{link.label}</span>}
            {isActive && !isCollapsed && <motion.div layoutId="navIndicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-current" />}
          </Link>
        );
      })}
    </nav>
  );
}
