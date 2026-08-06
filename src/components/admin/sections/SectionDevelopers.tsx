import React, { useState } from 'react';
import {
  UserCheck,
  Search,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Award,
  ArrowUpDown,
  RefreshCw,
  Eye,
  Sliders,
} from 'lucide-react';
import { AdminDeveloperItem } from '../../../types/adminControl';
import { SensitiveActionPayload } from '../AdminJustificationModal';

interface SectionDevelopersProps {
  developers: AdminDeveloperItem[];
  onTriggerAction: (payload: SensitiveActionPayload) => void;
  onRefreshData: () => void;
}

export const SectionDevelopers: React.FC<SectionDevelopersProps> = ({
  developers,
  onTriggerAction,
  onRefreshData,
}) => {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('ALL');
  const [verificationFilter, setVerificationFilter] = useState<string>('ALL');
  const [selectedProfile, setSelectedProfile] = useState<AdminDeveloperItem | null>(null);

  const filteredDevs = developers.filter((dev) => {
    const matchesSearch =
      dev.displayName.toLowerCase().includes(search.toLowerCase()) ||
      dev.handle.toLowerCase().includes(search.toLowerCase()) ||
      dev.email.toLowerCase().includes(search.toLowerCase());

    const matchesTier = tierFilter === 'ALL' || dev.tier === tierFilter;
    const matchesVerif = verificationFilter === 'ALL' || dev.verificationStatus === verificationFilter;

    return matchesSearch && matchesTier && matchesVerif;
  });

  const handleApproveVerif = (dev: AdminDeveloperItem) => {
    onTriggerAction({
      title: `Approve Developer Verification for ${dev.handle}`,
      impactSummary: `Verify developer profile and grant capacity access to claim active project tickets on platform.`,
      actionType: 'VERIFICATION_APPROVE',
      targetId: dev.id,
      targetName: dev.handle,
      onConfirm: (reason) => {
        dev.verificationStatus = 'VERIFIED';
        dev.tier = 'VERIFIED';
        dev.capacity = 3;
      },
    });
  };

  const handleRejectVerif = (dev: AdminDeveloperItem) => {
    onTriggerAction({
      title: `Reject Verification for ${dev.handle}`,
      impactSummary: `Reject developer application with moderation notes. Developer may re-apply in 14 days.`,
      actionType: 'VERIFICATION_REJECT',
      targetId: dev.id,
      targetName: dev.handle,
      onConfirm: (reason) => {
        dev.verificationStatus = 'REJECTED';
      },
    });
  };

  const handlePromoteElite = (dev: AdminDeveloperItem) => {
    onTriggerAction({
      title: `Promote ${dev.handle} to ELITE Tier`,
      impactSummary: `Upgrade developer to ELITE tier. Capacity increases to 5 active parallel projects.`,
      actionType: 'PROMOTE_ELITE',
      targetId: dev.id,
      targetName: dev.handle,
      onConfirm: (reason) => {
        dev.tier = 'ELITE';
        dev.capacity = 5;
      },
    });
  };

  const handleDowngradeTier = (dev: AdminDeveloperItem) => {
    onTriggerAction({
      title: `Downgrade ${dev.handle} to VERIFIED Tier`,
      impactSummary: `Set developer tier to VERIFIED. Capacity adjusts to 3 active parallel projects.`,
      actionType: 'DOWNGRADE_TIER',
      targetId: dev.id,
      targetName: dev.handle,
      onConfirm: (reason) => {
        dev.tier = 'VERIFIED';
        dev.capacity = 3;
      },
    });
  };

  const handleSuspendDev = (dev: AdminDeveloperItem) => {
    onTriggerAction({
      title: `Suspend Developer Account ${dev.handle}`,
      impactSummary: `Suspend developer profile immediately. Any active orders will trigger admin reassignment warning.`,
      actionType: 'SUSPEND_DEV',
      targetId: dev.id,
      targetName: dev.handle,
      onConfirm: (reason) => {
        dev.verificationStatus = 'REJECTED';
      },
    });
  };

  const handleResetCapacity = (dev: AdminDeveloperItem) => {
    onTriggerAction({
      title: `Reset Active Project Capacity for ${dev.handle}`,
      impactSummary: `Clears stale active project count back to 0 so developer can take new orders.`,
      actionType: 'RESET_CAPACITY',
      targetId: dev.id,
      targetName: dev.handle,
      onConfirm: (reason) => {
        dev.currentActiveProjects = 0;
      },
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-purple-400" />
            SECTION 3 — Developer Fleet Management & Vetting
          </h2>
          <p className="text-xs text-slate-400">
            Audit developer verification applications, tier elevations (Elite / Verified), active queue capacities, and account suspensions.
          </p>
        </div>

        <button
          onClick={onRefreshData}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-all self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, handle (@dev), or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Tier Select */}
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-purple-500 font-medium"
          >
            <option value="ALL">All Tiers</option>
            <option value="ELITE">Elite Tier</option>
            <option value="VERIFIED">Verified Tier</option>
            <option value="UNVERIFIED">Unverified</option>
          </select>

          {/* Verification Select */}
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-purple-500 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Verification</option>
            <option value="VERIFIED">Verified</option>
            <option value="REJECTED">Rejected / Suspended</option>
          </select>
        </div>
      </div>

      {/* Developers Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Developer</th>
                <th className="p-3.5">Tier</th>
                <th className="p-3.5">Rating</th>
                <th className="p-3.5">Completed Orders</th>
                <th className="p-3.5">Queue Capacity</th>
                <th className="p-3.5">Verification</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredDevs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-mono text-xs">
                    No developers match the specified filters.
                  </td>
                </tr>
              ) : (
                filteredDevs.map((dev) => (
                  <tr key={dev.id} className="hover:bg-slate-850/50 transition-colors">
                    {/* Developer Info */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={dev.avatar}
                          alt={dev.displayName}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-700"
                        />
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{dev.displayName}</span>
                            <span className="text-[11px] font-mono text-purple-400">{dev.handle}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono">{dev.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Tier */}
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                          dev.tier === 'ELITE'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : dev.tier === 'VERIFIED'
                            ? 'bg-purple-950 text-purple-300 border border-purple-800'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {dev.tier}
                      </span>
                    </td>

                    {/* Rating */}
                    <td className="p-3.5 font-mono text-amber-400 font-bold">
                      ★ {dev.rating.toFixed(2)}
                    </td>

                    {/* Completed Orders */}
                    <td className="p-3.5 font-mono text-white font-bold">
                      {dev.completedOrders} orders
                    </td>

                    {/* Queue Capacity */}
                    <td className="p-3.5">
                      <div className="space-y-1 font-mono">
                        <div className="text-slate-200 text-xs">
                          <strong className={dev.currentActiveProjects >= dev.capacity ? 'text-rose-400' : 'text-cyan-400'}>
                            {dev.currentActiveProjects}
                          </strong>{' '}
                          / {dev.capacity} Slots
                        </div>
                        <div className="w-24 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              dev.currentActiveProjects >= dev.capacity ? 'bg-rose-500' : 'bg-cyan-400'
                            }`}
                            style={{ width: `${Math.min(100, (dev.currentActiveProjects / dev.capacity) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Verification Status */}
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                          dev.verificationStatus === 'VERIFIED'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : dev.verificationStatus === 'PENDING'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {dev.verificationStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedProfile(dev)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                          title="View Full Profile Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {dev.verificationStatus === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleApproveVerif(dev)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold transition-all"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectVerif(dev)}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-bold transition-all"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {dev.verificationStatus === 'VERIFIED' && (
                          <>
                            {dev.tier !== 'ELITE' ? (
                              <button
                                onClick={() => handlePromoteElite(dev)}
                                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded-lg text-[10px] transition-all"
                              >
                                Promote Elite
                              </button>
                            ) : (
                              <button
                                onClick={() => handleDowngradeTier(dev)}
                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold transition-all"
                              >
                                Downgrade
                              </button>
                            )}

                            <button
                              onClick={() => handleResetCapacity(dev)}
                              className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 rounded-lg text-[10px] font-bold transition-all"
                              title="Reset Slot Count"
                            >
                              Reset
                            </button>

                            <button
                              onClick={() => handleSuspendDev(dev)}
                              className="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-lg text-[10px] font-bold transition-all"
                            >
                              Suspend
                            </button>
                          </>
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

      {/* View Profile Drawer Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedProfile.avatar}
                  alt={selectedProfile.displayName}
                  className="w-12 h-12 rounded-2xl object-cover border border-purple-500/40"
                />
                <div>
                  <h3 className="text-base font-bold text-white">{selectedProfile.displayName}</h3>
                  <p className="text-xs font-mono text-purple-400">{selectedProfile.handle} • {selectedProfile.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProfile(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Specialization</span>
                <p className="text-white font-sans font-semibold">{selectedProfile.specialization}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Joined Platform</span>
                <p className="text-white font-mono">{selectedProfile.joinedAt}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Skills & Competencies</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedProfile.skills.map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-lg bg-purple-950 text-purple-300 border border-purple-800 text-xs font-mono">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
