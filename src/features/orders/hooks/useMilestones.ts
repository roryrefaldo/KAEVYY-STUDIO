import { useState } from 'react';
import { orderWorkspaceApi } from '../api/orderWorkspaceApi';
import { OrderMilestoneItem } from '../types/orderWorkspace.types';

export const useMilestones = (initialMilestones?: OrderMilestoneItem[]) => {
  const [milestones, setMilestones] = useState<OrderMilestoneItem[]>(
    initialMilestones || [
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
    ]
  );
  const [submitting, setSubmitting] = useState(false);

  const submitMilestoneDeliverable = async (
    projectId: string,
    percentage: 25 | 50 | 100,
    notes?: string,
    deliverableUrl?: string
  ) => {
    setSubmitting(true);
    try {
      await orderWorkspaceApi.submitMilestone(projectId, percentage, notes, deliverableUrl);
    } catch (err) {
      console.warn('Milestone submitted locally (offline mode fallback)');
    } finally {
      setMilestones((prev) =>
        prev.map((m) =>
          m.stage === percentage
            ? { ...m, status: 'SUBMITTED', deliverableNotes: notes, deliverableUrl, submittedAt: new Date().toISOString() }
            : m
        )
      );
      setSubmitting(false);
    }
  };

  const approveMilestoneRelease = async (projectId: string, percentage: 25 | 50 | 100) => {
    setSubmitting(true);
    try {
      await orderWorkspaceApi.approveMilestone(projectId, percentage);
    } catch (err) {
      console.warn('Milestone approved locally (offline mode fallback)');
    } finally {
      setMilestones((prev) =>
        prev.map((m) =>
          m.stage === percentage
            ? { ...m, status: 'APPROVED', approvedAt: new Date().toISOString() }
            : m
        )
      );
      setSubmitting(false);
    }
  };

  const requestRevision = async (
    projectId: string,
    percentage: 25 | 50 | 100,
    revisionNotes: string
  ) => {
    setSubmitting(true);
    try {
      await orderWorkspaceApi.requestMilestoneRevision(projectId, percentage, revisionNotes);
    } catch (err) {
      console.warn('Revision requested locally (offline mode fallback)');
    } finally {
      setMilestones((prev) =>
        prev.map((m) =>
          m.stage === percentage
            ? { ...m, status: 'REVISION_REQUESTED', revisionNotes }
            : m
        )
      );
      setSubmitting(false);
    }
  };

  return {
    milestones,
    submitting,
    submitMilestoneDeliverable,
    approveMilestoneRelease,
    requestRevision,
  };
};
