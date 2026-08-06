import React, { useState, useCallback } from 'react';
import {
  OrderMilestoneItem,
  EscrowVaultRecord,
  WarrantyClaimRecord,
  OrderWorkspaceNotification,
} from '../types/orderWorkspace.types';

export interface UseOrderWorkspaceStoreReturn {
  activeOrderNumber: string | null;
  setActiveOrderNumber: (orderNumber: string | null) => void;
  milestones: OrderMilestoneItem[];
  setMilestones: React.Dispatch<React.SetStateAction<OrderMilestoneItem[]>>;
  updateMilestoneStatus: (stage: 25 | 50 | 100, status: OrderMilestoneItem['status'], deliverableNotes?: string, deliverableUrl?: string) => void;
  escrow: EscrowVaultRecord | null;
  setEscrow: React.Dispatch<React.SetStateAction<EscrowVaultRecord | null>>;
  warranty: WarrantyClaimRecord | null;
  setWarranty: React.Dispatch<React.SetStateAction<WarrantyClaimRecord | null>>;
  notifications: OrderWorkspaceNotification[];
  unreadNotificationsCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

export const useOrderWorkspaceStore = (initialOrderNumber?: string): UseOrderWorkspaceStoreReturn => {
  const [activeOrderNumber, setActiveOrderNumber] = useState<string | null>(initialOrderNumber || 'KS-2026-8801');

  // Sample initial milestones for default workspace active order
  const [milestones, setMilestones] = useState<OrderMilestoneItem[]>([
    {
      id: 'm-1',
      orderNumber: 'KS-2026-8801',
      stage: 25,
      title: 'Milestone 1: Down Payment & Core Architecture Setup (25%)',
      percentage: 25,
      amountUSD: 100,
      amountIDR: 1550000,
      status: 'APPROVED',
      deliverableNotes: 'Infrastruktur dasar Luau & DataStore V2 telah dikonfigurasi.',
      deliverableUrl: 'https://github.com/kaevy/datastore-v2',
      approvedAt: '2026-07-15T10:00:00Z',
    },
    {
      id: 'm-2',
      orderNumber: 'KS-2026-8801',
      stage: 50,
      title: 'Milestone 2: Functional Prototype & System Integration (50%)',
      percentage: 50,
      amountUSD: 200,
      amountIDR: 3100000,
      status: 'SUBMITTED',
      deliverableNotes: 'Fitur combat system & UI HUD sudah terpasang di Roblox Place.',
      deliverableUrl: 'https://www.roblox.com/games/12345678',
      submittedAt: '2026-07-28T14:30:00Z',
    },
    {
      id: 'm-3',
      orderNumber: 'KS-2026-8801',
      stage: 100,
      title: 'Milestone 3: Final Delivery, Security Audit & Source Code Release (25%)',
      percentage: 25,
      amountUSD: 100,
      amountIDR: 1550000,
      status: 'LOCKED',
    },
  ]);

  // Sample Escrow
  const [escrow, setEscrow] = useState<EscrowVaultRecord | null>({
    id: 'escrow-8801',
    orderNumber: 'KS-2026-8801',
    totalAmountUSD: 400,
    totalAmountIDR: 6200000,
    releasedAmountUSD: 100,
    releasedAmountIDR: 1550000,
    heldAmountUSD: 300,
    heldAmountIDR: 4650000,
    status: 'PARTIALLY_RELEASED',
    lastUpdated: '2026-07-28T14:30:00Z',
  });

  // Sample Warranty
  const [warranty, setWarranty] = useState<WarrantyClaimRecord | null>({
    id: 'warr-8801',
    orderNumber: 'KS-2026-8801',
    title: '30-Day Code Warranty & Anti-Bug Guarantee',
    description: 'Perbaikan bug gratis jika terjadi kerentanan kode atau error DataStore dalam 30 hari pasca rilis.',
    status: 'ACTIVE',
    startDate: '2026-07-15T10:00:00Z',
    endDate: '2026-08-14T10:00:00Z',
    daysRemaining: 12,
    reportedIssuesCount: 0,
  });

  // Sample Notifications
  const [notifications, setNotifications] = useState<OrderWorkspaceNotification[]>([
    {
      id: 'notif-1',
      orderNumber: 'KS-2026-8801',
      type: 'MILESTONE_SUBMITTED',
      title: 'Milestone 2 (50%) Telah Diunggah Developer',
      message: 'Developer @Ahmad Studio telah mengunggah hasil pengerjaan. Silakan periksa di Roblox Studio Place.',
      read: false,
      createdAt: '2 jam yang lalu',
    },
    {
      id: 'notif-2',
      orderNumber: 'KS-2026-8801',
      type: 'ESCROW_RELEASED',
      title: 'Dana DP Milestone 1 Released',
      message: 'Dana sebesar Rp 1.550.000 telah dirilis dari Escrow Vault ke Developer.',
      read: true,
      createdAt: '1 minggu yang lalu',
    },
  ]);

  const updateMilestoneStatus = useCallback(
    (
      stage: 25 | 50 | 100,
      status: OrderMilestoneItem['status'],
      deliverableNotes?: string,
      deliverableUrl?: string
    ) => {
      setMilestones((prev) =>
        prev.map((m) => {
          if (m.stage === stage) {
            return {
              ...m,
              status,
              ...(deliverableNotes !== undefined ? { deliverableNotes } : {}),
              ...(deliverableUrl !== undefined ? { deliverableUrl } : {}),
            };
          }
          return m;
        })
      );
    },
    []
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return {
    activeOrderNumber,
    setActiveOrderNumber,
    milestones,
    setMilestones,
    updateMilestoneStatus,
    escrow,
    setEscrow,
    warranty,
    setWarranty,
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
  };
};
