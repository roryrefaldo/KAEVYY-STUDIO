import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  Smile,
  X,
  ShieldCheck,
  Box,
  FileCode,
  FileArchive,
  Image as ImageIcon,
  Wifi,
  WifiOff,
  CornerDownRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../hooks/useChat';
import { useTyping } from '../../hooks/useTyping';
import { usePresence } from '../../hooks/usePresence';
import { useSocket } from '../../hooks/useSocket';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { OnlineStatus } from './OnlineStatus';
import { ChatMessage, AttachmentItem } from '../../server/socket/socketEvents';

interface ChatWindowProps {
  orderNumber: string;
  orderTitle?: string;
  clientName?: string;
  developerName?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  orderNumber,
  orderTitle,
  clientName,
  developerName,
}) => {
  const { user } = useAuth();
  const { isConnected, connectionError } = useSocket();
  const { messages, isLoadingHistory, sendMessage, editMessage, deleteMessage, markAsRead } =
    useChat(orderNumber);
  const { typingUsers, startTyping, stopTyping } = useTyping(orderNumber);
  const { onlineUsers } = usePresence(orderNumber);

  const [inputContent, setInputContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<AttachmentItem[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    markAsRead();
  }, [messages, markAsRead]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputContent(e.target.value);
    if (e.target.value.trim()) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  const handleSend = async () => {
    if ((!inputContent.trim() && stagedFiles.length === 0) || !user) return;

    const contentToSend = inputContent.trim();
    const filesToSend = [...stagedFiles];
    const replyId = replyingTo?.id;

    setInputContent('');
    setStagedFiles([]);
    setReplyingTo(null);
    stopTyping();

    await sendMessage(contentToSend, filesToSend, replyId);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    Array.from(files).forEach((file: File) => {
      let fileType: 'IMAGE' | 'RBXL' | 'ZIP' | 'LUA' | 'DOC' | 'OTHER' = 'OTHER';
      const nameLower = file.name.toLowerCase();

      if (nameLower.endsWith('.rbxl') || nameLower.endsWith('.rbxlx')) fileType = 'RBXL';
      else if (nameLower.endsWith('.zip') || nameLower.endsWith('.rar')) fileType = 'ZIP';
      else if (nameLower.endsWith('.lua') || nameLower.endsWith('.luau')) fileType = 'LUA';
      else if (file.type.startsWith('image/')) fileType = 'IMAGE';
      else if (file.type.includes('pdf') || nameLower.endsWith('.md')) fileType = 'DOC';

      const mockAttachment: AttachmentItem = {
        id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        fileName: file.name,
        fileSizeBytes: file.size,
        mimeType: file.type || 'application/octet-stream',
        fileType,
        downloadUrl: URL.createObjectURL(file),
      };

      setStagedFiles((prev) => [...prev, mockAttachment]);
    });

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeStagedFile = (id: string) => {
    setStagedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const addEmoji = (emoji: string) => {
    setInputContent((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const quickEmojis = ['👍', '🚀', '✅', '🔥', '🎉', 'Luau', 'Roblox', '💬'];

  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative">
      {/* Workspace Header */}
      <div className="px-4 py-3 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-xl bg-indigo-600/10 border border-indigo-500/20 shrink-0">
            <Box className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-zinc-100">{orderNumber}</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Escrow Room
              </span>
            </div>
            <p className="text-xs text-zinc-400 truncate">{orderTitle || 'Kolaborasi Proyek KAEVY'}</p>
          </div>
        </div>

        {/* Presence Header Badge & Socket Status */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
            <OnlineStatus isOnline={isConnected} showText={false} />
            <span className="text-zinc-300 font-medium">
              {onlineUsers.length} Pengguna Aktif
            </span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
              isConnected
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}
          >
            {isConnected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5 animate-pulse" />}
            <span className="hidden xs:inline">{isConnected ? 'Terhubung' : 'Terputus'}</span>
          </div>
        </div>
      </div>

      {/* Connection Banner */}
      {connectionError && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-300 flex items-center justify-between">
          <span>{connectionError}</span>
          <span className="font-mono text-[10px] underline cursor-pointer">Mencoba terhubung ulang...</span>
        </div>
      )}

      {/* Messages Scroll Workspace */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {isLoadingHistory ? (
          <div className="flex items-center justify-center h-full text-zinc-500 text-xs gap-2">
            <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
            <span>Memuat riwayat obrolan...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500 p-6 gap-3">
            <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
              <ShieldCheck className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h4 className="font-semibold text-zinc-200 text-sm">Ruang Kerja Kolaborasi Terenkripsi</h4>
              <p className="text-xs text-zinc-400 max-w-sm mt-1">
                Semua percakapan, berkas (.rbxl, .zip, .lua), dan persetujuan milestone dalam ruang ini dilindungi oleh garansi & garansi escrow KAEVY STUDIO.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              currentUserId={user?.id || ''}
              onReply={(m) => setReplyingTo(m)}
              onEdit={(id, content) => editMessage(id, content)}
              onDelete={(id) => deleteMessage(id)}
            />
          ))
        )}

        {/* Typing Indicator */}
        <TypingIndicator typingUsers={typingUsers} />

        <div ref={messagesEndRef} />
      </div>

      {/* Reply Banner */}
      {replyingTo && (
        <div className="px-4 py-2 bg-zinc-900/90 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-300">
          <div className="flex items-center gap-2 truncate">
            <CornerDownRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>
              Membalas <strong className="text-indigo-300">{replyingTo.senderName}</strong>: &quot;{replyingTo.content}&quot;
            </span>
          </div>
          <button onClick={() => setReplyingTo(null)} className="p-1 rounded hover:bg-zinc-800 text-zinc-400">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* File Attachment Queue */}
      {stagedFiles.length > 0 && (
        <div className="px-4 py-2 bg-zinc-900/60 border-t border-zinc-800 flex items-center gap-2 overflow-x-auto">
          {stagedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-800 text-xs text-zinc-200 border border-zinc-700 shrink-0"
            >
              <span className="truncate max-w-[120px]">{file.fileName}</span>
              <button onClick={() => removeStagedFile(file.id)} className="text-zinc-400 hover:text-red-400">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Emoji Quick Bar */}
      {showEmojiPicker && (
        <div className="px-4 py-2 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2">
          {quickEmojis.map((e) => (
            <button
              key={e}
              onClick={() => addEmoji(e)}
              className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200"
            >
              {e}
            </button>
          ))}
        </div>
      )}

      {/* Chat Input Bar */}
      <div className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2 shrink-0">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          multiple
          accept=".rbxl,.rbxlx,.zip,.rar,.lua,.luau,image/*,.pdf,.md"
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors shrink-0 disabled:opacity-50"
          title="Unggah Berkas Proyek (.rbxl, .zip, .lua, Gambar)"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors shrink-0"
          title="Emoji"
        >
          <Smile className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputContent}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Tulis pesan atau tempel skrip Luau / Markdown..."
          className="flex-1 bg-zinc-950 text-zinc-100 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-indigo-500"
        />

        <button
          onClick={handleSend}
          disabled={!inputContent.trim() && stagedFiles.length === 0}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all disabled:opacity-40 disabled:hover:bg-indigo-600 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
