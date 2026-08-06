import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

interface AdminToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const AdminToast: React.FC<AdminToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          error: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          info: <Info className="w-5 h-5 text-purple-400 shrink-0" />,
        };

        const borders = {
          success: 'border-emerald-800 bg-slate-900/95',
          error: 'border-rose-800 bg-slate-900/95',
          warning: 'border-amber-800 bg-slate-900/95',
          info: 'border-purple-800 bg-slate-900/95',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl backdrop-blur-md flex items-start justify-between gap-3 animate-fade-in ${borders[toast.type]}`}
          >
            <div className="flex items-start gap-3 min-w-0">
              {icons[toast.type]}
              <div className="min-w-0 space-y-0.5">
                <h4 className="text-xs font-bold text-white">{toast.title}</h4>
                {toast.message && <p className="text-[11px] text-slate-300 leading-snug">{toast.message}</p>}
              </div>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
