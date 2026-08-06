import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import * as adminService from '../services/admin.service.js';
import { parsePagination, validateUUID } from '../validators/index.js';

export async function getDashboardStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const stats = await adminService.getAdminDashboardStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

export async function listAuditLogs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const pagination = parsePagination(req.query);
    const result = await adminService.listAuditLogs(pagination);
    res.json({
      success: true,
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
}

export async function approveVerification(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = validateUUID(req.params.id, 'Submission ID');
    const { tier, notes } = req.body;
    const result = await adminService.approveDeveloperVerification(id, req.user!.id, tier, notes);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function rejectVerification(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = validateUUID(req.params.id, 'Submission ID');
    const { notes } = req.body;
    const result = await adminService.rejectDeveloperVerification(id, req.user!.id, notes);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function suspendUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = validateUUID(req.params.id, 'User ID');
    const { reason } = req.body;
    const result = await adminService.suspendUser(id, req.user!.id, reason);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function activateUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = validateUUID(req.params.id, 'User ID');
    const { reason } = req.body;
    const result = await adminService.activateUser(id, req.user!.id, reason);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
