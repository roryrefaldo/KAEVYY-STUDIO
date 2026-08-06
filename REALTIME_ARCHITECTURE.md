# KAEVY STUDIO - Real-Time Collaboration System Architecture

## Overview
The **KAEVY STUDIO Real-Time Collaboration System** transforms static order communication into a secure, room-isolated workspace for Roblox developers and clients. Every project order dynamically creates its own Socket.IO room with strict JWT-based Role-Based Access Control (RBAC).

---

## Key Features
1. **Isolated Order Rooms**: `order:<orderNumber>` (e.g., `order:KVS-20260803-001`).
2. **Access Control**: Strict RBAC enforcing room entry exclusively for:
   - Client (Order Owner)
   - Assigned Developer
   - KAEVY Admin
3. **Real-Time Communication**:
   - Messages (text, Luau code snippets, markdown formatting)
   - Message editing and soft deletion
   - Reply thread linking
   - Delivery & read receipts (`readAt`)
   - Typing indicators (`typingStart`, `typingStop`) with auto-stop debouncing
   - Online presence tracking (`roomJoined`, `userOnline`, `userOffline`)
4. **File Deliverable Attachments**:
   - Support for `.rbxl` / `.rbxlx` (Roblox Place files), `.zip`, `.lua` / `.luau`, images, and GDD documents.
5. **System Notifications & Event Broadcasting**:
   - Real-time updates on milestone submission, approval, revision requests, escrow deposit release, and warranty state changes.

---

## Tech Stack & Components

### Backend
- **Node.js + Express**: HTTP API server
- **Socket.IO**: WebSocket & Long-Polling real-time gateway
- **Drizzle ORM + PostgreSQL**: Database persistence for messages, reads, attachments, and typing sessions
- **JWT Auth Integration**: Authenticates all WebSocket handshakes

### Frontend
- **React + TypeScript**: Client application
- **Socket.IO Client**: Socket connection manager with auto-reconnect
- **Hooks**:
  - `useSocket`: Manages socket instance lifecycle and connection state.
  - `useChat`: Handles message sending, editing, deletion, reply, and read receipt sync.
  - `useTyping`: Tracks real-time typing indicators with 2.5s debouncing.
  - `usePresence`: Tracks active users inside the order workspace.
- **Components**:
  - `ChatWindow`: Main workspace collaboration UI.
  - `MessageBubble`: Individual message renderer with code highlighting and attachment cards.
  - `TypingIndicator`: Animated typing feedback.
  - `AttachmentPreview`: Previews and downloads `.rbxl`, `.zip`, `.lua` deliverables.
  - `ConversationSidebar`: Order workspace switcher.

---

## Room Security & Authorization Matrix

| User Role | Client Owner | Assigned Developer | Admin | Unassigned Developer | Other Client |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Join `order:<orderNumber>`** | ✅ Granted | ✅ Granted | ✅ Granted | ❌ Denied | ❌ Denied |
| **Send Messages & Files** | ✅ Granted | ✅ Granted | ✅ Granted | ❌ Denied | ❌ Denied |
| **Edit/Delete Message** | ✅ Own Only | ✅ Own Only | ✅ Granted | ❌ Denied | ❌ Denied |

---

## Database ERD Extension

- `messages`: Extended with `replyToId`, `isEdited`, `editedAt`, `deletedAt`, `readAt`.
- `message_reads`: Tracks individual message read receipts by user ID and timestamp.
- `message_attachments`: Stores file metadata (fileName, fileType, size, downloadUrl).
- `typing_sessions`: Stores transient typing activity records.

---

## Escrow & Milestone Integration
When milestone actions occur (e.g. `approveMilestone`), the system uses `notificationGateway` to broadcast:
- `milestoneApproved` -> Releases escrow percentage to developer wallet in real time.
- `revisionRequested` -> Notifies developer of requested changes immediately.
- `projectCompleted` -> Triggers warranty period clock (30 days).
