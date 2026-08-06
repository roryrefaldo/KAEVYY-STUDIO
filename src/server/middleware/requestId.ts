import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';

export function requestIdMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const reqId = (req.headers['x-request-id'] as string) || `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  req.requestId = reqId;
  res.setHeader('X-Request-Id', reqId);
  next();
}
