import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface MarketplacePaginationProps {
  page: number;
  totalPages: number;
  totalItems?: number;
  onPageChange: (newPage: number) => void;
  className?: string;
}

export const MarketplacePagination: React.FC<MarketplacePaginationProps> = ({
  page,
  totalPages,
  totalItems,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-between pt-6 border-t border-slate-800 ${className}`}>
      <div className="text-xs text-slate-400 font-mono">
        {totalItems !== undefined ? (
          <span>Total items: <strong className="text-white">{totalItems}</strong></span>
        ) : (
          <span>Page <strong className="text-white">{page}</strong> of <strong className="text-white">{totalPages}</strong></span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-lg border border-cyan-800">
          {page} / {totalPages}
        </span>

        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
