import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  XCircle,
  RotateCcw,
  UserPlus,
  Lock,
  Clock,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { AdminOrderItem } from '../../../types/adminControl';
import { SensitiveActionPayload } from '../AdminJustificationModal';

interface SectionOrdersProps {
  orders: AdminOrderItem[];
  onTriggerAction: (payload: SensitiveActionPayload) => void;
  formatPrice: (amount: number) => string;
}

export const SectionOrders: React.FC<SectionOrdersProps> = ({
  orders,
  onTriggerAction,
  formatPrice,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.serviceTitle.toLowerCase().includes(search.toLowerCase()) ||
      o.clientName.toLowerCase().includes(search.toLowerCase()) ||
      (o.developerName && o.developerName.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleForceComplete = (order: AdminOrderItem) => {
    onTriggerAction({
      title: `Force Complete Order ${order.orderNumber}`,
      impactSummary: `Forcefully marks order as completed and triggers automatic release of $${order.escrowAmount} escrow vault funds to developer.`,
      actionType: 'FORCE_COMPLETE_ORDER',
      targetId: order.id,
      targetName: order.orderNumber,
      onConfirm: (reason) => {
        order.status = 'COMPLETED';
        order.escrowStatus = 'RELEASED';
        order.milestoneProgress = 100;
      },
    });
  };

  const handleCancelOrder = (order: AdminOrderItem) => {
    onTriggerAction({
      title: `Cancel Order ${order.orderNumber}`,
      impactSummary: `Cancels active order ticket and initiates escrow refund review.`,
      actionType: 'CANCEL_ORDER',
      targetId: order.id,
      targetName: order.orderNumber,
      onConfirm: (reason) => {
        order.status = 'CANCELLED';
      },
    });
  };

  const handleRefundOrder = (order: AdminOrderItem) => {
    onTriggerAction({
      title: `Full Escrow Refund for Order ${order.orderNumber}`,
      impactSummary: `Refunds 100% of escrow vault balance ($${order.escrowAmount}) directly back to client account balance.`,
      actionType: 'REFUND_ORDER',
      targetId: order.id,
      targetName: order.orderNumber,
      onConfirm: (reason) => {
        order.status = 'CANCELLED';
        order.paymentStatus = 'REFUNDED';
        order.escrowStatus = 'REFUNDED';
      },
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-cyan-400" />
            SECTION 5 — Live Orders Monitor & Workflow Override
          </h2>
          <p className="text-xs text-slate-400">
            Real-time status tracking for all platform order tickets, developer milestone progress, warranty countdowns, force completions, and refunds.
          </p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order number (KVS-...), service title, client, or dev..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-purple-500 font-medium"
        >
          <option value="ALL">All Order Statuses</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="IN_REVIEW">In Review</option>
          <option value="COMPLETED">Completed</option>
          <option value="DISPUTED">Disputed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Order Number</th>
                <th className="p-3.5">Service & Parties</th>
                <th className="p-3.5">Order Status</th>
                <th className="p-3.5">Payment / Escrow</th>
                <th className="p-3.5">Milestone</th>
                <th className="p-3.5">Warranty</th>
                <th className="p-3.5 text-right font-sans">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 text-xs">
                    No orders match the specified filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-850/50 transition-colors">
                    {/* Order Number */}
                    <td className="p-3.5">
                      <div className="font-bold text-cyan-400">{ord.orderNumber}</div>
                      <div className="text-[10px] text-slate-500">{ord.createdAt}</div>
                    </td>

                    {/* Parties */}
                    <td className="p-3.5 font-sans">
                      <div className="font-bold text-white max-w-[200px] truncate">{ord.serviceTitle}</div>
                      <div className="text-[11px] text-slate-400">
                        Client: <span className="text-slate-200">{ord.clientName}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Dev: <span className="text-purple-300">{ord.developerName || 'Unassigned'}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-3.5 font-sans">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          ord.status === 'COMPLETED'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : ord.status === 'IN_PROGRESS'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : ord.status === 'DISPUTED'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>

                    {/* Payment / Escrow */}
                    <td className="p-3.5">
                      <div className="font-bold text-emerald-400">{formatPrice(ord.escrowAmount)}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-mono">
                        Escrow: <span className="text-amber-400 font-bold">{ord.escrowStatus}</span>
                      </div>
                    </td>

                    {/* Milestone Progress */}
                    <td className="p-3.5">
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-200">{ord.milestoneProgress}% Complete</div>
                        <div className="w-20 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${ord.milestoneProgress}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Warranty */}
                    <td className="p-3.5">
                      {ord.status === 'COMPLETED' ? (
                        <div className="flex items-center gap-1 text-emerald-400 text-xs">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{ord.warrantyDaysLeft} Days</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[10px]">N/A</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right font-sans">
                      <div className="flex items-center justify-end gap-1.5">
                        {ord.status !== 'COMPLETED' && ord.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleForceComplete(ord)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold transition-all"
                          >
                            Force Complete
                          </button>
                        )}

                        {ord.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleRefundOrder(ord)}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-bold transition-all"
                          >
                            Refund
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
