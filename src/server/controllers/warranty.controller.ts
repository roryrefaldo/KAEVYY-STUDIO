import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import * as warrantyService from '../services/warranty.service.js';
import { validateUUID } from '../validators/index.js';
import { ForbiddenError } from '../errors/index.js';

export async function getWarrantyForOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { orderNumber } = req.params;
    const warranty = await warrantyService.getWarrantyForOrder(orderNumber, req.user);
    res.json({
      success: true,
      data: warranty,
    });
  } catch (error) {
    next(error);
  }
}

export async function createWarrantyTicket(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { orderNumber } = req.params;
    if (!req.user?.clientProfileId) {
      throw new ForbiddenError('Profil client tidak ditemukan untuk akun ini.');
    }
    const { title, bugDescription } = req.body;
    const ticket = await warrantyService.createWarrantyTicket(orderNumber, req.user.clientProfileId, title, bugDescription);
    res.status(201).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTicketStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = validateUUID(req.params.id, 'Ticket ID');
    const { status } = req.body;
    const updated = await warrantyService.updateWarrantyTicketStatus(id, status, req.user);
    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

export async function createReview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { orderNumber } = req.params;
    if (!req.user?.clientProfileId) {
      throw new ForbiddenError('Profil client tidak ditemukan untuk akun ini.');
    }
    const { rating, reviewText } = req.body;
    const rev = await warrantyService.createReviewForOrder(orderNumber, req.user.clientProfileId, rating, reviewText);
    res.status(201).json({
      success: true,
      data: rev,
    });
  } catch (error) {
    next(error);
  }
}
