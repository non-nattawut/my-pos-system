'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChefHat, RefreshCw, AlertCircle } from 'lucide-react';
import { fetchQueueOrders, updateQueueStatus } from '@/services/api-queue';
import { OrderResponse, OrderStatus } from '@/types';
import { formatTime } from '@/utils/date';
import QueueColumn from '../../components/queue/QueueColumn';
import { ScrollArea } from '@/components/ui/ScrollArea';

export default function QueueClient() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadActiveOrders = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    setError(null);
    try {
      const res = await fetchQueueOrders();
      if (res.success && res.data) {
        setOrders(res.data);
        setLastUpdated(new Date());
      } else {
        setError(res.message || 'Failed to fetch queue data');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while loading the queue');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Poll for new orders every 5 seconds
  useEffect(() => {
    loadActiveOrders();
    const interval = setInterval(() => {
      loadActiveOrders(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [loadActiveOrders]);

  const handleStatusTransition = async (orderId: string, nextStatus: OrderStatus) => {
    try {
      const res = await updateQueueStatus(orderId, nextStatus);
      if (res.success) {
        // Optimistically update local state:
        // Filter out completed orders (both dine-in and takeaway) from the active kitchen board list
        setOrders((prev) =>
          prev
            .map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
            .filter((o) => o.status !== 'COMPLETED')
        );
      } else {
        alert(res.message || 'Failed to transition order status');
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error transitioning status');
    }
  };

  // Grouping orders by status
  const pendingOrders = orders.filter((o) => o.status === 'PENDING');
  const preparingOrders = orders.filter((o) => o.status === 'PREPARING');
  const readyOrders = orders.filter((o) => o.status === 'READY');

  const getElapsedTime = (createdAtStr?: string) => {
    if (!createdAtStr) return '';
    try {
      const created = new Date(createdAtStr);
      const diffMs = new Date().getTime() - created.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      return `${diffMins}m ago`;
    } catch {
      return '';
    }
  };

  return (
    <div className="w-full h-full absolute inset-0 bg-theme-bg flex flex-col overflow-hidden select-none font-mono">
      {/* Title bar */}
      <header className="h-16 px-6 border-b border-theme-border bg-theme-panel backdrop-blur-md flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <ChefHat className="text-theme-accent" size={20} />
          <h1 className="text-sm font-black text-zinc-200 tracking-wider uppercase">NekoBite Cafe Queue Board</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider">Last synced</span>
            <span className="text-[11px] font-mono font-medium text-zinc-400">{formatTime(lastUpdated)}</span>
          </div>

          <button
            onClick={() => loadActiveOrders()}
            disabled={loading || refreshing}
            className="p-1.5 rounded-xl bg-theme-card border border-theme-border text-zinc-300 hover:text-cyan-400 hover:border-cyan-500/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            title="Force refresh"
          >
            <RefreshCw size={14} className={`${refreshing || loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-950/20 border border-red-900/30 rounded-2xl text-red-400 text-xs shrink-0">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Horizontal ScrollArea wrapper for columns grid */}
      <ScrollArea className="flex-1 w-full px-6 pb-6 pt-4" trackTransparent>
        <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full lg:h-full pb-2 pr-2">
          {/* COLUMN 1: PENDING */}
          <QueueColumn
            title="Ordered / Pending"
            icon="📋"
            badgeBgClass="bg-zinc-900"
            badgeTextClass="text-zinc-400"
            orders={pendingOrders}
            getElapsedTime={getElapsedTime}
            actionLabel="🍳 Start Cooking"
            actionColor="bg-pink-500 hover:bg-pink-600 border-pink-400/20 text-white"
            onAction={(id) => handleStatusTransition(id, 'PREPARING')}
            emptyIcon="🐱"
            emptyMessage="No new orders in queue"
            loading={loading}
          />

          {/* COLUMN 2: PREPARING */}
          <QueueColumn
            title="Preparing / Cooking"
            icon="🔥"
            badgeBgClass="bg-pink-950/20"
            badgeTextClass="text-pink-400"
            orders={preparingOrders}
            getElapsedTime={getElapsedTime}
            actionLabel="✨ Mark Ready"
            actionColor="bg-cyan-500 hover:bg-cyan-600 border-cyan-400/20 text-white"
            onAction={(id) => handleStatusTransition(id, 'READY')}
            emptyIcon="🍳"
            emptyMessage="Kitchen is idle right now"
            loading={loading}
          />

          {/* COLUMN 3: READY */}
          <QueueColumn
            title="Ready to Serve / Collect"
            icon="✨"
            badgeBgClass="bg-cyan-950/20"
            badgeTextClass="text-cyan-400"
            orders={readyOrders}
            getElapsedTime={getElapsedTime}
            actionLabel="🌸 Deliver / Complete"
            actionColor="bg-emerald-500 hover:bg-emerald-600 border-emerald-400/20 text-white"
            onAction={(id) => handleStatusTransition(id, 'COMPLETED')}
            emptyIcon="✨"
            emptyMessage="Nothing ready yet"
            loading={loading}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
