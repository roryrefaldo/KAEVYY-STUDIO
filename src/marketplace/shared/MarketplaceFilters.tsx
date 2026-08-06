import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

export interface MarketplaceFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory?: string;
  categories?: string[];
  onCategoryChange?: (category: string) => void;
  sortBy?: string;
  sortOptions?: { value: string; label: string }[];
  onSortChange?: (sort: string) => void;
  onReset?: () => void;
  placeholder?: string;
  className?: string;
}

export const MarketplaceFilters: React.FC<MarketplaceFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory = '',
  categories = [],
  onCategoryChange,
  sortBy,
  sortOptions,
  onSortChange,
  onReset,
  placeholder = 'Search...',
  className = '',
}) => {
  return (
    <div className={`flex flex-col md:flex-row items-center justify-between gap-4 w-full ${className}`}>
      {/* Search Input */}
      <div className="relative w-full md:w-96">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        {/* Category Filter */}
        {categories.length > 0 && onCategoryChange && (
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar max-w-full pb-1 md:pb-0">
            <button
              onClick={() => onCategoryChange('')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                !selectedCategory
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Sort Select */}
        {sortOptions && sortOptions.length > 0 && onSortChange && (
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-medium"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Reset Button */}
        {onReset && (
          <button
            onClick={onReset}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
