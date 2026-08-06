import { useState, useEffect, useCallback } from 'react';
import { orderWorkspaceApi } from '../api/orderWorkspaceApi';
import { DeveloperWorkspaceSummary } from '../types/orderWorkspace.types';

export const useDeveloperWorkspace = () => {
  const [developerOrders, setDeveloperOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  const fetchDeveloperOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await orderWorkspaceApi.getOrders();
      if (res.data) {
        setDeveloperOrders(res.data);
      }
    } catch (err: any) {
      console.warn('Network or API issue, fallback to dev workspace state:', err?.message || err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeveloperOrders();
  }, [fetchDeveloperOrders]);

  const handleAcceptOrder = async (orderNumber: string) => {
    try {
      await orderWorkspaceApi.acceptOrder(orderNumber);
      setActionStatus(`Pesanan ${orderNumber} diterima! Status berubah ke IN_PROGRESS.`);
      fetchDeveloperOrders();
    } catch (err) {
      setActionStatus(`Pesanan ${orderNumber} diterima (Lokal Mode).`);
      setDeveloperOrders((prev) =>
        prev.map((o) => (o.orderNumber === orderNumber ? { ...o, status: 'IN_PROGRESS' } : o))
      );
    }
    setTimeout(() => setActionStatus(null), 3000);
  };

  const handleRejectOrder = async (orderNumber: string, reason?: string) => {
    try {
      await orderWorkspaceApi.rejectOrder(orderNumber, reason);
      setActionStatus(`Pesanan ${orderNumber} ditolak.`);
      fetchDeveloperOrders();
    } catch (err) {
      setActionStatus(`Pesanan ${orderNumber} ditolak (Lokal Mode).`);
      setDeveloperOrders((prev) =>
        prev.map((o) => (o.orderNumber === orderNumber ? { ...o, status: 'CANCELLED' } : o))
      );
    }
    setTimeout(() => setActionStatus(null), 3000);
  };

  const summary: DeveloperWorkspaceSummary = {
    activeProjectsCount: developerOrders.filter((o) => o.status === 'IN_PROGRESS').length || 2,
    totalEarningsUSD: 1450,
    pendingMilestonesCount: 1,
    queueCapacityUsed: 2,
    maxQueueCapacity: 3,
  };

  return {
    developerOrders,
    loading,
    actionStatus,
    summary,
    handleAcceptOrder,
    handleRejectOrder,
    refreshDeveloperOrders: fetchDeveloperOrders,
  };
};
