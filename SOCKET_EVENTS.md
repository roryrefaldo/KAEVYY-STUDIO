# KAEVY STUDIO - Socket.IO Events API Reference

This document specifies the complete real-time event protocol for KAEVY STUDIO order collaboration rooms (`order:<orderNumber>`).

---

## Connection & Authentication
Clients connect via Socket.IO with standard JWT token authentication in handshake auth or cookie headers.

```typescript
const socket = io({
  auth: {
    token: "YOUR_JWT_ACCESS_TOKEN"
  }
});
```

---

## Client -> Server Events (`ClientToServerEvents`)

### 1. `joinRoom`
Requests entry to an order collaboration room.
- **Payload**: `{ orderNumber: string }`
- **Ack Callback**: `(response: { success: boolean; error?: string }) => void`
- **Emits Back**: `roomJoined` event on success, or `error` event if unauthorized.

### 2. `leaveRoom`
Leaves an order collaboration room.
- **Payload**: `{ orderNumber: string }`
- **Emits Back**: `roomLeft` event.

### 3. `newMessage`
Sends a new message or file attachment to the order workspace.
- **Payload**:
  ```json
  {
    "orderNumber": "KVS-20260803-001",
    "content": "Sudah saya perbaiki skrip DataStore2.",
    "attachments": [
      {
        "id": "att_101",
        "fileName": "GameMechanic.rbxl",
        "fileSizeBytes": 4580000,
        "mimeType": "application/octet-stream",
        "fileType": "RBXL",
        "downloadUrl": "/uploads/GameMechanic.rbxl"
      }
    ],
    "replyToId": "msg_001"
  }
  ```
- **Ack Callback**: `(response: { success: boolean; message?: ChatMessage; error?: string }) => void`

### 4. `typingStart`
Notifies room participants that user has started typing.
- **Payload**: `{ orderNumber: string }`

### 5. `typingStop`
Notifies room participants that user has stopped typing.
- **Payload**: `{ orderNumber: string }`

### 6. `messageEdited`
Edits content of an existing message.
- **Payload**: `{ orderNumber: string, messageId: string, content: string }`
- **Ack Callback**: `(response: { success: boolean; error?: string }) => void`

### 7. `messageDeleted`
Soft-deletes a message.
- **Payload**: `{ orderNumber: string, messageId: string }`
- **Ack Callback**: `(response: { success: boolean; error?: string }) => void`

### 8. `messageRead`
Marks messages as read by current user.
- **Payload**: `{ orderNumber: string, messageIds?: string[] }`

### 9. `fileUploaded`
Notifies room that a new file deliverable has been uploaded.
- **Payload**: `{ orderNumber: string, file: AttachmentItem, messageContent?: string }`

---

## Server -> Client Events (`ServerToClientEvents`)

### 1. `roomJoined`
Emitted to client when successfully joined room.
- **Payload**: `{ orderNumber: string, room: string, onlineUsers: UserPresence[] }`

### 2. `roomLeft`
Emitted when left room.
- **Payload**: `{ orderNumber: string, room: string }`

### 3. `newMessage`
Broadcasted to all users in the room when a new message arrives.
- **Payload**: `{ message: ChatMessage, orderNumber: string }`

### 4. `typingStart`
Broadcasted to other participants when user starts typing.
- **Payload**: `{ orderNumber: string, userId: string, userDisplayName: string }`

### 5. `typingStop`
Broadcasted to other participants when user stops typing.
- **Payload**: `{ orderNumber: string, userId: string }`

### 6. `userOnline`
Emitted when a participant enters the room.
- **Payload**: `{ orderNumber: string, userId: string, userDisplayName: string }`

### 7. `userOffline`
Emitted when a participant disconnects or leaves room.
- **Payload**: `{ orderNumber: string, userId: string }`

### 8. `messageEdited`
Broadcasted when a message is updated.
- **Payload**: `{ orderNumber: string, messageId: string, content: string, editedAt: string }`

### 9. `messageDeleted`
Broadcasted when a message is deleted.
- **Payload**: `{ orderNumber: string, messageId: string }`

### 10. `messageRead`
Broadcasted when read status updates.
- **Payload**: `{ orderNumber: string, userId: string, messageIds: string[], readAt: string }`

### 11. `milestoneSubmitted` / `milestoneApproved` / `revisionRequested` / `escrowReleased`
Broadcasted real-time milestone & escrow financial lifecycle updates.

### 12. `error`
Emitted when socket authentication or room access fails.
- **Payload**: `{ message: string, code?: string }`

---

## Error Codes
- `UNAUTHORIZED_SOCKET`: Missing or invalid JWT token.
- `UNAUTHORIZED_ROOM_ACCESS`: User is not Client Owner, Assigned Developer, or Admin for the requested order.
- `INVALID_MESSAGE_PAYLOAD`: Empty content and empty attachments.
- `NOT_FOUND`: Order or message does not exist.
