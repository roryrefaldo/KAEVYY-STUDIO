import React from 'react';

interface OnlineStatusProps {
  isOnline: boolean;
  displayName?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const OnlineStatus: React.FC<OnlineStatusProps> = ({
  isOnline,
  displayName,
  showText = true,
  size = 'md',
}) => {
  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  return (
    <div className="inline-flex items-center gap-1.5 text-xs font-medium">
      <span className="relative flex">
        {isOnline && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75`} />
        )}
        <span
          className={`relative inline-flex rounded-full ${dotSizes[size]} ${
            isOnline ? 'bg-emerald-500' : 'bg-zinc-400'
          }`}
        />
      </span>
      {showText && (
        <span className={isOnline ? 'text-emerald-400 font-medium' : 'text-zinc-400 font-normal'}>
          {isOnline ? (displayName ? `${displayName} Online` : 'Online') : 'Offline'}
        </span>
      )}
    </div>
  );
};
