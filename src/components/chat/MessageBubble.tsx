import React, { useState } from 'react';
import { Reply, Edit3, Trash2, Check, CheckCheck, FileCode, CornerDownRight } from 'lucide-react';
import { ChatMessage } from '../../server/socket/socketEvents';
import { AttachmentPreview } from './AttachmentPreview';

interface MessageBubbleProps {
  message: ChatMessage;
  currentUserId: string;
  onReply?: (message: ChatMessage) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  onDelete?: (messageId: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  currentUserId,
  onReply,
  onEdit,
  onDelete,
}) => {
  const isOwn = message.senderId === currentUserId;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editContent, setEditContent] = useState<string>(message.content);

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && onEdit) {
      onEdit(message.id, editContent.trim());
      setIsEditing(false);
    }
  };

  // Basic Markdown-like formatting helper (bold, italic, code blocks, links)
  const renderFormattedText = (text: string) => {
    if (!text) return null;

    // Code blocks ```luau ... ```
    if (text.includes('```')) {
      const parts = text.split(/(```[\s\S]*?```)/g);
      return parts.map((part, idx) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const rawCode = part.slice(3, -3);
          const firstLineEnd = rawCode.indexOf('\n');
          const lang = firstLineEnd > -1 ? rawCode.slice(0, firstLineEnd).trim() : 'lua';
          const code = firstLineEnd > -1 ? rawCode.slice(firstLineEnd + 1) : rawCode;

          return (
            <div key={idx} className="my-2 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs overflow-hidden">
              <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-[10px] text-zinc-400">
                <span className="flex items-center gap-1 font-semibold text-indigo-400 uppercase">
                  <FileCode className="w-3 h-3" /> {lang || 'LUAU / CODE'}
                </span>
                <span>Copyable Script</span>
              </div>
              <pre className="p-3 text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        return <span key={idx} className="whitespace-pre-wrap">{part}</span>;
      });
    }

    return <span className="whitespace-pre-wrap leading-relaxed">{text}</span>;
  };

  return (
    <div className={`group flex flex-col my-1.5 ${isOwn ? 'items-end' : 'items-start'}`}>
      {/* Sender Header */}
      {!isOwn && (
        <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] font-medium text-zinc-400">
          <span className="text-zinc-200 font-semibold">{message.senderName}</span>
        </div>
      )}

      <div className="relative max-w-[85%] sm:max-w-[75%]">
        {/* Reply Quote Banner */}
        {message.replyTo && (
          <div className={`flex items-start gap-1.5 p-2 mb-1 rounded-lg text-xs bg-zinc-900/80 border-l-2 border-indigo-500 text-zinc-300`}>
            <CornerDownRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="font-semibold text-indigo-300 block text-[10px]">
                {message.replyTo.senderName}
              </span>
              <p className="truncate text-zinc-400">{message.replyTo.content}</p>
            </div>
          </div>
        )}

        {/* Message Card Bubble */}
        <div
          className={`p-3.5 rounded-2xl text-xs sm:text-sm shadow-md transition-all ${
            isOwn
              ? 'bg-indigo-600 text-white rounded-br-none border border-indigo-500/50'
              : 'bg-zinc-900 text-zinc-100 rounded-bl-none border border-zinc-800'
          }`}
        >
          {isEditing ? (
            <div className="flex flex-col gap-2 min-w-[220px]">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full bg-zinc-950 text-zinc-100 p-2 rounded-lg border border-zinc-700 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-2.5 py-1 text-xs rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-2.5 py-1 text-xs rounded-md bg-indigo-500 hover:bg-indigo-400 text-white font-medium"
                >
                  Simpan
                </button>
              </div>
            </div>
          ) : (
            <div>
              {renderFormattedText(message.content)}
              {message.attachments && message.attachments.length > 0 && (
                <AttachmentPreview attachments={message.attachments} />
              )}
            </div>
          )}

          {/* Footer Metadata */}
          <div
            className={`flex items-center justify-end gap-1.5 mt-1.5 text-[10px] ${
              isOwn ? 'text-indigo-200' : 'text-zinc-400'
            }`}
          >
            {message.isEdited && <span className="italic">(diedit)</span>}
            <span>{formatTime(message.createdAt)}</span>
            {isOwn && (
              <span>
                {message.readAt ? (
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-300 inline" />
                ) : (
                  <Check className="w-3.5 h-3.5 text-indigo-300 inline" />
                )}
              </span>
            )}
          </div>
        </div>

        {/* Hover Action Menu */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1 shadow-lg z-10 ${
            isOwn ? '-left-20' : '-right-20'
          }`}
        >
          {onReply && (
            <button
              onClick={() => onReply(message)}
              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-indigo-400 transition-colors"
              title="Balas Pesan"
            >
              <Reply className="w-3.5 h-3.5" />
            </button>
          )}
          {isOwn && onEdit && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 transition-colors"
              title="Edit Pesan"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
          {isOwn && onDelete && (
            <button
              onClick={() => onDelete(message.id)}
              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-red-400 transition-colors"
              title="Hapus Pesan"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
