import React, { useState } from 'react';
import { Search, MessageSquare, Shield, CheckCircle2, Clock } from 'lucide-react';
import { UnreadBadge } from './UnreadBadge';

export interface OrderConversationItem {
  orderNumber: string;
  title: string;
  status: string;
  clientName?: string;
  developerName?: string;
  lastMessageSnippet?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  isOnline?: boolean;
}

interface ConversationSidebarProps {
  orders: OrderConversationItem[];
  selectedOrderNumber: string | null;
  onSelectOrder: (orderNumber: string) => void;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  orders,
  selectedOrderNumber,
  onSelectOrder,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            Aktif
          </span>
        );
      case 'PENDING_REVIEW':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400">
            Review
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            Selesai
          </span>
        );
      default:
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-zinc-800 text-zinc-400">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full md:w-80 border-r border-zinc-800 bg-zinc-950 flex flex-col h-full shrink-0">
      {/* Sidebar Header */}
      <div className="p-3.5 border-b border-zinc-800 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-sm text-zinc-100">Ruang Kolaborasi</h3>
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
            {orders.length}
          </span>
        </div>

        {/* Search Field */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nomor pesanan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 text-zinc-200 text-xs pl-8 pr-3 py-1.5 rounded-lg border border-zinc-800 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto divide-y divide-zinc-900">
        {filteredOrders.length === 0 ? (
          <div className="p-6 text-center text-zinc-500 text-xs flex flex-col items-center gap-2">
            <Clock className="w-6 h-6 text-zinc-600" />
            <span>Tidak ada obrolan pesanan aktif</span>
          </div>
        ) : (
          filteredOrders.map((item) => {
            const isSelected = item.orderNumber === selectedOrderNumber;

            return (
              <button
                key={item.orderNumber}
                onClick={() => onSelectOrder(item.orderNumber)}
                className={`w-full text-left p-3.5 flex flex-col gap-1.5 transition-colors relative ${
                  isSelected
                    ? 'bg-indigo-950/40 border-l-2 border-indigo-500'
                    : 'hover:bg-zinc-900/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-xs font-bold text-zinc-200 truncate">
                      {item.orderNumber}
                    </span>
                    {item.isOnline && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    )}
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                <p className="text-xs text-zinc-300 font-medium truncate">{item.title}</p>

                <div className="flex items-center justify-between text-[11px] text-zinc-500">
                  <span className="truncate max-w-[170px]">
                    {item.lastMessageSnippet || 'Mulai diskusi proyek...'}
                  </span>
                  <UnreadBadge count={item.unreadCount || 0} />
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
