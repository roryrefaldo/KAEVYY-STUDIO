import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import * as serviceService from '../services/service.service.js';
import { parsePagination, validateUUID } from '../validators/index.js';
import { ForbiddenError } from '../errors/index.js';

export async function listServices(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const pagination = parsePagination(req.query);
    const result = await serviceService.listServices({
      ...pagination,
      search: req.query.search as string,
      category: req.query.category as string,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      currency: req.query.currency as string,
      developerId: req.query.developerId as string,
      status: req.query.status as string,
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

export async function getServiceById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = validateUUID(req.params.id, 'Service ID');
    const service = await serviceService.getServiceById(id);
    res.json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
}

export async function createService(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.developerProfileId) {
      throw new ForbiddenError('Profil developer tidak ditemukan untuk akun ini.');
    }
    const created = await serviceService.createService(req.user.developerProfileId, req.body);
    res.status(201).json({
      success: true,
      data: created,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateService(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = validateUUID(req.params.id, 'Service ID');
    const isAdmin = req.user?.roles.includes('ADMIN') || false;
    const devId = req.user?.developerProfileId || '';

    const updated = await serviceService.updateService(id, devId, req.body, isAdmin);
    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteService(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = validateUUID(req.params.id, 'Service ID');
    const isAdmin = req.user?.roles.includes('ADMIN') || false;
    const devId = req.user?.developerProfileId || '';

    const deleted = await serviceService.deleteService(id, devId, isAdmin);
    res.json({
      success: true,
      data: deleted,
    });
  } catch (error) {
    next(error);
  }
}
