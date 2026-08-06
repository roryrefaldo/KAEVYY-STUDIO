export interface SocketUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string | null;
  roles?: string[];
  role?: string;
}

export interface AttachmentItem {
  id: string;
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  fileType: 'IMAGE' | 'RBXL' | 'ZIP' | 'LUA' | 'DOC' | 'OTHER';
  downloadUrl: string;
  storageKey?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  orderNumber: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string | null;
  content: string;
  attachments?: AttachmentItem[] | null;
  replyToId?: string | null;
  replyTo?: {
    id: string;
    senderName: string;
    content: string;
  } | null;
  isEdited?: boolean;
  editedAt?: string | null;
  deletedAt?: string | null;
  createdAt: string;
  readAt?: string | null;
  readBy?: string[];
}

export interface UserPresence {
  userId: string;
  displayName: string;
  avatarUrl?: string | null;
  isOnline: boolean;
  lastActive: string;
}

export interface NotificationPayload {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
  readAt?: string | null;
}

// Client -> Server Events
export interface ClientToServerEvents {
  joinRoom: (data: { orderNumber: string }, callback?: (res: { success: boolean; error?: string }) => void) => void;
  leaveRoom: (data: { orderNumber: string }) => void;
  newMessage: (data: { orderNumber: string; content: string; attachments?: AttachmentItem[]; replyToId?: string }, callback?: (res: { success: boolean; message?: ChatMessage; error?: string }) => void) => void;
  typingStart: (data: { orderNumber: string }) => void;
  typingStop: (data: { orderNumber: string }) => void;
  messageEdited: (data: { orderNumber: string; messageId: string; content: string }, callback?: (res: { success: boolean; error?: string }) => void) => void;
  messageDeleted: (data: { orderNumber: string; messageId: string }, callback?: (res: { success: boolean; error?: string }) => void) => void;
  messageRead: (data: { orderNumber: string; messageIds?: string[] }) => void;
  fileUploaded: (data: { orderNumber: string; file: AttachmentItem; messageContent?: string }) => void;
}

// Server -> Client Events
export interface ServerToClientEvents {
  roomJoined: (data: { orderNumber: string; room: string; onlineUsers: UserPresence[] }) => void;
  roomLeft: (data: { orderNumber: string; room: string }) => void;
  newMessage: (data: { message: ChatMessage; orderNumber: string }) => void;
  typingStart: (data: { orderNumber: string; userId: string; userDisplayName: string }) => void;
  typingStop: (data: { orderNumber: string; userId: string }) => void;
  messageEdited: (data: { orderNumber: string; messageId: string; content: string; editedAt: string }) => void;
  messageDeleted: (data: { orderNumber: string; messageId: string }) => void;
  messageRead: (data: { orderNumber: string; userId: string; messageIds: string[]; readAt: string }) => void;
  userOnline: (data: { orderNumber: string; userId: string; userDisplayName: string }) => void;
  userOffline: (data: { orderNumber: string; userId: string }) => void;
  fileUploaded: (data: { orderNumber: string; file: AttachmentItem; message?: ChatMessage }) => void;
  notificationCreated: (data: { notification: NotificationPayload }) => void;
  milestoneSubmitted: (data: { orderNumber: string; milestoneId: string; title: string; submittedAt: string }) => void;
  milestoneApproved: (data: { orderNumber: string; milestoneId: string; title: string; approvedAt: string }) => void;
  revisionRequested: (data: { orderNumber: string; milestoneId: string; title: string; notes: string }) => void;
  escrowReleased: (data: { orderNumber: string; amount: string; currency: string }) => void;
  projectCompleted: (data: { orderNumber: string; completedAt: string }) => void;
  error: (data: { message: string; code?: string }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  user: SocketUser;
  joinedRooms: Set<string>;
}
