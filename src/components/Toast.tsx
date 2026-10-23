import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  type?: ToastType;
  duration?: number;
  action?: ToastAction;
}

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
  action?: ToastAction;
}

interface ToastContextValue {
  showToast: (message: string, options?: ToastOptions) => void;
  success: (message: string, options?: Omit<ToastOptions, 'type'>) => void;
  error: (message: string, options?: Omit<ToastOptions, 'type'>) => void;
  info: (message: string, options?: Omit<ToastOptions, 'type'>) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const recentMessagesRef = useRef<Map<string, number>>(new Map());

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, options?: ToastOptions) => {
      const type = options?.type || 'info';
      // Default duration: 2500ms for success/info, 8000ms for error
      const defaultDuration = type === 'error' ? 8000 : 2500;
      const duration = options?.duration ?? defaultDuration;

      // Deduplication: prevent duplicate toast if same message was shown in the last 1500ms
      const now = Date.now();
      const lastShown = recentMessagesRef.current.get(message);
      if (lastShown && now - lastShown < 1500) {
        return;
      }
      recentMessagesRef.current.set(message, now);

      const id = `${now}-${Math.random().toString(36).substring(2, 7)}`;
      const newToast: ToastItem = {
        id,
        message,
        type,
        duration,
        action: options?.action,
      };

      setToasts((prev) => [...prev.slice(-2), newToast]); // Keep at most 3 active toasts

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }
    },
    [dismissToast]
  );

  const success = useCallback(
    (message: string, options?: Omit<ToastOptions, 'type'>) => {
      showToast(message, { ...options, type: 'success' });
    },
    [showToast]
  );

  const error = useCallback(
    (message: string, options?: Omit<ToastOptions, 'type'>) => {
      showToast(message, { ...options, type: 'error' });
    },
    [showToast]
  );

  const info = useCallback(
    (message: string, options?: Omit<ToastOptions, 'type'>) => {
      showToast(message, { ...options, type: 'info' });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, dismissToast }}>
      {children}

      {/* Toast Container */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-5 inset-x-4 sm:inset-x-auto sm:right-5 sm:left-auto z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full mx-auto sm:mx-0"
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';

          return (
            <div
              key={toast.id}
              role={isError ? 'alert' : 'status'}
              className={`pointer-events-auto rounded-xl p-3 sm:p-3.5 shadow-lg border flex items-center justify-between gap-3 text-xs transition-all duration-200 motion-reduce:transition-none ${
                isSuccess
                  ? 'bg-[#EBF3EE] border-[#1B4332]/20 text-[#143527]'
                  : isError
                  ? 'bg-[#FEF2F2] border-[#B91C1C]/25 text-[#7F1D1D]'
                  : 'bg-white border-[#E4E8E3] text-[#18221D]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {isSuccess && (
                  <CheckCircle2 className="w-4 h-4 text-[#1B4332] shrink-0" aria-hidden="true" />
                )}
                {isError && (
                  <AlertCircle className="w-4 h-4 text-[#B91C1C] shrink-0" aria-hidden="true" />
                )}
                {!isSuccess && !isError && (
                  <Info className="w-4 h-4 text-[#4E6559] shrink-0" aria-hidden="true" />
                )}
                <span className="font-medium leading-relaxed truncate">{toast.message}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {toast.action && (
                  <button
                    type="button"
                    onClick={() => {
                      toast.action?.onClick();
                      dismissToast(toast.id);
                    }}
                    className="font-bold underline hover:no-underline text-xs px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                  >
                    {toast.action.label}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => dismissToast(toast.id)}
                  aria-label="Dismiss notification"
                  className="p-1 rounded-md hover:bg-black/5 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
