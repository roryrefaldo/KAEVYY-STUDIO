import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  LayoutDashboard,
  TrendingUp,
  UserCheck,
  Users,
  ShoppingBag,
  ShieldAlert,
  Gavel,
  FileCheck2,
  Terminal,
  Bell,
  SlidersHorizontal,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { AdminTab } from '../../types/adminControl';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: AdminTab) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const items: { id: AdminTab; label: string; description: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Section 1: Dashboard Overview', description: 'Real-time metrics, GMV, Escrow locked, total orders & active developers', icon: LayoutDashboard },
    { id: 'revenue', label: 'Section 2: Revenue Analytics', description: 'Daily/Weekly/Monthly revenue, top developers & categories charts', icon: TrendingUp },
    { id: 'developers', label: 'Section 3: Developer Management', description: 'Approve, reject, promote, suspend developers & manage capacity', icon: UserCheck },
    { id: 'clients', label: 'Section 4: Client Management', description: 'Searchable clients table, warnings, ban/suspend & order history', icon: Users },
    { id: 'orders', label: 'Section 5: Orders Monitor', description: 'Live order status, assign, force complete, cancel & refund controls', icon: ShoppingBag },
    { id: 'escrow', label: 'Section 6: Escrow Control', description: 'Vault held funds, release/refund queue & manual release override', icon: ShieldAlert },
    { id: 'disputes', label: 'Section 7: Dispute Resolution', description: 'Arbitrate open disputes, evidence timeline & 50/50 split calculator', icon: Gavel },
    { id: 'assets', label: 'Section 8: Asset Moderation', description: 'Lua AST security scan, virus scan, approve/reject share assets', icon: FileCheck2 },
    { id: 'audit', label: 'Section 9: Audit Center', description: 'Immutable audit log stream, advanced search & CSV/JSON export', icon: Terminal },
    { id: 'notifications', label: 'Section 10: Notification Center', description: 'Broadcast notifications to clients, developers, or system-wide', icon: Bell },
    { id: 'settings', label: 'Section 11: Platform Settings', description: 'Platform fee %, USD/IDR exchange rate, payment provider toggles', icon: SlidersHorizontal },
    { id: 'health', label: 'Section 12: System Health', description: 'API latency, DB connection status, memory/CPU usage & socket count', icon: Activity },
  ];

  const filteredItems = items.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or state
        }
      }

      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          onSelectTab(filteredItems[selectedIndex].id);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredItems, onClose, onSelectTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800">
          <Search className="w-5 h-5 text-purple-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search section (e.g. 'Escrow', 'Dispute', 'Revenue')..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-medium"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 custom-scrollbar space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-mono">
              No matching section found for "{query}".
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all text-left ${
                    isSelected
                      ? 'bg-purple-600/20 text-white border border-purple-500/40'
                      : 'text-slate-300 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isSelected ? 'bg-purple-600 text-white' : 'bg-slate-800 text-purple-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{item.label}</div>
                      <div className="text-[11px] text-slate-400 truncate">{item.description}</div>
                    </div>
                  </div>
                  {isSelected && <ArrowRight className="w-4 h-4 text-purple-400 shrink-0 ml-2" />}
                </button>
              );
            })
          )}
        </div>

        {/* Keyboard Hints Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">↑↓</kbd>{' '}
              Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">↵</kbd>{' '}
              Select
            </span>
          </div>
          <span>
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">ESC</kbd>{' '}
            Close
          </span>
        </div>
      </div>
    </div>
  );
};
