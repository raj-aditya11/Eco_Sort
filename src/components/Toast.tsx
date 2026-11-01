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
          className="pointer-events-auto flex items-start gap-2.5 p-3 bg-[#FFFFFF] dark:bg-[#1C201C] border border-[#DCDDD4] dark:border-[#2B312B] rounded shadow-md text-xs text-[#252923] dark:text-[#E6E8E3] transition-all"
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#245B45] dark:text-[#3A7D63]" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-[#B77928]" />}
            {toast.type === 'error' && <XCircle className="w-4 h-4 text-[#A63F37]" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-[#245B45] dark:text-[#3A7D63]" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold tracking-tight">{toast.title}</p>
            {toast.message && (
              <p className="text-[11px] text-[#777B73] dark:text-[#9DA399] mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            )}
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="shrink-0 text-[#777B73] hover:text-[#252923] dark:hover:text-[#E6E8E3] transition-colors cursor-pointer"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
