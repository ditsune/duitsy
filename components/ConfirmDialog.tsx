'use client';

import { useEffect, useId, useRef } from 'react';

type ConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Pengganti confirm() native, supaya dialog hapus punya bahasa visual yang
 * sama dengan sheet lain dan tetap bisa ditutup dengan Escape.
 */
export default function ConfirmDialog({
  title,
  description,
  confirmLabel,
  cancelLabel = 'Batal',
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const el = ref.current;
    if (el && !el.open) el.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      role="alertdialog"
      aria-labelledby={titleId}
      aria-describedby={descId}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onCancel();
      }}
      onClick={(event) => {
        if (event.target === ref.current && !busy) onCancel();
      }}
      className="m-auto w-[min(92vw,360px)] rounded-card border border-line bg-paper-2 p-0 text-ink shadow-2xl"
    >
      <div className="p-4">
        <h2 id={titleId} className="text-sm font-semibold text-ink">
          {title}
        </h2>
        <p id={descId} className="mt-1.5 text-sm text-ink-2">
          {description}
        </p>
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={onCancel} disabled={busy} className="btn-quiet flex-1">
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} disabled={busy} className="btn-danger flex-1">
            {busy ? 'Menghapus...' : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
