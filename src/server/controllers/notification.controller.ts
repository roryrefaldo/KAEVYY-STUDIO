import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import * as notifService from '../services/notification.service.js';
import { validateUUID } from '../validators/index.js';

export async function getNotifications(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const notifs = await notifService.getUserNotifications(req.user!.id);
    res.json({
      success: true,
      data: notifs,
    });
  } catch (error) {
    next(error);
  }
}

export async function markRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = validateUUID(req.params.id, 'Notification ID');
    const updated = await notifService.markNotificationRead(id, req.user!.id);
    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

export async function markAllRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const result = await notifService.markAllNotificationsRead(req.user!.id);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
