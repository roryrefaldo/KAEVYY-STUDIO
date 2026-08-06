export const THEME_COLORS = {
  background: 'bg-slate-950',
  cardBackground: 'bg-slate-900',
  borderDefault: 'border-slate-800',
  borderHover: 'hover:border-amber-500/50',
  accentAmber: 'amber-500',
  accentEmerald: 'emerald-400',
  accentCyan: 'cyan-400',
  textPrimary: 'text-white',
  textSecondary: 'text-slate-400',
} as const;

export const STATUS_BADGE_CLASSES: Record<string, string> = {
  IN_PROGRESS: 'bg-blue-950 text-blue-300 border-blue-800',
  SUBMITTED: 'bg-amber-950 text-amber-300 border-amber-800',
  APPROVED: 'bg-emerald-950 text-emerald-300 border-emerald-800',
  REVISION_REQUESTED: 'bg-rose-950 text-rose-300 border-rose-800',
  COMPLETED: 'bg-emerald-950 text-emerald-300 border-emerald-800',
  CANCELLED: 'bg-slate-800 text-slate-400 border-slate-700',
};
