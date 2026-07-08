"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/cn";

export type ToastVariant = "success" | "error" | "info" | "warning";

export interface Toast {
  id: number;
  variant: ToastVariant;
  title: string;
  description?: string;
  /** ms before auto-dismiss; 0 keeps it until dismissed. */
  duration?: number;
}

type ToastInput = Omit<Toast, "id">;

interface ToastContextValue {
  toast: (t: ToastInput) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/** Fire toasts from anywhere under <ToastProvider>. */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

const VARIANTS: Record<
  ToastVariant,
  { icon: string; ring: string; bar: string; iconBg: string }
> = {
  success: {
    icon: "✅",
    ring: "ring-emerald-200",
    bar: "bg-emerald-500",
    iconBg: "bg-emerald-50",
  },
  error: {
    icon: "⛔",
    ring: "ring-red-200",
    bar: "bg-red-500",
    iconBg: "bg-red-50",
  },
  warning: {
    icon: "🛠️",
    ring: "ring-orange-200",
    bar: "bg-orange-500",
    iconBg: "bg-orange-50",
  },
  info: {
    icon: "ℹ️",
    ring: "ring-sky-200",
    bar: "bg-sky-500",
    iconBg: "bg-sky-50",
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((t: ToastInput) => {
    const id = nextId.current++;
    setToasts((list) => [...list, { id, duration: 4000, ...t }]);
    return id;
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function Toaster({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-3 px-4 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:items-end"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: number) => void;
}) {
  const v = VARIANTS[toast.variant];

  useEffect(() => {
    if (!toast.duration) return;
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "toast-in pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-inset",
        v.ring,
      )}
    >
      <span className={cn("absolute inset-y-0 left-0 w-1", v.bar)} aria-hidden />
      <div className="flex items-start gap-3 py-3 pl-4 pr-3">
        <span
          className={cn(
            "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm",
            v.iconBg,
          )}
          aria-hidden
        >
          {v.icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
          {toast.description && (
            <p className="mt-0.5 text-sm text-slate-500">{toast.description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          aria-label="Dismiss notification"
          className="-mr-1 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M4 4l8 8M12 4l-8 8"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
