import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import * as projectService from '../services/project.service.js';
import { validateUUID } from '../validators/index.js';
import { ForbiddenError } from '../errors/index.js';

export async function getProjectById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = validateUUID(req.params.id, 'Project ID');
    const project = await projectService.getProjectById(id, req.user);
    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
}

export async function submitMilestone(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = validateUUID(req.params.id, 'Project ID');
    const percentage = parseInt(req.params.percentage, 10);
    if (!req.user?.developerProfileId) {
      throw new ForbiddenError('Profil developer tidak ditemukan untuk akun ini.');
    }

    const { notes } = req.body;
    const submitted = await projectService.submitMilestone(
      id,
      percentage,
      req.user.developerProfileId,
      req.user.id,
      notes
    );

    res.json({
      success: true,
      data: submitted,
    });
  } catch (error) {
    next(error);
  }
}

export async function approveMilestone(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = validateUUID(req.params.id, 'Project ID');
    const percentage = parseInt(req.params.percentage, 10);
    if (!req.user?.clientProfileId) {
      throw new ForbiddenError('Profil client tidak ditemukan untuk akun ini.');
    }

    const approved = await projectService.approveMilestone(
      id,
      percentage,
      req.user.clientProfileId,
      req.user.id
    );

    res.json({
      success: true,
      data: approved,
    });
  } catch (error) {
    next(error);
  }
}

export async function requestRevision(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = validateUUID(req.params.id, 'Project ID');
    const percentage = parseInt(req.params.percentage, 10);
    if (!req.user?.clientProfileId) {
      throw new ForbiddenError('Profil client tidak ditemukan untuk akun ini.');
    }

    const { revisionNotes } = req.body;
    const revised = await projectService.requestMilestoneRevision(
      id,
      percentage,
      req.user.clientProfileId,
      req.user.id,
      revisionNotes
    );

    res.json({
      success: true,
      data: revised,
    });
  } catch (error) {
    next(error);
  }
}
