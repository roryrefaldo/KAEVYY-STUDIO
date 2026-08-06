import { useState } from 'react';
import { WarrantyClaimRecord } from '../types/orderWorkspace.types';

export const useWarranty = (initialWarranty?: WarrantyClaimRecord | null) => {
  const [warranty, setWarranty] = useState<WarrantyClaimRecord | null>(
    initialWarranty || {
      id: 'warr-8801',
      orderNumber: 'KS-2026-8801',
      title: '30-Day Code Warranty & Anti-Bug Guarantee',
      description: 'Garansi pemeliharaan dan perbaikan bug gratis selama 30 hari pasca rilis source code.',
      status: 'ACTIVE',
      startDate: '2026-07-15T10:00:00Z',
      endDate: '2026-08-14T10:00:00Z',
      daysRemaining: 12,
      reportedIssuesCount: 0,
    }
  );

  const submitWarrantyClaim = (issueTitle: string, issueDetails: string) => {
    if (!warranty) return;
    setWarranty((prev) =>
      prev
        ? {
            ...prev,
            status: 'CLAIM_SUBMITTED',
            reportedIssuesCount: prev.reportedIssuesCount + 1,
          }
        : null
    );
  };

  return {
    warranty,
    submitWarrantyClaim,
  };
};
