import { useState, useEffect, useCallback } from 'react';
import { orderWorkspaceApi } from '../api/orderWorkspaceApi';
import { OrderWorkspaceNotification } from '../types/orderWorkspace.types';

export const useNotifications = () => {
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
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await orderWorkspaceApi.getNotifications();
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.warn('Notifications loaded from local state');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markRead = async (id: string) => {
    try {
      await orderWorkspaceApi.markNotificationRead(id);
    } catch (err) {
      console.warn('Notification marked read locally');
    } finally {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    }
  };

  const markAllRead = async () => {
    try {
      await orderWorkspaceApi.markAllNotificationsRead();
    } catch (err) {
      console.warn('All notifications marked read locally');
    } finally {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    loading,
    markRead,
    markAllRead,
    refreshNotifications: fetchNotifications,
  };
};
