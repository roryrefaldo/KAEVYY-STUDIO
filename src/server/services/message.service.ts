import { db } from '../../db/index.js';
import { conversations, conversationMembers, messages, orders, clientProfiles, developerProfiles, users } from '../../db/schema/index.js';
import { eq, and, desc, inArray, isNull } from 'drizzle-orm';
import { NotFoundError, ForbiddenError } from '../errors/index.js';
import { safeDbExecute } from '../../db/mockDb.js';
import { mockData } from '../../db/mockStore.js';

export async function getUserConversations(userId: string) {
  return safeDbExecute(
    async () => {
      const memberRows = await db
        .select({ conversationId: conversationMembers.conversationId })
        .from(conversationMembers)
        .where(eq(conversationMembers.userId, userId));

      const convIds = memberRows.map((m) => m.conversationId);
      if (convIds.length === 0) return [];

      return await db.select().from(conversations).where(inArray(conversations.id, convIds));
    },
    async () => {
      const members = mockData.conversationMembers.filter((m) => m.userId === userId);
      const convIds = members.map((m) => m.conversationId);
      return mockData.conversations.filter((c) => convIds.includes(c.id));
    }
  );
}

export async function getConversationMessages(conversationId: string, userId: string) {
  return safeDbExecute(
    async () => {
      return await db
        .select()
        .from(messages)
        .where(and(eq(messages.conversationId, conversationId), isNull(messages.deletedAt)))
        .orderBy(messages.createdAt);
    },
    async () => {
      return mockData.messages
        .filter((m) => m.conversationId === conversationId && !m.deletedAt)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
  );
}

export async function getOrCreateConversationForOrder(orderNumber: string) {
  return safeDbExecute(
    async () => {
      const orderRows = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
      if (orderRows.length === 0) {
        throw new NotFoundError('ORDER_NOT_FOUND', `Pesanan ${orderNumber} tidak ditemukan.`);
      }
      const order = orderRows[0];

      let convRows = await db.select().from(conversations).where(eq(conversations.orderId, order.id)).limit(1);
      let conv = convRows[0];

      if (!conv) {
        const [newConv] = await db.insert(conversations).values({ orderId: order.id }).returning();
        conv = newConv;

        // Add client member
        if (order.clientProfileId) {
          const clientRows = await db.select().from(clientProfiles).where(eq(clientProfiles.id, order.clientProfileId)).limit(1);
          if (clientRows.length > 0) {
            await db.insert(conversationMembers).values({ conversationId: conv.id, userId: clientRows[0].userId }).onConflictDoNothing();
          }
        }

        // Add dev member
        if (order.developerProfileId) {
          const devRows = await db.select().from(developerProfiles).where(eq(developerProfiles.id, order.developerProfileId)).limit(1);
          if (devRows.length > 0) {
            await db.insert(conversationMembers).values({ conversationId: conv.id, userId: devRows[0].userId }).onConflictDoNothing();
          }
        }
      }

      return conv;
    },
    async () => {
      const order = mockData.orders.find((o) => o.orderNumber === orderNumber);
      if (!order) {
        throw new NotFoundError('ORDER_NOT_FOUND', `Pesanan ${orderNumber} tidak ditemukan.`);
      }

      let conv = mockData.conversations.find((c) => c.orderId === order.id);
      if (!conv) {
        conv = {
          id: `conv_${order.id}`,
          orderId: order.id,
          createdAt: new Date(),
        };
        mockData.conversations.push(conv);

        if (order.clientProfileId) {
          const client = mockData.clientProfiles.find((c) => c.id === order.clientProfileId);
          if (client) {
            mockData.conversationMembers.push({ conversationId: conv.id, userId: client.userId });
          }
        }

        if (order.developerProfileId) {
          const dev = mockData.developerProfiles.find((d) => d.id === order.developerProfileId);
          if (dev) {
            mockData.conversationMembers.push({ conversationId: conv.id, userId: dev.userId });
          }
        }
      }

      return conv;
    }
  );
}

export async function sendMessage(conversationId: string, senderUserId: string, content: string, attachments?: any) {
  return safeDbExecute(
    async () => {
      const [msg] = await db
        .insert(messages)
        .values({
          conversationId,
          senderId: senderUserId,
          content,
          attachments: attachments || null,
        })
        .returning();

      return msg;
    },
    async () => {
      const msg = {
        id: `msg_${Date.now()}`,
        conversationId,
        senderId: senderUserId,
        content,
        attachments: attachments || null,
        createdAt: new Date(),
        readAt: null as Date | null,
      };
      mockData.messages.push(msg as any);
      return msg;
    }
  );
}

export async function sendOrderMessage(
  orderNumber: string,
  senderUserId: string,
  data: { content: string; attachments?: any; replyToId?: string }
) {
  const conv = await getOrCreateConversationForOrder(orderNumber);

  return safeDbExecute(
    async () => {
      const [sender] = await db.select().from(users).where(eq(users.id, senderUserId)).limit(1);

      let replyToMsg: any = null;
      if (data.replyToId) {
        const [r] = await db.select().from(messages).where(eq(messages.id, data.replyToId)).limit(1);
        if (r) {
          const [rSender] = await db.select().from(users).where(eq(users.id, r.senderId!)).limit(1);
          replyToMsg = {
            id: r.id,
            senderName: rSender?.displayName || 'Pengguna',
            content: r.content,
          };
        }
      }

      const [msg] = await db
        .insert(messages)
        .values({
          conversationId: conv.id,
          senderId: senderUserId,
          content: data.content,
          attachments: data.attachments || null,
          replyToId: data.replyToId || null,
        })
        .returning();

      return {
        id: msg.id,
        conversationId: conv.id,
        orderNumber,
        senderId: senderUserId,
        senderName: sender?.displayName || 'KAEVY User',
        senderAvatar: sender?.avatarUrl || null,
        content: msg.content,
        attachments: msg.attachments as any,
        replyToId: msg.replyToId,
        replyTo: replyToMsg,
        isEdited: false,
        editedAt: null,
        deletedAt: null,
        createdAt: msg.createdAt.toISOString(),
        readAt: null,
        readBy: [senderUserId],
      };
    },
    async () => {
      const sender = mockData.users.find((u) => u.id === senderUserId);

      let replyToMsg: any = null;
      if (data.replyToId) {
        const r = mockData.messages.find((m) => m.id === data.replyToId);
        if (r) {
          const rSender = mockData.users.find((u) => u.id === r.senderId);
          replyToMsg = {
            id: r.id,
            senderName: rSender?.displayName || 'Pengguna',
            content: r.content,
          };
        }
      }

      const msg: any = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        conversationId: conv.id,
        senderId: senderUserId,
        content: data.content,
        attachments: data.attachments || null,
        replyToId: data.replyToId || null,
        replyTo: replyToMsg,
        createdAt: new Date(),
        readAt: null,
        isEdited: false,
        editedAt: null,
        deletedAt: null,
      };

      mockData.messages.push(msg);

      return {
        id: msg.id,
        conversationId: conv.id,
        orderNumber,
        senderId: senderUserId,
        senderName: sender?.displayName || 'KAEVY User',
        senderAvatar: sender?.avatarUrl || null,
        content: msg.content,
        attachments: msg.attachments,
        replyToId: msg.replyToId,
        replyTo: replyToMsg,
        isEdited: false,
        editedAt: null,
        deletedAt: null,
        createdAt: msg.createdAt.toISOString(),
        readAt: null,
        readBy: [senderUserId],
      };
    }
  );
}

export async function getOrderMessages(orderNumber: string, userId: string, limit = 50, offset = 0) {
  const conv = await getOrCreateConversationForOrder(orderNumber);

  return safeDbExecute(
    async () => {
      const rows = await db
        .select()
        .from(messages)
        .where(and(eq(messages.conversationId, conv.id), isNull(messages.deletedAt)))
        .orderBy(messages.createdAt)
        .limit(limit)
        .offset(offset);

      const formatted = await Promise.all(
        rows.map(async (m) => {
          const [sender] = await db.select().from(users).where(eq(users.id, m.senderId!)).limit(1);

          let replyToMsg: any = null;
          if (m.replyToId) {
            const [r] = await db.select().from(messages).where(eq(messages.id, m.replyToId)).limit(1);
            if (r) {
              const [rSender] = await db.select().from(users).where(eq(users.id, r.senderId!)).limit(1);
              replyToMsg = {
                id: r.id,
                senderName: rSender?.displayName || 'Pengguna',
                content: r.content,
              };
            }
          }

          return {
            id: m.id,
            conversationId: conv.id,
            orderNumber,
            senderId: m.senderId || '',
            senderName: sender?.displayName || 'KAEVY User',
            senderAvatar: sender?.avatarUrl || null,
            content: m.content,
            attachments: m.attachments as any,
            replyToId: m.replyToId,
            replyTo: replyToMsg,
            isEdited: m.isEdited || false,
            editedAt: m.editedAt ? m.editedAt.toISOString() : null,
            deletedAt: m.deletedAt ? m.deletedAt.toISOString() : null,
            createdAt: m.createdAt.toISOString(),
            readAt: m.readAt ? m.readAt.toISOString() : null,
            readBy: m.readAt ? [m.senderId || ''] : [],
          };
        })
      );

      return formatted;
    },
    async () => {
      const rows = mockData.messages
        .filter((m) => m.conversationId === conv.id && !m.deletedAt)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .slice(offset, offset + limit);

      return rows.map((m) => {
        const sender = mockData.users.find((u) => u.id === m.senderId);

        let replyToMsg = m.replyTo || null;
        if (!replyToMsg && m.replyToId) {
          const r = mockData.messages.find((msg) => msg.id === m.replyToId);
          if (r) {
            const rSender = mockData.users.find((u) => u.id === r.senderId);
            replyToMsg = {
              id: r.id,
              senderName: rSender?.displayName || 'Pengguna',
              content: r.content,
            };
          }
        }

        return {
          id: m.id,
          conversationId: conv.id,
          orderNumber,
          senderId: m.senderId,
          senderName: sender?.displayName || 'KAEVY User',
          senderAvatar: sender?.avatarUrl || null,
          content: m.content,
          attachments: m.attachments || null,
          replyToId: m.replyToId || null,
          replyTo: replyToMsg,
          isEdited: m.isEdited || false,
          editedAt: m.editedAt ? new Date(m.editedAt).toISOString() : null,
          deletedAt: m.deletedAt ? new Date(m.deletedAt).toISOString() : null,
          createdAt: new Date(m.createdAt).toISOString(),
          readAt: m.readAt ? new Date(m.readAt).toISOString() : null,
          readBy: m.readAt ? [m.senderId] : [],
        };
      });
    }
  );
}

export async function editOrderMessage(messageId: string, userId: string, newContent: string) {
  return safeDbExecute(
    async () => {
      const [existing] = await db.select().from(messages).where(eq(messages.id, messageId)).limit(1);
      if (!existing) throw new NotFoundError('MESSAGE_NOT_FOUND', 'Pesan tidak ditemukan.');
      if (existing.senderId !== userId) throw new ForbiddenError('Anda hanya dapat mengubah pesan Anda sendiri.');

      const now = new Date();
      const [updated] = await db
        .update(messages)
        .set({ content: newContent, isEdited: true, editedAt: now })
        .where(eq(messages.id, messageId))
        .returning();

      return { messageId, content: updated.content, editedAt: now.toISOString() };
    },
    async () => {
      const existing = mockData.messages.find((m) => m.id === messageId);
      if (!existing) throw new NotFoundError('MESSAGE_NOT_FOUND', 'Pesan tidak ditemukan.');
      if (existing.senderId !== userId) throw new ForbiddenError('Anda hanya dapat mengubah pesan Anda sendiri.');

      const now = new Date();
      existing.content = newContent;
      existing.isEdited = true;
      existing.editedAt = now;

      return { messageId, content: newContent, editedAt: now.toISOString() };
    }
  );
}

export async function deleteOrderMessage(messageId: string, userId: string) {
  return safeDbExecute(
    async () => {
      const [existing] = await db.select().from(messages).where(eq(messages.id, messageId)).limit(1);
      if (!existing) throw new NotFoundError('MESSAGE_NOT_FOUND', 'Pesan tidak ditemukan.');
      if (existing.senderId !== userId) throw new ForbiddenError('Anda hanya dapat menghapus pesan Anda sendiri.');

      const now = new Date();
      await db
        .update(messages)
        .set({ deletedAt: now })
        .where(eq(messages.id, messageId));

      return { messageId };
    },
    async () => {
      const existing = mockData.messages.find((m) => m.id === messageId);
      if (!existing) throw new NotFoundError('MESSAGE_NOT_FOUND', 'Pesan tidak ditemukan.');
      if (existing.senderId !== userId) throw new ForbiddenError('Anda hanya dapat menghapus pesan Anda sendiri.');

      existing.deletedAt = new Date();
      return { messageId };
    }
  );
}

export async function markOrderMessagesRead(orderNumber: string, userId: string, messageIds?: string[]) {
  const conv = await getOrCreateConversationForOrder(orderNumber);

  return safeDbExecute(
    async () => {
      const now = new Date();
      if (messageIds && messageIds.length > 0) {
        await db
          .update(messages)
          .set({ readAt: now })
          .where(and(eq(messages.conversationId, conv.id), inArray(messages.id, messageIds)));
      } else {
        await db
          .update(messages)
          .set({ readAt: now })
          .where(and(eq(messages.conversationId, conv.id), isNull(messages.readAt)));
      }
      return { orderNumber, userId, readAt: now.toISOString() };
    },
    async () => {
      const now = new Date();
      mockData.messages.forEach((m) => {
        if (m.conversationId === conv.id && (!messageIds || messageIds.includes(m.id))) {
          m.readAt = now;
        }
      });
      return { orderNumber, userId, readAt: now.toISOString() };
    }
  );
}

