import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import * as devService from '../services/developer.service.js';
import { parsePagination, validateUUID } from '../validators/index.js';
import { ForbiddenError } from '../errors/index.js';

export async function listDevelopers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const pagination = parsePagination(req.query);
    const result = await devService.listDevelopers({
      ...pagination,
      specialization: req.query.specialization as string,
      tier: req.query.tier as string,
      search: req.query.search as string,
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

export async function getDeveloperById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = validateUUID(req.params.id, 'Developer ID');
    const dev = await devService.getDeveloperById(id);
    res.json({
      success: true,
      data: dev,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.developerProfileId) {
      throw new ForbiddenError('Profil developer tidak ditemukan untuk akun ini.');
    }
    const dev = await devService.getDeveloperById(req.user.developerProfileId);
    res.json({
      success: true,
      data: dev,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMyProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.developerProfileId) {
      throw new ForbiddenError('Profil developer tidak ditemukan untuk akun ini.');
    }
    const updated = await devService.updateDeveloperProfile(req.user.developerProfileId, req.body);
    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyCapacity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.developerProfileId) {
      throw new ForbiddenError('Profil developer tidak ditemukan untuk akun ini.');
    }
    const capacity = await devService.getDeveloperCapacity(req.user.developerProfileId);
    res.json({
      success: true,
      data: capacity,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyEarnings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.developerProfileId) {
      throw new ForbiddenError('Profil developer tidak ditemukan untuk akun ini.');
    }
    const earnings = await devService.getDeveloperEarnings(req.user.developerProfileId);
    res.json({
      success: true,
      data: earnings,
    });
  } catch (error) {
    next(error);
  }
}

export async function submitVerification(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.developerProfileId) {
      throw new ForbiddenError('Profil developer tidak ditemukan untuk akun ini.');
    }
    const { portfolioUrl, notes } = req.body;
    const sub = await devService.submitVerification(req.user.developerProfileId, portfolioUrl, notes);
    res.status(201).json({
      success: true,
      data: sub,
    });
  } catch (error) {
    next(error);
  }
}

export async function getVerificationStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.developerProfileId) {
      throw new ForbiddenError('Profil developer tidak ditemukan untuk akun ini.');
    }
    const status = await devService.getVerificationStatus(req.user.developerProfileId);
    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    next(error);
  }
}
