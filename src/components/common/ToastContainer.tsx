import React from 'react';
import { useToast } from '../../context/ToastContext';
import { ToastMessage } from '../../types';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const getBorderColor = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/60 bg-emerald-950/80 text-emerald-200';
      case 'error':
        return 'border-red-500/60 bg-red-950/80 text-red-200';
      case 'warning':
        return 'border-amber-500/60 bg-amber-950/80 text-amber-200';
      case 'info':
      default:
        return 'border-muted-gold/60 bg-surface-container-high text-on-surface';
    }
  };

  const getIcon = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto border rounded-lg p-3 shadow-2xl backdrop-blur-md flex items-start gap-3 transition-all duration-300 animate-slide-up ${getBorderColor(
            toast.type
          )}`}
        >
          <span className="material-symbols-outlined text-lg shrink-0 mt-0.5">
            {getIcon(toast.type)}
          </span>

          <div className="flex-1 min-w-0">
            <h4 className="font-display font-semibold text-xs leading-tight">{toast.title}</h4>
            {toast.message && (
              <p className="text-[11px] opacity-90 mt-1 line-clamp-2 leading-snug">{toast.message}</p>
            )}

            {toast.actionLabel && toast.onAction && (
              <button
                onClick={() => {
                  toast.onAction!();
                  removeToast(toast.id);
                }}
                className="mt-2 text-[10px] font-display font-bold uppercase tracking-wider text-muted-gold hover:underline"
              >
                {toast.actionLabel} →
              </button>
            )}
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-xs opacity-60 hover:opacity-100 p-0.5"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
