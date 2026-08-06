import React, { useState } from 'react';
import {
  Bell,
  Send,
  AlertTriangle,
  Megaphone,
  UserCheck,
  Users,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { SensitiveActionPayload } from '../AdminJustificationModal';

interface SectionNotificationsProps {
  onTriggerAction: (payload: SensitiveActionPayload) => void;
}

export const SectionNotifications: React.FC<SectionNotificationsProps> = ({
  onTriggerAction,
}) => {
  const [targetGroup, setTargetGroup] = useState<'ALL' | 'DEVELOPERS' | 'CLIENTS'>('ALL');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'ANNOUNCEMENT' | 'MAINTENANCE' | 'ALERT'>('ANNOUNCEMENT');

  const [pastAnnouncements, setPastAnnouncements] = useState([
    {
      id: 'ann-1',
      title: 'Scheduled Platform Maintenance Notice',
      message: 'System upgrade scheduled on Aug 10, 2026, from 02:00 to 04:00 UTC.',
      target: 'ALL',
      type: 'MAINTENANCE',
      sentAt: '2026-08-01 10:00:00',
      sentBy: 'SuperAdmin',
    },
    {
      id: 'ann-2',
      title: 'New Escrow Auto-Release Threshold',
      message: 'Milestone auto-release period updated from 7 days to 5 days for Elite developers.',
      target: 'DEVELOPERS',
      type: 'ANNOUNCEMENT',
      sentAt: '2026-07-28 14:30:00',
      sentBy: 'SuperAdmin',
    },
  ]);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    onTriggerAction({
      title: `Send System Announcement to ${targetGroup}`,
      impactSummary: `Broadcasts push notification & banner alert to all online and offline users in group '${targetGroup}'.`,
      actionType: 'BROADCAST_NOTIFICATION',
      targetName: targetGroup,
      onConfirm: (reason) => {
        setPastAnnouncements((prev) => [
          {
            id: `ann-${Date.now()}`,
            title,
            message,
            target: targetGroup,
            type,
            sentAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            sentBy: 'SuperAdmin',
          },
          ...prev,
        ]);
        setTitle('');
        setMessage('');
      },
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-400" />
            SECTION 10 — System Broadcast & Notification Composer
          </h2>
          <p className="text-xs text-slate-400">
            Dispatch urgent platform announcements, maintenance notices, and targeted notifications to client or developer cohorts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Composer Form */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-purple-400" />
            Notification Broadcast Composer
          </h3>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            {/* Target Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Target Audience</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'ALL', label: 'All Users', icon: Megaphone },
                  { id: 'DEVELOPERS', label: 'Developers', icon: UserCheck },
                  { id: 'CLIENTS', label: 'Clients', icon: Users },
                ].map((tg) => {
                  const Icon = tg.icon;
                  return (
                    <button
                      key={tg.id}
                      type="button"
                      onClick={() => setTargetGroup(tg.id as any)}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        targetGroup === tg.id
                          ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notification Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Notice Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
              >
                <option value="ANNOUNCEMENT">Feature Announcement</option>
                <option value="MAINTENANCE">Scheduled Maintenance Alert</option>
                <option value="ALERT">Urgent Security Alert</option>
              </select>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Notification Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Platform Maintenance on Aug 10th..."
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Message Content</label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Provide details regarding the notification..."
                className="w-full h-28 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast System Notification</span>
            </button>
          </form>
        </div>

        {/* Right: Past Announcements History */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Broadcast History</h3>
          <div className="space-y-3">
            {pastAnnouncements.map((ann) => (
              <div key={ann.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800">
                    {ann.target}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{ann.sentAt}</span>
                </div>
                <h4 className="text-xs font-bold text-white">{ann.title}</h4>
                <p className="text-[11px] text-slate-300 leading-snug">{ann.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
