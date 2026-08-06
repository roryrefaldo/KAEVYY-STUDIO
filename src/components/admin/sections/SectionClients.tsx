import React, { useState } from 'react';
import {
  Users,
  Search,
  ShieldAlert,
  AlertTriangle,
  Ban,
  RotateCcw,
  ShoppingBag,
  DollarSign,
  Gavel,
  Star,
} from 'lucide-react';
import { AdminClientItem } from '../../../types/adminControl';
import { SensitiveActionPayload } from '../AdminJustificationModal';

interface SectionClientsProps {
  clients: AdminClientItem[];
  onTriggerAction: (payload: SensitiveActionPayload) => void;
  formatPrice: (amount: number) => string;
}

export const SectionClients: React.FC<SectionClientsProps> = ({
  clients,
  onTriggerAction,
  formatPrice,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.displayName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.companyName && c.companyName.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleIssueWarning = (client: AdminClientItem) => {
    onTriggerAction({
      title: `Issue Formal Platform Warning to ${client.displayName}`,
      impactSummary: `Sends official notification warning regarding TOS policies. Warning count will increase.`,
      actionType: 'CLIENT_WARN',
      targetId: client.id,
      targetName: client.displayName,
      onConfirm: (reason) => {
        client.warningsCount += 1;
      },
    });
  };

  const handleSuspendClient = (client: AdminClientItem) => {
    onTriggerAction({
      title: `Suspend Client Account: ${client.displayName}`,
      impactSummary: `Temporarily suspends client ability to place new orders or initiate payments.`,
      actionType: 'CLIENT_SUSPEND',
      targetId: client.id,
      targetName: client.displayName,
      onConfirm: (reason) => {
        client.status = 'SUSPENDED';
      },
    });
  };

  const handleBanClient = (client: AdminClientItem) => {
    onTriggerAction({
      title: `PERMANENTLY BAN Client: ${client.displayName}`,
      impactSummary: `Revokes all platform permissions, invalidates active sessions, and logs IP block list.`,
      actionType: 'CLIENT_BAN',
      targetId: client.id,
      targetName: client.displayName,
      onConfirm: (reason) => {
        client.status = 'BANNED';
      },
    });
  };

  const handleRestoreClient = (client: AdminClientItem) => {
    onTriggerAction({
      title: `Restore Client Account: ${client.displayName}`,
      impactSummary: `Re-activates client account and grants full access to platform order features.`,
      actionType: 'CLIENT_RESTORE',
      targetId: client.id,
      targetName: client.displayName,
      onConfirm: (reason) => {
        client.status = 'ACTIVE';
      },
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            SECTION 4 — Client Management & Policy Enforcement
          </h2>
          <p className="text-xs text-slate-400">
            Monitor client buyer activity, cumulative spending, order dispute history, formal policy warnings, account suspensions, and bans.
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search client by name, email, or company..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-purple-500 font-medium"
        >
          <option value="ALL">All Account Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="BANNED">Banned</option>
        </select>
      </div>

      {/* Clients Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Client Profile</th>
                <th className="p-3.5">Orders Count</th>
                <th className="p-3.5">Total Payments</th>
                <th className="p-3.5">Disputes & Warnings</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-mono text-xs">
                    No clients match the specified search parameters.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-850/50 transition-colors">
                    {/* Profile */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={client.avatar}
                          alt={client.displayName}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-700"
                        />
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{client.displayName}</span>
                            {client.companyName && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                                {client.companyName}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono">{client.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Orders Count */}
                    <td className="p-3.5 font-mono text-white font-bold">
                      <div className="flex items-center gap-1.5">
                        <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{client.ordersCount} Orders</span>
                      </div>
                    </td>

                    {/* Total Payments */}
                    <td className="p-3.5 font-mono text-emerald-400 font-bold">
                      {formatPrice(client.paymentsTotal)}
                    </td>

                    {/* Disputes & Warnings */}
                    <td className="p-3.5 font-mono">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            client.disputesCount > 0 ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {client.disputesCount} Disputes
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            client.warningsCount > 0 ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {client.warningsCount} Warns
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-3.5 font-mono">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          client.status === 'ACTIVE'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : client.status === 'SUSPENDED'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {client.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleIssueWarning(client)}
                          className="px-2.5 py-1 bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-300 rounded-lg text-[10px] font-bold transition-all"
                          title="Issue Policy Warning"
                        >
                          Warn
                        </button>

                        {client.status === 'ACTIVE' ? (
                          <>
                            <button
                              onClick={() => handleSuspendClient(client)}
                              className="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-lg text-[10px] font-bold transition-all"
                            >
                              Suspend
                            </button>
                            <button
                              onClick={() => handleBanClient(client)}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-bold transition-all"
                            >
                              Ban
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleRestoreClient(client)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold transition-all flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Restore</span>
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
