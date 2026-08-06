import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import * as assetService from '../services/asset.service.js';
import { parsePagination, validateUUID } from '../validators/index.js';

export async function listPublicAssets(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const pagination = parsePagination(req.query);
    const result = await assetService.listPublicAssets({
      ...pagination,
      search: req.query.search as string,
      category: req.query.category as string,
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

export async function getAssetById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = validateUUID(req.params.id, 'Asset ID');
    const asset = await assetService.getAssetById(id);
    res.json({
      success: true,
      data: asset,
    });
  } catch (error) {
    next(error);
  }
}

export async function downloadAsset(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = validateUUID(req.params.id, 'Asset ID');
    const dl = await assetService.downloadAsset(id, req.user?.id);
    res.json({
      success: true,
      data: dl,
    });
  } catch (error) {
    next(error);
  }
}

export async function createAsset(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const created = await assetService.createShareAsset(req.user!.id, req.body);
    res.status(201).json({
      success: true,
      data: created,
    });
  } catch (error) {
    next(error);
  }
}

export async function submitForReview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = validateUUID(req.params.id, 'Asset ID');
    const submitted = await assetService.submitAssetForReview(id, req.user!.id);
    res.json({
      success: true,
      data: submitted,
    });
  } catch (error) {
    next(error);
  }
}

export async function moderateAsset(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = validateUUID(req.params.id, 'Asset ID');
    const { action, notes } = req.body;
    const moderated = await assetService.moderateAssetByAdmin(id, req.user!.id, action, notes);
    res.json({
      success: true,
      data: moderated,
    });
  } catch (error) {
    next(error);
  }
}
