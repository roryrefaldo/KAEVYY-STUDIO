import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import * as paymentService from '../services/payment.service.js';
import { validateUUID } from '../validators/index.js';

export async function createPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { orderNumber } = req.params;
    const { paymentMethodCategory } = req.body;
    const result = await paymentService.createPaymentForOrder(orderNumber, paymentMethodCategory, req.user);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function markPaymentPaid(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const paymentId = validateUUID(req.params.id, 'Payment ID');
    const { providerTransactionId } = req.body;
    const paid = await paymentService.markPaymentPaid(paymentId, providerTransactionId, req.user?.id);
    res.json({
      success: true,
      data: paid,
    });
  } catch (error) {
    next(error);
  }
}

export async function getEscrowForOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { orderNumber } = req.params;
    const escrow = await paymentService.getEscrowForOrder(orderNumber, req.user);
    res.json({
      success: true,
      data: escrow,
    });
  } catch (error) {
    next(error);
  }
}

export async function releaseEscrow(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = validateUUID(req.params.id, 'Escrow ID');
    const { justificationReason } = req.body;
    const released = await paymentService.releaseEscrowByAdmin(id, req.user!.id, justificationReason);
    res.json({
      success: true,
      data: released,
    });
  } catch (error) {
    next(error);
  }
}

export async function refundEscrow(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = validateUUID(req.params.id, 'Escrow ID');
    const { justificationReason } = req.body;
    const refunded = await paymentService.refundEscrowByAdmin(id, req.user!.id, justificationReason);
    res.json({
      success: true,
      data: refunded,
    });
  } catch (error) {
    next(error);
  }
}
