import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);

const DEFAULT_DURATION = 4000;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, { type = 'info', duration = DEFAULT_DURATION } = {}) => {
    const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    const toast = { id, message, type };
    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  const value = {
    showToast,
    showSuccess: (message, options) => showToast(message, { ...options, type: 'success' }),
    showError: (message, options) => showToast(message, { ...options, type: 'error' }),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center space-y-2 px-4 sm:inset-auto sm:bottom-4 sm:right-4 sm:items-end sm:justify-end sm:px-6">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={[
              'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm',
              'bg-[var(--surface-elevated)] text-[var(--text-primary)] border-[var(--border-subtle)]',
            ].join(' ')}
          >
            <div
              className={[
                'mt-1 h-2 w-2 rounded-full',
                toast.type === 'error'
                  ? 'bg-red-500'
                  : toast.type === 'success'
                  ? 'bg-emerald-500'
                  : 'bg-amber-400',
              ].join(' ')}
            />
            <div className="flex-1 text-sm leading-snug">
              {toast.message}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="ml-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              Close
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}

