import React, { useState } from 'react';
import {
  FileCheck2,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  EyeOff,
  Trash2,
  Package,
  Cpu,
  Search,
} from 'lucide-react';
import { AdminAssetItem } from '../../../types/adminControl';
import { SensitiveActionPayload } from '../AdminJustificationModal';

interface SectionAssetsProps {
  assets: AdminAssetItem[];
  onTriggerAction: (payload: SensitiveActionPayload) => void;
  onOpenAssetDetail?: (id: string) => void;
}

export const SectionAssets: React.FC<SectionAssetsProps> = ({
  assets,
  onTriggerAction,
  onOpenAssetDetail,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredAssets = assets.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.creatorName.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || a.moderationStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleApprove = (asset: AdminAssetItem) => {
    onTriggerAction({
      title: `Approve Share Asset: ${asset.title}`,
      impactSummary: `Approve asset for public distribution in the Share Asset Marketplace.`,
      actionType: 'ASSET_APPROVE',
      targetId: asset.id,
      targetName: asset.title,
      onConfirm: (reason) => {
        asset.moderationStatus = 'Approved';
      },
    });
  };

  const handleReject = (asset: AdminAssetItem) => {
    onTriggerAction({
      title: `Reject Share Asset: ${asset.title}`,
      impactSummary: `Reject asset submission and return to creator with moderation feedback.`,
      actionType: 'ASSET_REJECT',
      targetId: asset.id,
      targetName: asset.title,
      onConfirm: (reason) => {
        asset.moderationStatus = 'Rejected';
      },
    });
  };

  const handleHide = (asset: AdminAssetItem) => {
    onTriggerAction({
      title: `Hide Share Asset: ${asset.title}`,
      impactSummary: `Hides asset from public search while preserving database record.`,
      actionType: 'ASSET_HIDE',
      targetId: asset.id,
      targetName: asset.title,
      onConfirm: (reason) => {
        asset.moderationStatus = 'Hidden';
      },
    });
  };

  const handleDelete = (asset: AdminAssetItem) => {
    onTriggerAction({
      title: `DELETE Share Asset: ${asset.title}`,
      impactSummary: `Permanently soft-deletes asset and associated documentation blocks.`,
      actionType: 'ASSET_DELETE',
      targetId: asset.id,
      targetName: asset.title,
      onConfirm: (reason) => {
        asset.moderationStatus = 'Rejected';
      },
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-blue-400" />
            SECTION 8 — Share Asset Moderation & Security Scanning Pipeline
          </h2>
          <p className="text-xs text-slate-400">
            Automated Lua AST static security scanner, ClamAV virus scanning results, moderation queue approvals, rejections, and asset removal.
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
            placeholder="Search asset title, creator, or category..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-purple-500 font-medium"
        >
          <option value="ALL">All Moderation Statuses</option>
          <option value="Pending">Pending Review</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Hidden">Hidden</option>
        </select>
      </div>

      {/* Assets Grid / List */}
      <div className="space-y-3">
        {filteredAssets.map((ast) => (
          <div
            key={ast.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-slate-700"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{ast.title}</span>
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                    ast.moderationStatus === 'Approved'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : ast.moderationStatus === 'Pending'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}
                >
                  {ast.moderationStatus}
                </span>
              </div>

              <p className="text-xs text-slate-400">
                Creator: <span className="text-slate-200">{ast.creatorName}</span> • Category:{' '}
                <span className="text-purple-300">{ast.category}</span> • Format: {ast.fileFormat} ({ast.fileSize})
              </p>

              {/* Scans Badges */}
              <div className="flex items-center gap-2 font-mono text-[10px] pt-1">
                <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Virus Scan: {ast.virusScan}
                </span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  <Cpu className="w-3 h-3 text-cyan-400" />
                  Security Scan: {ast.securityScan}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {onOpenAssetDetail && (
                <button
                  onClick={() => onOpenAssetDetail(ast.id)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all"
                >
                  Inspect Docs
                </button>
              )}

              {ast.moderationStatus !== 'Approved' && (
                <button
                  onClick={() => handleApprove(ast)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all"
                >
                  Approve
                </button>
              )}

              {ast.moderationStatus !== 'Rejected' && (
                <button
                  onClick={() => handleReject(ast)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl transition-all"
                >
                  Reject
                </button>
              )}

              {ast.moderationStatus !== 'Hidden' && (
                <button
                  onClick={() => handleHide(ast)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all"
                >
                  Hide
                </button>
              )}

              <button
                onClick={() => handleDelete(ast)}
                className="p-2 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-xl transition-all"
                title="Delete Asset"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
