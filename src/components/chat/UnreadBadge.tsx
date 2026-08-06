import React from 'react';

interface UnreadBadgeProps {
  count: number;
  className?: string;
}

export const UnreadBadge: React.FC<UnreadBadgeProps> = ({ count, className = '' }) => {
  if (!count || count <= 0) return null;

  return (
    <span
      className={`inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-indigo-600 rounded-full shadow-sm animate-pulse ${className}`}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
};
