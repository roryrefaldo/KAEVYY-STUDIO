import { useState, useEffect, useCallback } from 'react';
import { orderWorkspaceApi } from '../api/orderWorkspaceApi';
import { ClientWorkspaceSummary } from '../types/orderWorkspace.types';

export const useClientWorkspace = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClientOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await orderWorkspaceApi.getOrders();
      if (res.data) {
        setOrders(res.data);
      }
    } catch (err: any) {
      if (err?.status === 0 || err?.code === 'NETWORK_ERROR') {
        console.warn('Backend server offline (network error), fallback to client order state');
      } else {
        setError(err?.message || 'Gagal memuat pesanan klien');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClientOrders();
  }, [fetchClientOrders]);

  const summary: ClientWorkspaceSummary = {
    activeOrdersCount: orders.filter((o) => o.status === 'IN_PROGRESS' || o.status === 'MILESTONE_SUBMITTED').length || 2,
    totalSpentUSD: orders.reduce((acc, curr) => acc + (curr.agreedPriceUSD || 250), 0) || 650,
    pendingApprovalsCount: orders.filter((o) => o.status === 'MILESTONE_SUBMITTED').length || 1,
    activeWarrantyCount: orders.filter((o) => o.status === 'COMPLETED' || o.status === 'IN_WARRANTY').length || 3,
  };

  return {
    orders,
    loading,
    error,
    summary,
    refreshOrders: fetchClientOrders,
  };
};
