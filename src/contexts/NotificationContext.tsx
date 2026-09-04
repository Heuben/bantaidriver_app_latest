import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  InfoIcon,
  TriangleAlertIcon,
  XIcon,
  type LucideIcon,
} from 'lucide-react';

export type NotificationKind = 'success' | 'error' | 'warning' | 'info';

export interface NotificationInput {
  kind?: NotificationKind;
  title: string;
  message?: string;
  /** ms before auto-dismiss. Use `0` for sticky. Defaults to 3500. */
  duration?: number;
  /** Optional action button rendered on the right. */
  action?: { label: string; onClick: () => void };
}

interface NotificationItem extends NotificationInput {
  id: string;
  kind: NotificationKind;
}

interface NotificationContextValue {
  notify: (input: NotificationInput) => string;
  dismiss: (id: string) => void;
  clear: () => void;
  items: NotificationItem[];
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function useNotify(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    // Provide a no-op fallback so components called from outside the provider
    // (e.g. the Splash screen) still work without crashing.
    return {
      notify: () => '',
      dismiss: () => undefined,
      clear: () => undefined,
      items: [],
    };
  }
  return ctx;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const timers = useRef(new Map<string, number>());

  const dismiss = useCallback((id: string) => {
    const t = timers.current.get(id);
    if (t !== undefined) {
      window.clearTimeout(t);
      timers.current.delete(id);
    }
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const notify = useCallback(
    (input: NotificationInput): string => {
      const id = `n-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const item: NotificationItem = {
        id,
        kind: input.kind ?? 'info',
        title: input.title,
        message: input.message,
        duration: input.duration ?? 3500,
        action: input.action,
      };
      setItems((prev) => [...prev, item]);
      if (item.duration && item.duration > 0) {
        const t = window.setTimeout(() => dismiss(id), item.duration);
        timers.current.set(id, t);
      }
      return id;
    },
    [dismiss]
  );

  const clear = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current.clear();
    setItems([]);
  }, []);

  const value = useMemo(
    () => ({ notify, dismiss, clear, items }),
    [notify, dismiss, clear, items]
  );

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
}

/**
 * NotificationLayer — renders the active toast stack.
 * MUST be mounted inside the phone frame so positioning stays scoped to the device.
 */
export function NotificationLayer() {
  const { items, dismiss } = useNotify();

  return (
    <div
      // Anchored to the top of the phone frame, below the status bar / notch.
      // `pointer-events-none` lets the rest of the UI stay interactive; each
      // toast re-enables pointer events on itself.
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none absolute inset-x-0 top-[110px] z-30 flex flex-col items-stretch gap-2 px-3 pt-1.5"
    >
      <AnimatePresence initial={false}>
        {items.map((n) => (
          <NotificationCard key={n.id} item={n} onDismiss={() => dismiss(n.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

const KIND_STYLES: Record<
  NotificationKind,
  { accent: string; Icon: LucideIcon; chip: string; ring: string }
> = {
  success: {
    accent: 'text-safe',
    Icon: CheckCircle2Icon,
    chip: 'bg-safe/15 text-safe',
    ring: 'shadow-[0_8px_28px_-10px_rgba(52,199,89,0.55),0_0_0_1px_rgba(52,199,89,0.18)]',
  },
  error: {
    accent: 'text-emergency',
    Icon: AlertCircleIcon,
    chip: 'bg-emergency/15 text-emergency',
    ring: 'shadow-[0_8px_28px_-10px_rgba(255,59,48,0.55),0_0_0_1px_rgba(255,59,48,0.22)]',
  },
  warning: {
    accent: 'text-[#9A5A00] dark:text-[#FFB340]',
    Icon: TriangleAlertIcon,
    chip: 'bg-warning/15 text-[#9A5A00] dark:text-[#FFB340]',
    ring: 'shadow-[0_8px_28px_-10px_rgba(255,159,10,0.55),0_0_0_1px_rgba(255,159,10,0.22)]',
  },
  info: {
    accent: 'text-accent',
    Icon: InfoIcon,
    chip: 'bg-accent/15 text-accent',
    ring: 'shadow-[0_8px_24px_-10px_rgba(10,132,255,0.55),0_0_0_1px_rgba(10,132,255,0.18)]',
  },
};

function NotificationCard({
  item,
  onDismiss,
}: {
  item: NotificationItem;
  onDismiss: () => void;
}) {
  const { Icon, chip, ring } = KIND_STYLES[item.kind];

  return (
    <motion.div
      layout
      role={item.kind === 'error' || item.kind === 'warning' ? 'alert' : 'status'}
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ duration: 0.32, ease: [0.34, 1.56, 0.64, 1] }}
      className={`pointer-events-auto relative overflow-hidden rounded-2xl border border-white/40 bg-white/80 backdrop-blur-glass dark:border-white/10 dark:bg-[#1C1C1E]/80 ${ring}`}
    >
      <div className="flex items-start gap-3 px-3.5 py-3">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${chip}`}
        >
          <Icon size={15} strokeWidth={2.4} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-semibold leading-snug tracking-[-0.005em] text-black dark:text-white">
            {item.title}
          </p>
          {item.message ? (
            <p className="mt-0.5 text-[12px] leading-snug text-[rgba(60,60,67,0.65)] dark:text-[rgba(235,235,245,0.65)]">
              {item.message}
            </p>
          ) : null}
        </div>
        {item.action ? (
          <button
            type="button"
            onClick={() => {
              item.action?.onClick();
              onDismiss();
            }}
            className="press-spring shrink-0 rounded-full bg-safe/15 px-2.5 py-1 text-[12px] font-semibold text-safe transition-colors duration-150 ease-ios active:bg-safe/25"
          >
            {item.action.label}
          </button>
        ) : null}
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="press-spring -mr-1 -mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[rgba(60,60,67,0.5)] transition-colors duration-150 ease-ios hover:bg-black/[0.05] active:bg-black/[0.1] dark:text-[rgba(235,235,245,0.55)] dark:hover:bg-white/[0.08] dark:active:bg-white/[0.14]"
        >
          <XIcon size={14} strokeWidth={2.4} />
        </button>
      </div>
    </motion.div>
  );
}
