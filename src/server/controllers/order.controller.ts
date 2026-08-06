import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import * as orderService from '../services/order.service.js';
import { parsePagination } from '../validators/index.js';
import { ForbiddenError } from '../errors/index.js';

export async function createOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.clientProfileId) {
      throw new ForbiddenError('Profil client tidak ditemukan untuk akun ini.');
    }
    const result = await orderService.createOrder(req.user.id, req.user.clientProfileId, req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function listOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const pagination = parsePagination(req.query);
    const isAdmin = req.user?.roles.includes('ADMIN') || false;

    const result = await orderService.listOrders({
      ...pagination,
      clientProfileId: req.user?.clientProfileId || undefined,
      developerProfileId: req.user?.developerProfileId || undefined,
      status: req.query.status as string,
      isAdmin,
    });

    res.json({
      success: true,
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
}

export async function getOrderByNumber(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { orderNumber } = req.params;
    const order = await orderService.getOrderByNumber(orderNumber, req.user);
    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
}

export async function cancelOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { orderNumber } = req.params;
    const isAdmin = req.user?.roles.includes('ADMIN') || false;
    const updated = await orderService.cancelOrder(orderNumber, req.user!.id, req.user?.clientProfileId || undefined, isAdmin);
    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

export async function acceptOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { orderNumber } = req.params;
    if (!req.user?.developerProfileId) {
      throw new ForbiddenError('Profil developer tidak ditemukan untuk akun ini.');
    }
    const updated = await orderService.acceptOrder(orderNumber, req.user.id, req.user.developerProfileId);
    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

export async function rejectOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { orderNumber } = req.params;
    if (!req.user?.developerProfileId) {
      throw new ForbiddenError('Profil developer tidak ditemukan untuk akun ini.');
    }
    const updated = await orderService.rejectOrder(orderNumber, req.user.id, req.user.developerProfileId, req.body.reason);
    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}


export async function getOrderEvents(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { orderNumber } = req.params;
    const events = await orderService.getOrderEvents(orderNumber);
    res.json({
      success: true,
      data: events,
    });
  } catch (error) {
    next(error);
  }
}
