import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-3.5 bg-white dark:bg-[#102A24] border border-[#E2E6DF] dark:border-[#1E352F] rounded-lg shadow-lg text-sm text-[#18251F] dark:text-[#EAEFEA] transition-all transform translate-y-0"
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#16A36A]" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-[#D97706]" />}
            {toast.type === 'error' && <XCircle className="w-4 h-4 text-[#DC2626]" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-[#16A36A]" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-xs tracking-tight">{toast.title}</p>
            {toast.message && (
              <p className="text-xs text-[#737D75] dark:text-[#85948A] mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            )}
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="shrink-0 text-[#737D75] hover:text-[#18251F] dark:hover:text-white transition-colors"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
