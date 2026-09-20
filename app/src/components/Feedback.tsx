import { useEffect, useRef } from "react";
import { AlertIcon, CloseIcon } from "./Icons";

export interface Toast {
  id: number;
  text: string;
  variant: "success" | "error";
  undo?: () => void;
}

export function Toasts({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast" data-variant={toast.variant}>
          <span className="toast-dot" />
          <span className="toast-text">{toast.text}</span>
          {toast.undo && (
            <button
              type="button"
              onClick={() => {
                toast.undo?.();
                onDismiss(toast.id);
              }}
            >
              Undo
            </button>
          )}
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => onDismiss(toast.id)}
          >
            <CloseIcon size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    confirmRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="dialog-scrim" onClick={onCancel}>
      <div
        className="dialog"
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="dialog-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <p className="banner banner-error" role="alert">
      <AlertIcon />
      {message}
    </p>
  );
}

export function SkeletonColumn() {
  return (
    <>
      {[0, 1].map((index) => (
        <div key={index} className="skeleton-card" aria-hidden="true">
          <div className="skeleton-line" style={{ width: "72%" }} />
          <div className="skeleton-line" style={{ width: "94%" }} />
          <div className="skeleton-line" style={{ width: "42%" }} />
        </div>
      ))}
    </>
  );
}
