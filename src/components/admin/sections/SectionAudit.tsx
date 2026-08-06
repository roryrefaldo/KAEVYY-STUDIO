import React, { useState } from 'react';
import {
  Terminal,
  Search,
  Download,
  FileJson,
  FileSpreadsheet,
  Filter,
  Calendar,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { AdminAuditLog } from '../../../types/adminControl';

interface SectionAuditProps {
  logs: AdminAuditLog[];
}

export const SectionAudit: React.FC<SectionAuditProps> = ({ logs }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || l.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const exportCSV = () => {
    const headers = ['ID', 'Timestamp', 'Actor', 'Action', 'Category', 'Details', 'IP Address'];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.timestamp,
      `"${l.actor}"`,
      l.action,
      l.category,
      `"${l.details.replace(/"/g, '""')}"`,
      l.ipAddress || '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kaevy_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `kaevy_audit_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-purple-400" />
            SECTION 9 — Immutable Platform Audit Center
          </h2>
          <p className="text-xs text-slate-400">
            Immutable system audit logs recording admin overrides, security escalations, escrow manual disbursements, and setting mutations.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={exportJSON}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-all"
          >
            <FileJson className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export JSON</span>
          </button>
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
            placeholder="Search audit trail by actor, action, or details..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-purple-500 font-medium"
        >
          <option value="ALL">All Categories</option>
          <option value="SECURITY">Security</option>
          <option value="ESCROW">Escrow</option>
          <option value="DISPUTE">Dispute</option>
          <option value="MODERATION">Moderation</option>
          <option value="USER_MGMT">User Management</option>
          <option value="SETTINGS">Settings</option>
          <option value="SYSTEM">System</option>
        </select>
      </div>

      {/* Terminal Audit Log Timeline Stream */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-3">
        <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase tracking-wider pb-3 border-b border-slate-800">
          <span className="flex items-center gap-1.5 text-purple-400 font-bold">
            <Terminal className="w-4 h-4" /> Real-time Immutable Event Stream
          </span>
          <span>Showing {filteredLogs.length} events</span>
        </div>

        <div className="space-y-2.5 max-h-[480px] overflow-y-auto custom-scrollbar pr-2">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-mono">
              No audit logs match the selected filter query.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col md:flex-row md:items-start justify-between gap-2 hover:border-purple-500/40 transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-slate-500">[{log.timestamp}]</span>
                    <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                      {log.category}
                    </span>
                    <span className="text-white font-bold">{log.actor}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-sans text-xs">{log.details}</p>
                </div>

                <div className="text-[10px] text-slate-500 font-mono shrink-0">
                  IP: {log.ipAddress || '103.28.14.92'}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
