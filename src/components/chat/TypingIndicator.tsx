import React from 'react';
import { TypingUser } from '../../hooks/useTyping';

interface TypingIndicatorProps {
  typingUsers: TypingUser[];
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUsers }) => {
  if (!typingUsers || typingUsers.length === 0) return null;

  const names = typingUsers.map((u) => u.userDisplayName).join(', ');

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-400 bg-zinc-900/60 rounded-lg border border-zinc-800/60 w-fit animate-fade-in">
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
      </div>
      <span>
        <strong className="text-zinc-200 font-semibold">{names}</strong> {typingUsers.length > 1 ? 'sedang mengetik...' : 'sedang mengetik...'}
      </span>
    </div>
  );
};
