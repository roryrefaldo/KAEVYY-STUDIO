import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import * as disputeService from '../services/dispute.service.js';
import { validateUUID } from '../validators/index.js';

export async function openDispute(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { orderNumber } = req.params;
    const { reason } = req.body;
    const dispute = await disputeService.openDisputeForOrder(orderNumber, req.user, reason);
    res.status(201).json({
      success: true,
      data: dispute,
    });
  } catch (error) {
    next(error);
  }
}

export async function getDisputeForOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { orderNumber } = req.params;
    const dispute = await disputeService.getDisputeForOrder(orderNumber, req.user);
    res.json({
      success: true,
      data: dispute,
    });
  } catch (error) {
    next(error);
  }
}

export async function submitEvidence(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = validateUUID(req.params.id, 'Dispute ID');
    const { statement, fileStorageKey } = req.body;
    const evidence = await disputeService.submitDisputeEvidence(id, req.user!.id, statement, fileStorageKey);
    res.status(201).json({
      success: true,
      data: evidence,
    });
  } catch (error) {
    next(error);
  }
}

export async function resolveDispute(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = validateUUID(req.params.id, 'Dispute ID');
    const { resolutionType, refundAmount, developerReleaseAmount, justificationReason } = req.body;
    const resolved = await disputeService.resolveDisputeByAdmin(
      id,
      req.user!.id,
      resolutionType,
      refundAmount,
      developerReleaseAmount,
      justificationReason
    );
    res.json({
      success: true,
      data: resolved,
    });
  } catch (error) {
    next(error);
  }
}
