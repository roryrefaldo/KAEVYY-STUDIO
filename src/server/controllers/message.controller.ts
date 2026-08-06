import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import * as messageService from '../services/message.service.js';
import { validateUUID } from '../validators/index.js';

export async function getConversations(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const convs = await messageService.getUserConversations(req.user!.id);
    res.json({
      success: true,
      data: convs,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMessages(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = validateUUID(req.params.id, 'Conversation ID');
    const msgs = await messageService.getConversationMessages(id, req.user!.id);
    res.json({
      success: true,
      data: msgs,
    });
  } catch (error) {
    next(error);
  }
}

export async function getOrderMessages(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { orderNumber } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const msgs = await messageService.getOrderMessages(orderNumber, req.user!.id, limit, offset);
    res.json({
      success: true,
      data: msgs,
    });
  } catch (error) {
    next(error);
  }
}

export async function sendOrderMessage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { orderNumber } = req.params;
    const { content, attachments, replyToId } = req.body;
    const msg = await messageService.sendOrderMessage(orderNumber, req.user!.id, {
      content,
      attachments,
      replyToId,
    });
    res.status(201).json({
      success: true,
      data: msg,
    });
  } catch (error) {
    next(error);
  }
}

export async function editMessage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const result = await messageService.editOrderMessage(id, req.user!.id, content);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteMessage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const result = await messageService.deleteOrderMessage(id, req.user!.id);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function sendMessage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = validateUUID(req.params.id, 'Conversation ID');
    const { content, attachments } = req.body;
    const msg = await messageService.sendMessage(id, req.user!.id, content, attachments);
    res.status(201).json({
      success: true,
      data: msg,
    });
  } catch (error) {
    next(error);
  }
}

