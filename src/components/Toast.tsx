import React from 'react';
import { useNotify, type NotificationKind } from '../contexts/NotificationContext';

/** @deprecated Use `useNotify()` from the NotificationContext instead.
 *  This component used to render a browser-level `position: fixed` toast
 *  that escaped the phone frame. It is now a thin shim that forwards to the
 *  in-app notification stack so nothing ever renders outside the device. */
export type ToastKind = NotificationKind;

interface LegacyToastProps {
  kind: ToastKind;
  message: string;
  visible: boolean;
  onDismiss: () => void;
  /** ms before auto-dismiss; defaults to 3000 */
  duration?: number;
}

/**
 * Backwards-compatible Toast component.
 *
 * It is now a no-op controller: when `visible` becomes true, it pushes a
 * notification into the scoped in-app stack (which renders inside the phone
 * frame). When `visible` flips off, it dismisses that same notification.
 *
 * For new code, call `useNotify().notify(...)` directly.
 */
export function Toast({ kind, message, visible, onDismiss, duration = 3000 }: LegacyToastProps) {
  const { notify, dismiss } = useNotify();
  const idRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (visible && !idRef.current) {
      idRef.current = notify({
        kind,
        title: message,
        duration: duration > 0 ? duration : 0,
      });
    } else if (!visible && idRef.current) {
      dismiss(idRef.current);
      idRef.current = null;
    }
    return () => {
      if (idRef.current) {
        dismiss(idRef.current);
        idRef.current = null;
      }
    };
  }, [visible, kind, message, duration, notify, dismiss]);

  // No JSX — the NotificationLayer renders the actual card.
  // Honour onDismiss so callers that flip `visible` to false cleanly remove the card.
  React.useEffect(() => {
    if (!visible) onDismiss();
  }, [visible, onDismiss]);

  return null;
}
