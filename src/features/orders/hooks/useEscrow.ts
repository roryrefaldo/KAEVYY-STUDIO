import { useState, useEffect } from 'react';
import { orderWorkspaceApi } from '../api/orderWorkspaceApi';
import { EscrowVaultRecord } from '../types/orderWorkspace.types';

export const useEscrow = (orderNumber: string = 'KS-2026-8801') => {
  const [escrow, setEscrow] = useState<EscrowVaultRecord | null>({
    id: 'escrow-8801',
    orderNumber,
    totalAmountUSD: 400,
    totalAmountIDR: 6200000,
    releasedAmountUSD: 100,
    releasedAmountIDR: 1550000,
    heldAmountUSD: 300,
    heldAmountIDR: 4650000,
    status: 'PARTIALLY_RELEASED',
    lastUpdated: '2026-07-28T14:30:00Z',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEscrow = async () => {
      setLoading(true);
      try {
        const res = await orderWorkspaceApi.getEscrowForOrder(orderNumber);
        if (res.data) {
          setEscrow(res.data);
        }
      } catch (err) {
        console.warn('Escrow data loaded from local state');
      } finally {
        setLoading(false);
      }
    };
    fetchEscrow();
  }, [orderNumber]);

  return {
    escrow,
    loading,
  };
};
