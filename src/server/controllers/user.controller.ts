import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import * as userService from '../services/user.service.js';
import { serializeUser } from '../serializers/index.js';

export async function getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const user = await userService.getUserById(req.user!.id);
    res.json({
      success: true,
      data: serializeUser(user),
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { displayName, avatarUrl } = req.body;
    const updated = await userService.updateUserProfile(req.user!.id, { displayName, avatarUrl });
    res.json({
      success: true,
      data: serializeUser(updated),
    });
  } catch (error) {
    next(error);
  }
}

export async function getPreferences(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const prefs = await userService.getUserPreferences(req.user!.id);
    res.json({
      success: true,
      data: prefs,
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePreferences(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const prefs = await userService.updateUserPreferences(req.user!.id, req.body);
    res.json({
      success: true,
      data: prefs,
    });
  } catch (error) {
    next(error);
  }
}
